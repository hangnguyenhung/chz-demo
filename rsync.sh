#!/bin/bash

# Path to the project directory
# PROJECT_DIR="/Volumes/ssd/Documents/chz-new"
PROJECT_DIR="/Users/hunghang/Documents/chz-new"

# Remote server details
REMOTE_USER="root"
REMOTE_HOST="147.93.106.119"
REMOTE_DIR="/zserver/node/chz"

# Application name in pm2
PM2_APP_NAME="nextjs_app"

# Navigate to the project directory
cd "$PROJECT_DIR" || { echo "Unable to access project directory"; exit 1; }


rsync -avz --delete package.json "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

# Check if rsync was successful
if [ $? -ne 0 ]; then
  echo "Synchronization failed."
  exit 1
fi


echo "Deployment completed successfully."
