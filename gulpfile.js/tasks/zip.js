var gulp = require('gulp');
var zip = require('gulp-zip');

function zipTask() {
  return gulp.src(['dist/**/*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
}

gulp.task('zip', zipTask );

module.exports = zipTask;