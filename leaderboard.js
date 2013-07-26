/*
   Azure Mobile Services - Recipe - Leaderboard

    Copyright 2013 Mimi Xu

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

 */
// scripty & file manipulation & system
var scripty = require('azure-scripty');
var fs = require('fs');
var async = require('async');
var recipe = require('azuremobile-recipe');
var path = require('path');

// recipe
exports.use = function (myMobileservice) {

    // variable customizations
    var myLeaderboard = "Leaderboard";
    var myResult = "Result";
    var myNamespace = "";

    // file customizations
    var original = [];
    var replacement = [];

    async.series([
        function (callback) {
            console.log('Checking for table name conflicts...\n');

            // create leaderboard table
            recipe.createTable(myMobileservice, "Leaderboard", function (err, results) {
                if (err)
                    callback(err);
                myLeaderboard = results;
                callback(err, results);
            });
        },
        function (callback) {
            // create result table
            recipe.createTable(myMobileservice, "Result", function (err, results) {
                if (err)
                    callback(err);
                myResult = results;
                callback(err, results);
            });
        },
        function (callback) {
            // retreive result table action script
            console.log("Downloading & Uploading action scripts...")

            original = ['\\$', '\\%'];
            replacement = [myLeaderboard, myResult];

            recipe.downloadFile(['/table'], ['Result.insert.js', myResult + '.insert.js'], original, replacement,
                function (err) {
                    if (err)
                        callback(err);
                    callback(err, 'table action script downloaded');
                });
        },
        function (callback) {
            // upload result table action script
            var myInsertscript = 'table/' + myResult + '.insert.js';
            scripty.invoke('mobile script upload ' + myMobileservice + ' ' + myInsertscript, function (err, results) {
                if (err)
                    callback(err);
                else {
                    console.log("Action script '" + myInsertscript + "' successfully uploaded.\n");
                    callback(null, results);
                }
            });
        },
        function (callback) {
            // prompt for existing app namespace
            recipe.ask("Existing app namespace", recipe.REGEXP, function (name) {
                myNamespace = name;
                callback(null, name);
            });
        },
        function (callback) {
            original = ['\\$', '\\%', '\\#'];
            replacement = [myLeaderboard, myResult, myNamespace];

            // find all client files
            recipe.readPath(path.join(__dirname, './client_files'), function (err, results) {
                if (err)
                    throw err;
                files = results;
                callback(err, results);
            });
        },
        function (callback) {
            // download all client files and create directories
            async.forEachSeries(
                files,
                function (file, done) {
                    recipe.downloadFile([file.dir.replace(__dirname,'')], [file.file], original, replacement,
                        function (err) {
                            if (err)
                                callback(err);
                            done();
                        });
                },
                function (err) {
                    if (err)
                        callback(err);
                    callback(err, 'client file download');
                });
        },
        function () {
            process.exit(1);
        }
    ]);
}