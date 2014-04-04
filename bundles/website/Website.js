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
    var self = this;
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

                    self.archiveFile(filePath, function() {
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

/**
 * Archive a file
 *
 * @param   {String}    filePath    The file path
 * @param   {Function}  callback    The callback
 */
proto.archiveFile = function(filePath, callback)
{
    var self = this;
    var fs = require('fs');
    var path = require('path');
    var async = require('async');

    // Normalize
    filePath = path.normalize(filePath);

    async.waterfall([
        // Get the metadatas
        function(next) {
            fs.stat(filePath, function(error, stats) {
                next(null, stats);
            });
        },

        // Create the directory if necessary
        function(stats, next) {
            var year = stats.mtime.getFullYear();
            var month = stats.mtime.getMonth() + 1;
            var day = stats.mtime.getDate();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            var baseDirectory = path.normalize(self.configuration.archivePath);
            var subDirectory = year + '-' + month + '-' + day;
            var newDirectory = baseDirectory + '/' + subDirectory;

            fs.exists(newDirectory, function(exists) {
                if (exists) {
                    next(null, newDirectory);
                    return;
                }

                fs.mkdir(newDirectory, function(error) {
                    if (error) {
                        next(error);
                        return;
                    }

                    next(null, newDirectory);
                });
            });
        },

        // Move the file
        function(newDirectory, next) {
            var sourceDirectory = path.dirname(filePath);
            var fileName = path.basename(filePath);
            var newFilePath = newDirectory + '/' + fileName;

            fs.rename(filePath, newFilePath, function() {
                next();
            });
        }
    ],

    function(error) {
        callback();
    });
};

module.exports = Website;
