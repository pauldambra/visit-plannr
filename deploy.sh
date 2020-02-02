#! /bin/bash

set -eux

function installAWScli() {
  curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
  unzip awscliv2.zip
  ./aws/install
}

function installAwsSam(){
	echo "Install aws-sam-cli ${INPUT_SAM_VERSION}"
	if [ "${INPUT_SAM_VERSION}" == "latest" ]; then
		pip install aws-sam-cli >/dev/null 2>&1
		if [ "${?}" -ne 0 ]; then
			echo "Failed to install aws-sam-cli ${INPUT_SAM_VERSION}"
		else
			echo "Successful install aws-sam-cli ${INPUT_SAM_VERSION}"
		fi
	else
		pip install aws-sam-cli==${INPUT_SAM_VERSION} >/dev/null 2>&1
		if [ "${?}" -ne 0 ]; then
			echo "Failed to install aws-sam-cli ${INPUT_SAM_VERSION}"
		else
			echo "Successful install aws-sam-cli ${INPUT_SAM_VERSION}"
		fi
	fi
}

rm -rf node_modules/

npm ci --only=production

installAwsSam()
installAWScli()

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
