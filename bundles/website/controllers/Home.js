var solfege = require('solfegejs');

/**
 * The home controller
 */
var Home = solfege.util.Class.create(function()
{
    var services = solfege.kernel.Services;
    var application = services.get('application');
    var website = application.getBundle('website');

    this.configuration = website.configuration;

}, 'website.controllers.Home');
var proto = Home.prototype;

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
    var title = this.configuration.title;

    response.parameters.title = title;
    response.parameters.random = new Date().getTime();
    response.statusCode = 200;
    yield response.render('index.swig');
};

/**
 * The admin view
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.admin = function*(request, response)
{
    var title = this.configuration.title;
    var presets = this.configuration.presets;

    response.parameters.title = title;
    response.parameters.presets = presets;
    response.statusCode = 200;
    yield response.render('admin.swig');
};


/**
 * The last snapshot
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.lastSnapshot = function*(request, response)
{
    var fs = require('fs');
    var FileSystemUtil = require('../utils/FileSystemUtil');

    var directory = this.configuration.snapshotsPath;
    var lastFileName = yield FileSystemUtil.getLastFile(directory);
    var lastSnapshotPath = directory + '/' + lastFileName;

    response.statusCode = 200;
    response.body = fs.createReadStream(lastSnapshotPath);
};

/**
 * Get configuration
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.config = function*(request, response)
{
    var name = request.getParameter('name');

    var value = yield this.getConfiguration(name);

    response.statusCode = 200;
    response.body = value;
};

/**
 * Execute an action
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.action = function*(request, response)
{
    var http = require('http');
    var async = require('async');
    var id = request.getParameter('id');
    var value = request.getParameter('value');
    var services = solfege.kernel.Services;
    var application = services.get('application');
    var website = application.getBundle('website');
    var presets = website.configuration.presets;
    var hostname = website.configuration.hostname;
    var port = website.configuration.port;
    var login = website.configuration.login;
    var password = website.configuration.password;
    var commands;

    // getPTZPresetPointList
    // ptzAddPresetPoint&name=Salon

    switch (id) {
        default:
            response.statusCode = 404;
            response.body = 'ERROR';
            return;
        case 'up':
            commands = ['ptzMoveUp'];
            break;
        case 'down':
            commands = ['ptzMoveDown'];
            break;
        case 'left':
            commands = ['ptzMoveLeft'];
            break;
        case 'right':
            commands = ['ptzMoveRight'];
            break;
        case 'stop':
            commands = ['ptzStopRun'];
            break;
        case 'up-and-stop':
            commands = ['ptzMoveUp', 'ptzStopRun'];
            break;
        case 'down-and-stop':
            commands = ['ptzMoveDown', 'ptzStopRun'];
            break;
        case 'left-and-stop':
            commands = ['ptzMoveLeft', 'ptzStopRun'];
            break;
        case 'right-and-stop':
            commands = ['ptzMoveRight', 'ptzStopRun'];
            break;
        case 'brightness':
            commands = ['setBrightness&brightness=' + value];
            break;
        case 'hue':
            commands = ['setHue&hue=' + value];
            break;
        case 'contrast':
            commands = ['setContrast&contrast=' + value];
            break;
        case 'saturation':
            commands = ['setSaturation&saturation=' + value];
            break;
        case 'sharpness':
            commands = ['setSharpness&sharpness=' + value];
            break;
        case 'flip':
            commands = ['flipVideo&isFlip=' + value];
            break;
        case 'type':
            // streamType 0: 720p 30fps 2M   (1280x720)
            // streamType 1: VGA  25fps 2M   (640x480)
            // streamType 2: VGA  15fps 1M   (640x480)
            // streamType 3: VGA  10fps 200K (640x480)
            commands = ['setMainVideoStreamType&streamType=' + value];
            break;
        case 'mode':
            // freq 0: 60Hz
            // freq 1: 60Hz
            commands = ['setPwrFreq&freq=' + value];
            break;
        case 'goto':
            commands = ['ptzGotoPresetPoint&name=' + value];
            break;
        case 'quality':
            // quality 0: low
            // quality 1: medium
            // quality 2: high
            commands = ['setSnapConfig&saveLocation=2&snapQuality=' + value];
            break;
        case 'detection':
            commands = ['setMotionDetectConfig&snapInterval=1&sensitivity=1&linkage=10&triggerInterval=0&schedule0=281474976710655&schedule1=281474976710655&schedule2=281474976710655&schedule3=281474976710655&schedule4=281474976710655&schedule5=281474976710655&schedule6=281474976710655&area0=0&area1=0&area2=0&area3=0&area4=0&area5=0&area6=0&area7=0&area8=0&area9=0&isEnable=' + value];
            break;
        case 'snapshots':
            commands = ['setScheduleSnapConfig&snapInterval=1&schedule0=281474976710655&schedule1=281474976710655&schedule2=281474976710655&schedule3=281474976710655&schedule4=281474976710655&schedule5=281474976710655&schedule6=281474976710655&isEnable=' + value];
            break;
    }

    var commandIndex = 0;
    var commandCount = commands.length;
    async.whilst(
        function() {
            return commandIndex < commandCount;
        },
        function(next) {
            var command = commands[commandIndex];

            var httpRequest = http.request({
                hostname: hostname,
                port: port,
                path: '/cgi-bin/CGIProxy.fcgi?usr=' + login + '&pwd=' + password + '&cmd=' + command,
                method: 'GET'
            }, function() {
                setTimeout(function() {
                    commandIndex++;
                    next();
                }, 3000);
            });
            httpRequest.end();
        },
        function() {
        }
    );

    response.statusCode = 200;
    response.body = 'OK';
};

/**
 * Get a configuration value (thunks)
 *
 * @param   {String}    name    The configuration name
 * @return  {String}            The configuration value
 */
proto.getConfiguration = function(name)
{
    var command;
    var propertyName;

    switch (name) {
        default:
            return function(done) {
                done(null, 'Unknown');
            };
        case 'detection':
            command = 'getMotionDetectConfig';
            propertyName = 'isEnable';
            break;
        case 'videoType':
            command = 'getMainVideoStreamType';
            propertyName = 'streamType';
            break;
        case 'snapshots':
            command = 'getScheduleSnapConfig';
            propertyName = 'isEnable';
            break;
    }

    return function(done) {
        var http = require('http');
        var services = solfege.kernel.Services;
        var application = services.get('application');
        var website = application.getBundle('website');
        var presets = website.configuration.presets;
        var hostname = website.configuration.hostname;
        var port = website.configuration.port;
        var login = website.configuration.login;
        var password = website.configuration.password;

        var httpRequest = http.request({
            hostname: hostname,
            port: port,
            path: '/cgi-bin/CGIProxy.fcgi?usr=' + login + '&pwd=' + password + '&cmd=' + command,
            method: 'GET'
        }, function(httpResponse) {
            httpResponse.on('data', function(chunk) {
                var xml2js = require('xml2js');
                var xml = chunk.toString();

                xml2js.parseString(xml, function(error, result) {
                    var cgiResult = result.CGI_Result;
                    var value = cgiResult[propertyName];

                    done(null, value.toString());
                });

            });
        });
        httpRequest.end();
    };
};



module.exports = Home;
