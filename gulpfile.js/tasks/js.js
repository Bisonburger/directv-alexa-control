var gulp = require('gulp');

var srcFilesList =['index.js','channel-map.js','whats-on.js']; 
var dest = 'dist/';

function jsTask() {
  return gulp.src(srcFilesList)
    .pipe(gulp.dest(dest));
}
gulp.task('js', jsTask );

module.exports = jsTask;

