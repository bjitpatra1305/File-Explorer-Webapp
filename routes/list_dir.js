var express = require('express');
var router = express.Router();
var fs = require('fs');

// can add more codes.
var codeMappings = {
    "EACCES": {
        code: "UNAUTHORISED",
        statusCode: 401,
        message: "Access Denied"
    },
    "ENOENT": {
        code: "BAD_REQUEST",
        statusCode: 400,
        message: "No such file or directory"
    }
};

var getFileStats = function (path, name, callback) {
    fs.stat(path + '/' + name, function (error, stats) {
        if (error) {
            return callback(error);
        }
        return callback(null, {
            name: name,
            size: stats.size,
            type : stats.isFile() ? "file" : "folder"
        });
    })
};

var listDir = function(path, callback) {
    fs.readdir(path, function (error, dirList) {
        if (error) {
            return callback(error);
        }

        var response = [];
        var count = dirList.length;

        for (var i = 0; i < dirList.length; i++) {
            getFileStats(path, dirList[i], function (error, fileDetails) {
                count--;
                if (error) {
                    return callback(error);
                }
                response.push(fileDetails);
                if (count == 0){
                    return callback(null, response);
                }
            });
        }
    });
};

router.get('/list_dir', function(req, res, next) {
    var path = req.query.path || '/';
    listDir(path, function (error, response) {
        if (error) {
            if (codeMappings[error.code]) {
                return res.status(codeMappings[error.code].statusCode).json({
                    code: codeMappings[error.code].code,
                    message: codeMappings[error.code].message
                });
            }
             return res.status(500).json({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong"
            });
        }

        return res.status(200).json(response);
    })
});

router.get('/get_file', function(req, res, next) {
    var filePath = req.query.path;
    res.sendFile(filePath);
});

module.exports = router;