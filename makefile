
start_sam_local:
	AWS_REGION=eu-west-2 sam local start-api --docker-network lambda-local

start_dynamo_local:
	docker start -d -v "$PWD":/dynamodb_local_db -p 8000:8000 --network lambda-local --name dynamodb cnadiminti/dynamodb-local

run_local: start_dynamo_local start_sam_local
