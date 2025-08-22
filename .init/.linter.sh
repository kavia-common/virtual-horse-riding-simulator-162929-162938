#!/bin/bash
cd /home/kavia/workspace/code-generation/virtual-horse-riding-simulator-162929-162938/horse_riding_simulator_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

