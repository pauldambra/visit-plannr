#! /bin/bash

rm -rf node_modules/
npm install --only=production
aws s3 mb s3://visitplannr
sam package --template-file template.yaml --s3-bucket visitplannr --output-template-file packaged.yaml
sam deploy --template-file ./packaged.yaml --stack-name visitplannr --capabilities CAPABILITY_IAM
