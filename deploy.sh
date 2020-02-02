#! /bin/bash

set -eux

rm -rf node_modules/

npm ci --only=production


# install aws sam cli
sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"
test -d ~/.linuxbrew && eval $(~/.linuxbrew/bin/brew shellenv)
test -d /home/linuxbrew/.linuxbrew && eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
test -r ~/.bash_profile && echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.bash_profile
echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.profile
brew tap aws/tap
brew install aws-sam-cli

# install the aws cli
curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

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
