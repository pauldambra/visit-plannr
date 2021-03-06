#! /bin/bash
# use this to create a table when developing locally

aws dynamodb create-table \
  --table-name visitplannr-events \
  --attribute-definitions \
        AttributeName=EventId,AttributeType=S AttributeName=StreamName,AttributeType=S \
  --key-schema AttributeName=StreamName,KeyType=HASH AttributeName=EventId,KeyType=RANGE \
  --provisioned-throughput \
  ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url http://0.0.0.0:8000
