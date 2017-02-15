var gulp = require('gulp');
var AlexaAppServer = require('alexa-app-server');

function alexaAppServerTask(){ 
    AlexaAppServer.start({
      server_root: __dirname,     // Path to root 
      public_html: "static", // Static content 
      app_dir: "dist",            // Location of alexa-app modules 
      app_root: "/alexa/",        // Service root 
      port: 8881                  // Port to use 
    });
}

gulp.task( 'alexa-app-server', alexaAppServerTask );

module.exports = alexaAppServerTask;
 
