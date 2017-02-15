var gulp = require('gulp');
var install = require('gulp-install');

function nodeModsTask() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}));
}

gulp.task('node-mods', nodeModsTask );

module.exports = nodeModsTask;