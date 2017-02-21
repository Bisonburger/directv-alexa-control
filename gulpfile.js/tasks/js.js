var gulp = require('gulp');

function jsTask() {
  return gulp.src(['index.js','channel-map.js','whats_on.js'])
    .pipe(gulp.dest('dist/'));
}
gulp.task('js', jsTask );

module.exports = jsTask;

