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
 * docker and dynamodb local `docker run -v "$PWD":/dynamodb_local_db -p 1337:8000 --network=lambda-local  cnadiminti/dynamodb-local:latest`
 * node
 * text editor
 * terminal

 to [set up the aws cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html)

  * `sudo easy_install pip`
  * `pip install awscli --upgrade --user`

# TODO

 [ ] get dynamodb integration working locally?
 [ ] make validation tidier - tech debt from rushing to integrate
 [ ] add a read model that can be piped to HTML via API Gateway
 [ ] add auth so some editors can propose and some can confirm
 [ ] ????
 [ ] profit
