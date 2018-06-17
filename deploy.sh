#! /bin/bash

set -eux

rm -rf node_modules/

npm install --only=production

if aws s3 ls "s3://visitplannr" 2>&1 | grep -q 'NoSuchBucket'
then
  aws s3 mb s3://visitplannr
fi

sam package --template-file template.yaml \
  --s3-bucket visitplannr \
  --output-template-file packaged.yaml

sam deploy --template-file ./packaged.yaml \
  --stack-name visitplannr \
  --capabilities CAPABILITY_NAMED_IAM
