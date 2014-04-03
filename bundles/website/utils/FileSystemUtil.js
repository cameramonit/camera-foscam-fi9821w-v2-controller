/**
 * Get the last file of a directory
 *
 * @param   {string}    directoryPath   The directory path
 * @return  {string}                    The file name
 */
module.exports.getLastFile = function(directoryPath) {
    var self = this;
    var fs = require('fs');
    var exec = require('child_process').exec;

    return function(done) {
        fs.realpath(directoryPath, function(error, resolvedPath) {
            var command = 'ls -t ' + resolvedPath + ' | head -n 2 | tail -1';
            exec(command, function(error, stdout, stderr) {
                var fileName = stdout.trim();
                done(error, fileName);
            });
        });
    };

};

