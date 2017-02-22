var gulp = require('gulp');
var zip = require('gulp-zip');

var srcFilesList = ['dist/**/*', '!dist/package.json']; 
var zipFile = 'dist.zip';
var dest = './';

function zipTask() {
  return gulp.src(srcFilesList)
    .pipe(zip(zipFile))
    .pipe(gulp.dest(dest));
}

gulp.task('zip', zipTask);
module.exports = zipTask;