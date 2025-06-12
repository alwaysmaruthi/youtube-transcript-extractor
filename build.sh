#!/bin/bash

# Build script for Vercel deployment
echo "Building frontend for production..."

cd frontend
npm install
npm run build

echo "Frontend build complete!"

# Copy build files to root for Vercel routing
cp -r build/* ../

echo "Build process complete!"