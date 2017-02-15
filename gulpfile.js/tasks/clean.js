var gulp = require('gulp');
var del = require('del');

function cleanTask(){ del(['./dist', './dist.zip']) }

gulp.task('clean', cleanTask);

module.exports = cleanTask;