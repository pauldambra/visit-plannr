# Visit-Plannr [![Coverage Status](https://coveralls.io/repos/github/pauldambra/visit-plannr/badge.svg?branch=master)](https://coveralls.io/github/pauldambra/visit-plannr?branch=master) [![Build Status](https://travis-ci.org/pauldambra/visit-plannr.svg?branch=master)](https://travis-ci.org/pauldambra/visit-plannr)

See [my blog series for context](https://pauldambra.github.io/2018/02/serverless-1.html)

[![](https://codescene.io/projects/2900/status.svg) Get more details at **codescene.io**.](https://codescene.io/projects/2900/jobs/latest-successful/results)

# Editing

People will need to create and set details of destinations

The minimum for a destination is a geolocation and a name

# Tech?

Let's assume API Gateway and lambda and see what the what

# Needed?

 a docker network

 `docker network create lambda-local`

 * sam local `AWS_REGION=eu-west-2 sam local start-api --docker-network lambda-local`
 * test with `curl -H "Content-Type: application/json" -X POST -d '{"geolocation":"xyz", "name":"test"}' http://127.0.0.1:3000/destination`
 * docker and dynamodb local

 `docker run -d -v "$PWD":/dynamodb_local_db -p 8000:8000 --network lambda-local --name dynamodb cnadiminti/dynamodb-local`
 * node
 * text editor
 * terminal

 to [set up the aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html)

  * `sudo easy_install pip`
  * `pip install awscli --upgrade --user`

# To run integration tests

`AWS_REGION=eu-west-2 sam local start-api --docker-network lambda-local`
`docker run -d -v "$PWD":/dynamodb_local_db -p 8000:8000 --network lambda-local --name dynamodb cnadiminti/dynamodb-local`
`./node_modules/.bin/mocha integration-tests`

# Deploying infrastructure

`sam package --template-file ./static-infra-template.yml --s3-bucket visitplannr --output-template-file static-packaged.yaml`

followed by

`aws cloudformation deploy --template-file /Users/pauldambra/Documents/git/visitplannr/static-packaged.yaml --stack-name vistplannr-static  --capabilities CAPABILITY_IAM`

# TODO

 - [x] get dynamodb integration working locally?
 - [ ] make validation tidier - tech debt from rushing to integrate
 - [ ] add a read model that can be piped to HTML via API Gateway
 - [ ] add auth so some editors can propose and some can confirm
 - [ ] policies for finer grained access in SAM template
 - [ ] SAM for autoscaling dynamodb
 - [ ] ????
 - [ ] profit
