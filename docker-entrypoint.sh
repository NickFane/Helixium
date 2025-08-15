#!/bin/sh

# Docker entrypoint script for Helixium
# This script injects runtime environment variables into the HTML before starting nginx

set -e

# Default values
DEPLOYMENT_ENV=${DEPLOYMENT_ENV:-prod}

echo "🚀 Starting Helixium container..."
echo "📋 Environment Variables:"
echo "   DEPLOYMENT_ENV: $DEPLOYMENT_ENV"
echo "   NODE_ENV: ${NODE_ENV:-not set}"
echo "   PWD: $(pwd)"
echo "   USER: $(whoami)"

# Check if index.html exists and show its current state
if [ -f "/usr/share/nginx/html/index.html" ]; then
    echo "📄 Found index.html, checking for placeholder..."
    if grep -q "{{DEPLOYMENT_ENV}}" /usr/share/nginx/html/index.html; then
        echo "✅ Placeholder {{DEPLOYMENT_ENV}} found in index.html"
    else
        echo "⚠️  Placeholder {{DEPLOYMENT_ENV}} NOT found in index.html"
        echo "📄 Current window.__RUNTIME_CONFIG__ section:"
        grep -A 3 -B 1 "window.__RUNTIME_CONFIG__" /usr/share/nginx/html/index.html || echo "   No runtime config section found"
    fi
else
    echo "❌ index.html not found at /usr/share/nginx/html/index.html"
    echo "📁 Contents of /usr/share/nginx/html:"
    ls -la /usr/share/nginx/html/ || echo "   Directory not accessible"
fi

# Replace placeholder in index.html with actual environment variable
echo "🔧 Injecting runtime environment variables..."
sed -i "s/{{DEPLOYMENT_ENV}}/$DEPLOYMENT_ENV/g" /usr/share/nginx/html/index.html

# Verify the replacement worked
echo "🔍 Verifying environment variable injection..."
if grep -q "DEPLOYMENT_ENV: '$DEPLOYMENT_ENV'" /usr/share/nginx/html/index.html; then
    echo "✅ Environment variable injection successful"
    echo "📄 Updated window.__RUNTIME_CONFIG__ section:"
    grep -A 3 -B 1 "window.__RUNTIME_CONFIG__" /usr/share/nginx/html/index.html
else
    echo "❌ Environment variable injection may have failed"
    echo "📄 Current window.__RUNTIME_CONFIG__ section:"
    grep -A 3 -B 1 "window.__RUNTIME_CONFIG__" /usr/share/nginx/html/index.html || echo "   No runtime config section found"
fi

# Start nginx
echo "🌐 Starting nginx..."
exec nginx -g "daemon off;"