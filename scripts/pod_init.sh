#!/bin/bash


cd "$(dirname $0)/.." || exit


./scripts/inject_config.sh


echo "starting server..."
serve -s build
