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
exports.use = function (myMobileservice, recipe, callback) {

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
            recipe.log.info('Checking for table name conflicts...\n');

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
            recipe.log.info("Copying & Uploading action scripts...")

            original = ['\\$', '\\%'];
            replacement = [myLeaderboard, myResult];
            var action_file = [{
                dir: 'table',
                file: 'Result.insert.js',
                new_file: myResult + '.insert.js',
                original: original,
                replacement: replacement
            }];

            recipe.copyFiles(recipename, action_file, function (err) {
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
                    recipe.log.info("Action script '" + myInsertscript + "' successfully uploaded.\n");
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
            // find all client files
            recipe.readPath(recipe.path.join(__dirname, './client_files'), __dirname, function (err, results) {
                if (err) return callback(err);
                files = results;
                callback();
            });
        },
        function (callback) {
            original = ['\\$', '\\%', '\\#'];
            replacement = [myLeaderboard, myResult, myNamespace];

            // format client files
            recipe.async.forEachSeries(
                files,
                function (file, done) {
                    file.original = original;
                    file.replacement = replacement;
                    done();
                },
                function (err) {
                    if (err) return callback(err);
                    callback();
                });
        },
        function (callback) {
            // copy client files to user environment
            recipe.copyFiles(recipename, files, function (err) {
                if (err) return callback(err);
                callback();
            });
        },
        function () {
            callback();
        }
    ]);
}