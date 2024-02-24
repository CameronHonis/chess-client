#!/bin/bash


cd "$(dirname $0)/.." || exit


echo "setting REACT_APP_ARBITRATOR_URL"
if [[ -z $REACT_APP_ARBITRATOR_URL ]]; then
  echo "REACT_APP_ARBITRATOR_URL not set, looking at kubernetes service config..."
  if [[ -z $ARBITRATOR_SERVICE_PORT_8080_TCP_ADDR ]]; then
    echo "ARBITRATOR_SERVICE_PORT_8080_TCP_ADDR not set, using default"
    export REACT_APP_ARBITRATOR_URL="http://localhost:8079"
  else
    echo "using arbitrator service at $ARBITRATOR_SERVICE_PORT_8080_TCP_ADDR"
    export REACT_APP_ARBITRATOR_URL=$ARBITRATOR_SERVICE_PORT_8080_TCP_ADDR:8079
  fi
else
  echo "arbitrator url already set: $REACT_APP_ARBITRATOR_URL"
fi


./scripts/inject_config.sh


echo "starting server..."
serve -s build
