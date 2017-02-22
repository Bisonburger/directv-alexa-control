var gulp = require('gulp');
var del = require('del');


var cleanFileList = ['./dist', './dist.zip', './node_modules'];

function realCleanTask() {
  return del( cleanFileList );
}
gulp.task('real-clean', realCleanTask);

module.exports = realCleanTask;