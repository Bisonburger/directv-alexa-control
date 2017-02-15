/**
 * Karma configuration file for unit testing of SSV
 */
module.exports = function(config) {
  config.set({

    /*
     * Point Karma's base directory to src/main/resources/static
     * This is what would be served from the web when deployed
     */
    basePath: '..',

    /*
     * Use jasmine & requirejs
     */
    frameworks: ['jasmine'],

    files: ['index.js', {
        pattern: 'tests/*-spec.js',
        included: true
      }
    ],

    // exclude some files/patterns 
    exclude: [],

    // use progress and coverage to report the results
    reporters: ['progress', 'coverage', 'html'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['IE_no_addons'],
    
    customLaunchers: {
      IE_no_addons: {
        base: 'IE',
        flags: ['-extoff']
      }  
    },

    // one run and done; vs run continuously
    singleRun: true,

    // configure the coverage pre-processor to only look at the developed files (vs tests, etc.)
    preprocessors: {
      'index.js': ['coverage']
    },

    // setup the coverage reporter to output html to the coverage subdirectory
    coverageReporter: {
      type: 'html',
      dir: 'coverage',
      subdir: '.',
      includeAllSources: true
    },
    
    htmlReporter: {
      outputDir: 'html-results'
    }
  });
};
