var solfege = require('solfegejs');

/**
 * The archive controller
 */
var Archive = solfege.util.Class.create(function()
{
    var services = solfege.kernel.Services;
    var application = services.get('application');
    var website = application.getBundle('website');

    this.configuration = website.configuration;

}, 'website.controllers.Archive');
var proto = Archive.prototype;

/**
 * The website configuration
 *
 * @type {Object}
 */
proto.configuration;

/**
 * The main view
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.index = function*(request, response)
{
    var fs = require('fs');
    var title = this.configuration.title;
    var archivePath = this.configuration.archivePath;

    response.parameters.title = title;
    response.statusCode = 200;
    yield response.render('archives.swig');
};


module.exports = Archive;
