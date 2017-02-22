var gulp = require('gulp');
var awsLambda = require("node-aws-lambda");

var zipFile = './dist.zip';
var configuration= require("../../lambda-config.js"); 

function awsUploadTask(callback) {
  awsLambda.deploy(zipFile,configuration,callback);
}

gulp.task('aws-upload', awsUploadTask );
module.exports = awsUploadTask;
