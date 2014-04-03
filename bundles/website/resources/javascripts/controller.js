$(document).ready(function()
{

    var updateScreen = function() {
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        var ratio = 1280/720;

        var screenWidth = viewportWidth;
        var screenHeight = screenWidth / ratio;
        if (screenHeight > viewportHeight) {
            screenHeight = viewportHeight;
            screenWidth = screenHeight * ratio;
        }
        $('#screen').width(screenWidth);
        $('#screen').height(screenHeight);


        var screenX = (viewportWidth - screenWidth) / 2;
        var screenY = (viewportHeight - screenHeight) / 2;
        $('#screen').offset({top: screenY, left: screenX});
    };

    var updateSnapshot = function() {
        $('#snapshot').attr('src', '/lastSnapshot.jpg/' + new Date().getTime());
    };

    $('#control-up').on('vmousedown', function(event) {
        $.get('/action/up', function() {
            updateSnapshot();
        });
    });

    $('#control-right').on('vmousedown', function(event) {
        $.get('/action/right', function() {
            updateSnapshot();
        });
    });

    $('#control-down').on('vmousedown', function(event) {
        $.get('/action/down', function() {
            updateSnapshot();
        });
    });

    $('#control-left').on('vmousedown', function(event) {
        $.get('/action/left', function() {
            updateSnapshot();
        });
    });

    $('#control-up, #control-right, #control-down, #control-left').on('vmouseup', function(event) {
        $.get('/action/stop', function() {
            updateSnapshot();
        });
    });

    $('#presets a').on('click', function(event) {
        var link = $(event.target);
        var preset = link.data('preset');

        $.get('/action/goto/' + preset, function() {
            updateSnapshot();
        });
    });

    $('#type a').on('click', function(event) {
        var link = $(event.target);
        var type = link.data('type');

        $.get('/action/type/' + type, function() {
            updateSnapshot();
        });

        if (type == '0') {
            $.get('/action/quality/2');
        } else {
            $.get('/action/quality/0');
        }
    });


    // Update the snapshot every 5 seconds
    setInterval(updateSnapshot, 5000);

    // Auto resize the screen
    updateScreen();
    $(window).resize(updateScreen);
});
