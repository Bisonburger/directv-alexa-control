var gulp = require('gulp');
var runSequence = require('run-sequence');

require('./clean' );
require('./js' );
require('./node-mods' );
require('./zip' );
require('./aws-upload' );

function deployTask() {
  return runSequence(
    ['clean'],
    ['js', 'node-mods'],
    ['zip'],
    ['aws-upload']
  );
}
gulp.task('deploy', deployTask );

module.exports = deployTask;