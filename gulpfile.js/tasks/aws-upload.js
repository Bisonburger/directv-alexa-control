var gulp = require('gulp');
var awsLambda = require("node-aws-lambda");
 
function awsUploadTask() {
  awsLambda.deploy('./dist.zip', require("../../lambda-config.js") );
}
 
gulp.task('aws-upload', awsUploadTask );
module.exports = awsUploadTask;