var gulp = require('gulp');
var del = require('del');


var cleanFileList = ['./dist', './dist.zip'];

function cleanTask() {
  return del( cleanFileList );
}
gulp.task('clean', cleanTask);

module.exports = cleanTask;