#!/bin/bash
cd /home/kavia/workspace/code-generation/paper_20250923-1542-18351/BackendServices
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

