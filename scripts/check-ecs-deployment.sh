#!/bin/bash

# Script to check ECS deployment status and environment variables
# Usage: ./scripts/check-ecs-deployment.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}
CLUSTER_NAME="helixium-cluster"

if [ "$ENVIRONMENT" = "dev" ]; then
    SERVICE_NAME="helixium-dev-service"
    TASK_DEF_NAME="helixium-dev"
    EXPECTED_DEPLOYMENT_ENV="dev"
    EXPECTED_NODE_ENV="development"
elif [ "$ENVIRONMENT" = "prod" ]; then
    SERVICE_NAME="helixium-service"
    TASK_DEF_NAME="helixium"
    EXPECTED_DEPLOYMENT_ENV="prod"
    EXPECTED_NODE_ENV="production"
else
    echo "❌ Invalid environment. Use 'dev' or 'prod'"
    exit 1
fi

echo "🔍 Checking $ENVIRONMENT environment deployment..."
echo "=============================================="

echo ""
echo "📋 Service Status:"
aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME \
    --query 'services[0].{ServiceName:serviceName,TaskDefinition:taskDefinition,DesiredCount:desiredCount,RunningCount:runningCount,Status:status}' \
    --output table

echo ""
echo "📝 Current Task Definition Environment Variables:"
CURRENT_TASK_DEF=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].taskDefinition' --output text)
aws ecs describe-task-definition --task-definition $CURRENT_TASK_DEF \
    --query 'taskDefinition.containerDefinitions[0].environment' \
    --output table

echo ""
echo "🔍 Environment Variable Validation:"
DEPLOYMENT_ENV=$(aws ecs describe-task-definition --task-definition $CURRENT_TASK_DEF \
    --query 'taskDefinition.containerDefinitions[0].environment[?name==`DEPLOYMENT_ENV`].value' \
    --output text)
NODE_ENV=$(aws ecs describe-task-definition --task-definition $CURRENT_TASK_DEF \
    --query 'taskDefinition.containerDefinitions[0].environment[?name==`NODE_ENV`].value' \
    --output text)

echo "Expected DEPLOYMENT_ENV: $EXPECTED_DEPLOYMENT_ENV"
echo "Actual DEPLOYMENT_ENV:   $DEPLOYMENT_ENV"
if [ "$DEPLOYMENT_ENV" = "$EXPECTED_DEPLOYMENT_ENV" ]; then
    echo "✅ DEPLOYMENT_ENV is correct"
else
    echo "❌ DEPLOYMENT_ENV is incorrect!"
fi

echo ""
echo "Expected NODE_ENV: $EXPECTED_NODE_ENV"
echo "Actual NODE_ENV:   $NODE_ENV"
if [ "$NODE_ENV" = "$EXPECTED_NODE_ENV" ]; then
    echo "✅ NODE_ENV is correct"
else
    echo "❌ NODE_ENV is incorrect!"
fi

echo ""
echo "🏃 Running Tasks:"
TASKS=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns' --output text)
if [ -n "$TASKS" ] && [ "$TASKS" != "None" ]; then
    for task in $TASKS; do
        echo "Task: $task"
        aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $task \
            --query 'tasks[0].{TaskArn:taskArn,LastStatus:lastStatus,HealthStatus:healthStatus,CreatedAt:createdAt}' \
            --output table
    done
else
    echo "No running tasks found"
fi

echo ""
echo "📊 Recent Service Events:"
aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME \
    --query 'services[0].events[:3]' --output table

echo ""
echo "✅ Check completed!"