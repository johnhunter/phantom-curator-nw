/* jshint node:true */

var util    = require('util');
var fs      = require('fs');
var path    = require('path');


var visdiffer = module.exports = {};
var docroot = './';


visdiffer.setRoot = function(path){
    docroot = path;
    return this;
};


// TODO: promises would be good - need to figure out how to npm in dependencies
visdiffer.getlist = function(callback){
    readDir(docroot, function(err, found){
        if (err) {
            throw err;
        }
        var list = filterFiles(found.files);
        callback(list);
    });
};

visdiffer.rebase = function(rebaseList, done, fail){
    rebaseList = util.isArray(rebaseList) ? rebaseList : [rebaseList];
    rebaseFiles(rebaseList);

    done(rebaseList);
    // FIXME: we're not really checking the file is deleted
    // TODO: handle fails - also use promises?
};



function rebaseFiles (files) {
    files.forEach(function(item){
        var filepath = path.join(docroot, item);

        var refFile = filepath + '.png';
        var diffFile = filepath + '.diff.png';
        var failFile = filepath + '.fail.png';

        // sync code here
        try {
            fs.unlinkSync(refFile);
            fs.renameSync(diffFile, refFile);
            fs.unlinkSync(failFile);
        }
        catch (e) {
            fileError(e.message);
        }
    });
}

function fileError (err) {
    // TODO: how to report this to the user?
    throw err;
}

function filterFiles (files) {
    var failedTests = [];
    files.forEach(function(item){
        var tokens = item.match(/(.*)(\.fail\.png)$/);
        if (tokens && tokens.length === 3) {
            failedTests.push(normalisePath(path.relative(docroot, tokens[1])));
        }
    });
    return failedTests;
}

// recursively list files in dir
function readDir(start, callback) {
    // Use lstat to resolve symlink if we are passed a symlink
    fs.lstat(start, function(err, stat) {
        if(err) {
            return callback(err);
        }
        var found = {dirs: [], files: []},
            total = 0,
            processed = 0;
        function isDir(abspath) {
            fs.stat(abspath, function(err, stat) {
                if(stat.isDirectory()) {
                    found.dirs.push(abspath);
                    // If we found a directory, recurse!
                    readDir(abspath, function(err, data) {
                        found.dirs = found.dirs.concat(data.dirs);
                        processFiles(data.files);
                    });
                } else {
                    processFiles([abspath]);
                }
            });
        }
        function processFiles (files) {
            found.files = found.files.concat(files);
            if(++processed == total) {
                callback(null, found);
            }
        }
        // Read through all the files in this directory
        if(stat.isDirectory()) {
            fs.readdir(start, function (err, files) {
                total = files.length;
                for(var x=0, l=files.length; x<l; x++) {
                    isDir(path.join(start, files[x]));
                }
                if (total === 0) {
                    callback(null, found);
                }
            });
        } else {
            return callback(new Error("path: " + start + " is not a directory"));
        }
    });
}

function normalisePath(path){
    return String(path).replace(/\\/g, '/');
}


