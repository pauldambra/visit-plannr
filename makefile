
start_sam_local:
	AWS_REGION=eu-west-2 sam local start-api --docker-network lambda-local

start_dynamo_local:
	docker start dynamodb

run_local: start_dynamo_local start_sam_local
