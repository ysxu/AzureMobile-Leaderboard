/*
 *	Azure Mobile Services - Recipe - Leaderboard
 */

// scripty & file manipulation & system
var scripty = require('azure-scripty');
var fs = require('fs');
var async = require('async');
var recipe = require('azuremobile-recipe');

exports.use = function(){

	// default table names
	var myMobileservice = "";
	var myLeaderboard = "Leaderboard";
	var myResult = "Result";
	var myNamespace = "";

	// async error checking, table creates, and script upload
	async.series([
		function(callback){
			recipe.ask("Mobile service name", /[a-z|A-Z]+/, function(name) {
				myMobileservice = name;
				callback(null, name);
			});
		},
	    function(callback){
	        // error check: service exists
	        console.log('Validating mobile service '+ myMobileservice+'...');
			scripty.invoke('mobile show '+ myMobileservice, function(err, results) {
	    		if (err)
	    			throw err;
	    		console.log('Validated.\n');
	        	callback(err, results);
			});
	    },
	    function(callback){
			recipe.table_create(myMobileservice,"Leaderboard", function(err, results){
				if (err)
					throw err;
				myLeaderboard = results;
			    callback(err, results);
			});
	    },
	    function(callback){
	    	recipe.table_create(myMobileservice,"Result", function(err, results){
	    		if (err)
	    			throw err;
				myResult = results;
	    		callback(err, results);
			});
	    },
	    function(callback){
	    	console.log("Uploading action scripts...")
			// insertion scripts
			var curdir = process.cwd();
			var insertscript = __dirname + '/table/Result.insert.js';
			
		  	var tabledir = curdir + '/table';
			var myInsertscript = tabledir+ "/" + myResult + '.insert.js';

			// create table directory
			fs.exists(tabledir, function (exists) {
			  if(!exists){
			  	fs.mkdir(tabledir, function(err){
			  		if (err)
			  			throw err;
			  	});
			  }
			});

			// update scripts with myLeaderboard and myResult
			// reference: http://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
			fs.readFile(insertscript, 'utf8', function (err,data) {
		  		if (err) 
		  			throw err;

		  		// replace placeholders
		  		var result = data.replace(/\$/g, myLeaderboard).replace(/\%/g, myResult);

		  		fs.writeFile(myInsertscript, result, 'utf8', function (err) {
		     		if (err) 
		     			throw err;
		  		});
			});

			// modify uploading script
			var cut = myInsertscript.indexOf(curdir);
			myInsertscript = myInsertscript.slice(0, cut) + myInsertscript.slice(cut+curdir.length+1, myInsertscript.length);
							
			// upload script
			scripty.invoke('mobile script upload ' + myMobileservice + ' '+ myInsertscript, function(err, results) {
		  		if (err) 
		  			throw err;
		  		else{
		  			console.log("Action script '"+myInsertscript+"' successfully uploaded.\n");
					callback(null, results);
		  		}
			});
	    },
	    function(callback){
			var curdir = process.cwd();
	    	var clientdir = curdir + '/client_files';
	    	// create client_files directory
			fs.exists(clientdir, function (exists) {
			  if(!exists){
			  	fs.mkdir(clientdir, function(err){
			  		if (err)
			  			throw err;
			  		callback(null, 'client dir');
			  	});
			  }
			  else
			  	callback(null, 'client dir');
			});
	    },
	    function(callback){
			recipe.ask("Existing app namespace", /[a-z|A-Z]+/, function(name) {
				myNamespace = name;
				callback(null, name);
			});
		},
	    // copy client files into user local environment:s
	    function(callback){
	    	console.log("Downloading client files...");
	    	var folder = 'client_files/Entities';
	    	var file_name = 'Leaderboard.cs';
	    	recipe.file_download(folder, file_name,['\\$','\\%', '\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Entities';
	    	var file_name = 'Result.cs';
	    	recipe.file_download(folder, file_name, ['\\$','\\%', '\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'LeaderboardItemModel.cs';
	    	recipe.file_download(folder, file_name, ['\\$','\\%', '\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'LeaderboardModel.cs';
	    	recipe.file_download(folder, file_name, ['\\$','\\%', '\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Functions';
	    	var file_name = 'LeaderboardFunctions.cs';
	    	recipe.file_download(folder, file_name, ['\\$','\\%','\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files';
	    	var file_name = 'LeaderboardPage.xaml';
	    	recipe.file_download(folder, file_name, ['\\$','\\%','\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files';
	    	var file_name = 'LeaderboardPage.xaml.cs';
	    	recipe.file_download(folder, file_name, ['\\$','\\%','\\#'], [myLeaderboard, myResult, myNamespace], 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(){
	    	process.exit(1);
	    }
	]);
}