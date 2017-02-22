var gulp = require('gulp');
var install = require('gulp-install');

var dest = 'dist/';

function nodeModulesTask() {
  return gulp.src('./package.json')
    .pipe(gulp.dest(dest))
    .pipe(install({production: true}));
}

gulp.task('node-modules', nodeModulesTask );
module.exports = nodeModulesTask;

