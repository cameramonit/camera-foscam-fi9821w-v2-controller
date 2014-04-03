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

    $('#control-up').on('click', function(event) {
        $.get('/action/up-and-stop', function() {
            updateSnapshot();
        });
    });

    $('#control-right').on('click', function(event) {
        $.get('/action/right-and-stop', function() {
            updateSnapshot();
        });
    });

    $('#control-down').on('click', function(event) {
        $.get('/action/down-and-stop', function() {
            updateSnapshot();
        });
    });

    $('#control-left').on('click', function(event) {
        $.get('/action/left-and-stop', function() {
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

    $('#type').change(function(event) {
        var input = $(event.target);
        var checked = input.is(':checked');

        $.get('/action/type/' + type, function() {
            updateSnapshot();
        });

        if (checked) {
            $.get('/action/quality/2');
        } else {
            $.get('/action/quality/0');
        }
    });

    $('#detection').change(function(event) {
        var input = $(event.target);
        var checked = input.is(':checked');

        if (checked) {
            $.get('/action/detection/1');
        } else {
            $.get('/action/detection/0');
        }
    });


    // Get configuration
    $.get('/config/detection', function(result) {
        if (result === '1') {
            $('#detection').attr('checked', true).checkboxradio('refresh');
        } else {
            $('#detection').attr('checked', false).checkboxradio('refresh');
        }
    });
    $.get('/config/videoType', function(result) {
        if (result === '0') {
            $('#type').attr('checked', true).checkboxradio('refresh');
        } else {
            $('#type').attr('checked', false).checkboxradio('refresh');
        }
    });


    // Update the snapshot every 5 seconds
    setInterval(updateSnapshot, 5000);

    // Auto resize the screen
    updateScreen();
    $(window).resize(updateScreen);
});
