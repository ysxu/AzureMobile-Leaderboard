/*
 *	Azure Mobile Services - Recipe - Leaderboard
 */

// scripty & file manipulation & system
var scripty = require('azure-scripty');
var fs = require('fs');
var async = require('async');

exports.use = function(){

	// default table names
	var myMobileservice = "";
	var myLeaderboard = "Leaderboard";
	var myResult = "Result";

	// async error checking, table creates, and script upload
	async.series([
		function(callback){
			ask("Mobile service name", /[a-z|A-Z]+/, function(name) {
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
			tableSetup(myMobileservice,"Leaderboard", function(err, results){
				if (err)
					throw err;
				myLeaderboard = results;
			    callback(err, results);
			});
	    },
	    function(callback){
	    	tableSetup(myMobileservice,"Result", function(err, results){
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
	    // copy client files into user local environment:s
	    function(callback){
	    	console.log("Downloading client files...");
	    	var folder = 'client_files/Entities';
	    	var file_name = 'Leaderboard.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Entities';
	    	var file_name = 'Result.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'AnswerModel.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'LeaderboardItemModel.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'LeaderboardModel.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'TriviaModel.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files/Model';
	    	var file_name = 'TriviaStepModel.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
	    		function(err){
	    			if (err)
	    				throw err;
	    			callback(err, 'client file download');
    		});
	    },
	    function(callback){
	    	var folder = 'client_files';
	    	var file_name = 'Leaderboard_functions.cs';
	    	file_download(folder, file_name, myLeaderboard, myResult, 
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

/***************************FUNCTIONS********************************/

// create tables and error check
function tableSetup(myMobileservice, tablename, callback){
	var usertablename = tablename;
	scripty.invoke('mobile table show '+myMobileservice+' '+tablename, function(err, results){
		if (results.columns!="" || results.scripts!=""){
			ask("Table '"+tablename+"' exists. Enter a new "+tablename+" name or enter 'conti' to continue with exisiting table", /[a-z|A-Z]+/, function(choice) {
				if (choice.toLowerCase()!='conti'){
					usertablename = choice;
					console.log("New "+tablename+" table '"+usertablename + "' is being created...");
					// create choice table
					scripty.invoke('mobile table create ' + myMobileservice + ' '+ usertablename, function(err, results) {
				  		if (err) 
				  			throw err;
				  		else{
				  			console.log("Table '"+usertablename+"' successfully created.\n");
				  			callback(err, usertablename);
				  		}
					});
				}
				else{
					console.log("Existing table '"+tablename+"' will be used for this module.\n");
					callback(err, usertablename);
				}

			});
		}
		else{
			console.log("New "+tablename+" table '"+usertablename + "' is being created...");
			// create leaderboard table
			scripty.invoke('mobile table create ' + myMobileservice + ' '+ usertablename, function(err, results) {
				if (err) 
				  	throw err;
				else{
					console.log("Table '"+usertablename+"' successfully created.\n");
					callback(err, usertablename);
				}
			});
		}
	});

}

// download files from module to user environment & customization
function file_download(folder, file_name, myLeaderboard, myResult, callback){
			// script location
			var script = __dirname + '/' + folder + '/' + file_name;

			// user location
			var curdir = process.cwd();
		  	var filedir = curdir + '/' + folder;
			var myScript = filedir + "/" + file_name;

			// create directory for file
			fs.exists(filedir, function (exists) {
			  if(!exists){
			  	fs.mkdir(filedir, function(err){
			  		if (err)
			  			throw err;
			  	});
			  }
			});

			// update scripts with customizable information
			// reference: http://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
			// read in module file
			fs.readFile(script, 'utf8', function (err,data) {
				//console.log(script);
		  		if (err) 
		  			throw err;

		  		// replace placeholders
		  		var result = data.replace(/\$/g, myLeaderboard).replace(/\%/g, myResult);

		  		// write to user environment
		  		fs.writeFile(myScript, result, 'utf8', function (err) {
		     		if (err) 
		     			throw err;
		     		console.log(folder + '/' + file_name + ' is downloaded.');
		     		callback(err);
		  		});
			});

}


// reference: http://st-on-it.blogspot.com/2011/05/how-to-read-user-input-with-nodejs.html
function ask(question, format, callback) {
	var stdin = process.stdin, stdout = process.stdout;
	 
	stdin.resume();
	stdout.write(question + ": ");
	 
	stdin.once('data', function(data) {
		data = data.toString().trim();
	 	//callback(data);
	 	
	    if (format.test(data)) {
	    	callback(data);
	   	} else {
	     	stdout.write("It should match: "+ format +"\n");
	     	ask(question, format, callback);
	   	}
	});
}