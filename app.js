'use strict';

require ('dotenv').config();

const fs = require('fs');  // access the file system.
const moment = require('moment'); // date / time tools.
const slack = require('./slack.js');  // import Slack notification functionality.
const source = process.env.envAA; // environment variable defining the source directory.
const destination = process.env.envBB; // environment variable defining the destination directory.
const searchParameter1 = process.env.env11; // environment variable defining a file search parameter.
//const searchParameter2 = process.env.env2; // environment variable defining a file search parameter.

var date = moment().format('YYYYMMDD'), // create a date object for file date comparison and the archive file name.
    fileList = [];  // create an empty array to hold relevant file names.

// Change working directory the process is running in.   
process.chdir(source);
console.log(process.cwd());

// Read the files within that directory.
fs.readdir(source, function (err, files) {
    // If there is an error display that error.
    if (err) console.log('>>> File System Error: ' + err);
    
    // Loop through each file that is found...
    checkFilesPromise(files, searchParameter1).then(function (response) {
        console.log('>>> File(s) detected. Starting copy process.');
        
        // Copy files...
        fileList.forEach(function (item) {
            fs.createReadStream(item).pipe(fs.createWriteStream(destination + item));
        });
        slack('Files copied successfully!', 'good', 'File(s) copied.');
    }, function (error) {
        console.log('>>> CheckFilesPromise error ' + error);
        slack('Check Files Promise', 'warning', error.toString());
    });
});

var checkFilesPromise = function (files, search) {
    return new Promise(function (resolve, reject) {
        
        files.forEach(function (item) {
            console.log(item);
            // ...check it matches the search parameter...
            if (item.match(search)) {
                var stats = fs.statSync(item);
                var fileDate = moment(stats.mtime).format('YYYYMMDD');
        
                // ...and current date e.g. today's date.
                if (fileDate === date) {
                    // Add file to an array of file names.
                    console.log('>>> Date match successful, pushing: ' + item);
                    fileList.push(item);
                    //resolve('Success');
                } else {
                    //reject('No files today.');
                }
            }
        });
        if (fileList.length >= 1) {
            resolve('Success');
        } else {
            reject('No files today.');
        }
    });
};