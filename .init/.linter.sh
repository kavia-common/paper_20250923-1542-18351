#!/bin/bash
cd /home/kavia/workspace/code-generation/sanjay_paper_22102025-paper_20250923-1542-18351-21859/ClinicalWebInterface
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

