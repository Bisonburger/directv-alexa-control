var gulp = require('gulp');

function jsTask() {
  return gulp.src('index.js')
    .pipe(gulp.dest('dist/'));
}

gulp.task('js', jsTask);