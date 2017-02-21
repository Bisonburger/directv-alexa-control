var gulp = require('gulp');
var awsLambda = require("node-aws-lambda");

function awsUploadTask(callback) {
  awsLambda.deploy('./dist.zip', require("../../lambda-config.js"),callback);
}

gulp.task('aws-upload', awsUploadTask );
module.exports = awsUploadTask;
