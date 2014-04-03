var solfege = require('solfegejs');

/**
 * The home controller
 */
var Home = solfege.util.Class.create(function()
{

}, 'website.controllers.Home');
var proto = Home.prototype;

/**
 * Main action
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.index = function*(request, response)
{
    response.statusCode = 200;
    yield response.render('index.swig');
};

/**
 * The snapshot controller
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 */
proto.control = function*(request, response)
{
    var services = solfege.kernel.Services;
    var application = services.get('application');
    var website = application.getBundle('website');
    var presets = website.configuration.presets;

    response.parameters.presets = presets;
    response.statusCode = 200;
    yield response.render('control.swig');
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
    var services = solfege.kernel.Services;
    var FileSystemUtil = require('../utils/FileSystemUtil');

    var directory = services.get('snapshotsPath');
    var lastFileName = yield FileSystemUtil.getLastFile(directory);
    var lastSnapshotPath = directory + '/' + lastFileName;

    response.statusCode = 200;
    response.body = fs.createReadStream(lastSnapshotPath);
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
                }, 1000);
            });
            httpRequest.end();
        },
        function() {
        }
    );

    response.statusCode = 200;
    response.body = 'OK';
};





module.exports = Home;
