var AlexaAppServer = require('alexa-app-server');

    AlexaAppServer.start({
      server_root: './server',     // Path to root 
      app_dir: '..',            // Location of alexa-app modules 
      port: 8881                  // Port to use 
    });
