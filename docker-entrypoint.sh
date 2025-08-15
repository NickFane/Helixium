#!/bin/sh

# Docker entrypoint script for Helixium
# This script injects runtime environment variables into the HTML before starting nginx

set -e

# Default values
DEPLOYMENT_ENV=${DEPLOYMENT_ENV:-prod}

echo "🚀 Starting Helixium container..."
echo "📋 DEPLOYMENT_ENV: $DEPLOYMENT_ENV"

# Replace placeholder in index.html with actual environment variable
echo "🔧 Injecting runtime environment variables..."
sed -i "s/{{DEPLOYMENT_ENV}}/$DEPLOYMENT_ENV/g" /usr/share/nginx/html/index.html

echo "✅ Environment variables injected successfully"

# Start nginx
echo "🌐 Starting nginx..."
exec nginx -g "daemon off;"