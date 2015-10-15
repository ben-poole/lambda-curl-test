# lambda-curl-test

## Description

A very simple Node.js Lambda function which:
* Fires up following a POST to an API endpoint (e.g. from scheduler app)
* Accepts a single URI parameter in the post body
* Curls the supplied URI using child_process
* On the process callback, extracts the response headers (results)
* Uses a HTTP client to post those results to an API (e.g. to receiver app)

## Installation
* Visit the AWS Lambda console: https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/home
* Create a new function with a Node.js runtime (skip blueprint picker)
* Paste in the contents of index.js
* Create (or select existing) Lambda basic execution role
* API Endpoints -> Add API endpoint 
** Type: API Gateway
** Method: POST
** Security: Open

Test invocation of plugin:
curl -X POST -d '{"uri":"www.aerian.com"}' --header "Content-Type:application/json" https://9vu6dew62a.execute-api.eu-west-1.amazonaws.com/dev/testCurl

Tail the access logs of the 'callbackUri' and wait for the callbackPost.
