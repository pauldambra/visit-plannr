#! /bin/bash

aws dynamodb create-table \
  --table-name visitplannr-events \
  --attribute-definitions \
        AttributeName=EventId,AttributeType=S AttributeName=StreamName,AttributeType=S \
  --key-schema AttributeName=EventId,KeyType=HASH AttributeName=StreamName,KeyType=RANGE \
  --provisioned-throughput \
  ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url http://0.0.0.0:8000