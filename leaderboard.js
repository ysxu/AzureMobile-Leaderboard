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

exports.use = function (myMobileservice, log, recipe, callback) {

    // variable customizations
    var recipename = 'leaderboard';
    
    var myLeaderboard = "Leaderboard";
    var myResult = "Result";
    var myNamespace = "";

    // file customizations
    var original = [];
    var replacement = [];

    recipe.async.series([
        function (callback) {
            log.info('Checking for table name conflicts...\n');

            // create leaderboard table
            recipe.createTable(myMobileservice, "Leaderboard", function (err, results) {
                if (err) return callback(err);
                myLeaderboard = results;
                callback();
            });
        },
        function (callback) {
            // create result table
            recipe.createTable(myMobileservice, "Result", function (err, results) {
                if (err) return callback(err);
                myResult = results;
                callback();
            });
        },
        function (callback) {
            // retreive result table action script
            log.info("Copying & Uploading action scripts...")

            original = ['\\$', '\\%'];
            replacement = [myLeaderboard, myResult];

            recipe.copyFile('azuremobile-'+recipename, ['/table'], ['Result.insert.js', myResult + '.insert.js'], original, replacement,
                function (err) {
                    if (err) return callback(err);
                    callback();
                });
        },
        function (callback) {
            // upload result table action script
            var myInsertscript = 'table/' + myResult + '.insert.js';
            recipe.scripty.invoke('mobile script upload ' + myMobileservice + ' ' + myInsertscript, function (err, results) {
                if (err) return callback(err);
                else {
                    log.info("Action script '" + myInsertscript + "' successfully uploaded.\n");
                    callback();
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
            recipe.readPath(recipe.path.join(__dirname, './client_files'), function (err, results) {
                if (err) return callback(err);
                files = results;
                callback();
            });
        },
        function (callback) {
            // copy all client files and create directories
            recipe.async.forEachSeries(
                files,
                function (file, done) {
                    recipe.copyFile('azuremobile-'+recipename,[file.dir.replace(__dirname,'')], [file.file], original, replacement,
                        function (err) {
                            if (err) return callback(err);
                            done();
                        });
                },
                function (err) {
                    if (err) return callback(err);
                    callback();
                });
        },
        function () {
            callback();
        }
    ]);
}