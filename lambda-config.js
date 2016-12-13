// https://www.npmjs.com/package/node-aws-lambda

module.exports = {
  region: 'us-east-1',
  handler: 'index.handler',
  role: 'arn:aws:iam::802081430568:role/lambda_basic_execution',
  functionName: 'DirecTV_Whats_On',
  timeout: 10,
  memorySize: 128
}

