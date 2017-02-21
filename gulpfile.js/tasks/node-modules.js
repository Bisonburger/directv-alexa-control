var gulp = require('gulp');
var install = require('gulp-install');

function nodeModulesTask() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}));
}

gulp.task('node-modules', nodeModulesTask );
module.exports = nodeModulesTask;

