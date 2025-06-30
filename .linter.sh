#!/bin/bash
cd /home/kavia/workspace/code-generation/notiongraph-ai-96118-fa2df22e/frontend_app
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

