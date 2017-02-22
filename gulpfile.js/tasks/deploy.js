var gulp = require('gulp');
var runSequence = require('run-sequence');

function deployTask(callback) {
  return runSequence(
    ['clean'],
    ['js', 'node-modules'],
    ['zip'],
    ['aws-upload'],
    callback
  );
}

gulp.task('deploy', deployTask );
module.exports = deployTask;