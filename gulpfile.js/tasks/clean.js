var gulp = require('gulp');
var del = require('del');


function cleanTask() {
  return del(['./dist', './dist.zip']);
}
gulp.task('clean', cleanTask);

module.exports = cleanTask;