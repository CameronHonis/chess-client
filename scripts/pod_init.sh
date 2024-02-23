#!/bin/bash

cd "$(dirname $0)/.." || exit

export REACT_APP_ARBITRATOR_URL=$ARBITRATOR_SERVICE_PORT_8080_TCP_ADDR:8080

./scripts/inject_config.sh

echo "starting server..."
serve -s build
