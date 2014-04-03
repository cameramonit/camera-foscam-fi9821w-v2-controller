var solfege = require('solfegejs');

/**
 * The website bundle
 */
var Website = solfege.util.Class.create(function()
{
    // Initialize properties
    this.controllers = require('./controllers');

}, 'website.Website');
var proto = Website.prototype;


/**
 * The directory path of the class
 *
 * @type {string}
 * @api public
 */
proto.__dirname = __dirname;

/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * The controller package
 *
 * @type {Object}
 * @api public
 */
proto.controllers;

/**
 * The configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * Override the current configuration
 *
 * @param   {Object}    customConfiguration     The custom configuration
 */
proto.overrideConfiguration = function*(customConfiguration)
{
    this.configuration = customConfiguration;
};


/**
 * Set the application
 *
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;

    // Set listeners
    var bindGenerator = solfege.util.Function.bindGenerator;
    this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
};

/**
 * Executed when the application starts
 */
proto.onApplicationStart = function*()
{
    var fs = require('fs');
    var async = require('async');
    var services = solfege.kernel.Services;
    var directory = this.configuration.snapshotsPath;
    var limit = this.configuration.limit;

    // @todo The controller must be able to access to the application
    services.register('application', this.application);
    services.register('snapshotsPath', directory);

    // Remove old files
    var removeInProgress = false;
    setInterval(function() {
        if (removeInProgress) {
            return;
        }

        removeInProgress = true;
        fs.readdir(directory, function(error, files) {
            var fileIndex = 0;
            var fileCount = files.length;
            async.whilst(
                function() {
                    return fileIndex < fileCount - limit;
                },
                function(next) {
                    var filePath = directory + '/' + files[fileIndex];

                    fs.unlink(filePath, function() {
                        fileIndex++;
                        next();
                    });
                },
                function() {
                    removeInProgress = false;
                }
            );
        });
    }, 1000);
};

module.exports = Website;
