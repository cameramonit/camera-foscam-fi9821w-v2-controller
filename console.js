var solfege = require('solfegejs');

// Initialize the application
var application = new solfege.kernel.Application(__dirname);

// Add the external bundles
var solfegeServer = require('solfegejs-server');
var solfegeServerCompression = require('solfegejs-server-compression');
var solfegeServerStatic = require('solfegejs-server-static');
var solfegeServerRouter = require('solfegejs-server-router');
var solfegeSass = require('solfegejs-sass');
var solfegeAssets = require('solfegejs-assets');
var solfegeSwig = require('solfegejs-swig');
var solfegeCli = require('solfegejs-cli');
application.addBundle('swig',       new solfegeSwig.Engine);
application.addBundle('server',     new solfegeServer.HttpServer);
application.addBundle('deflate',    new solfegeServerCompression.Deflate);
application.addBundle('gzip',       new solfegeServerCompression.Gzip);
application.addBundle('static',     new solfegeServerStatic.Static);
application.addBundle('router',     new solfegeServerRouter.Router);
application.addBundle('sass',       new solfegeSass.Engine);
application.addBundle('assets',     new solfegeAssets.Manager);
application.addBundle('console',    new solfegeCli.Console);

// Add the internal bundles
var Website = require('./bundles/website/Website');
application.addBundle('website', new Website);

// Override the configuration
var configuration = require(__dirname + '/config/default.js');
application.overrideConfiguration(configuration);

// Start the application
application.start();

