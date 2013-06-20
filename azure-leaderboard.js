/*
 *	Azure Mobile Services - Leaderboard npm
 */

// scripty & file manipulation & system
var scripty = require('azure-scripty');
var fs = require('fs');

exports.create = function(myMobileservice) {

	var myLeaderboard = "Leaderboard";
	var myResult = "Result";

	// error check: service exists
	scripty.invoke('mobile show '+myMobileservice, function(err, results) {
  		if (err) 
  			throw err;
	});

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


	// creating leaderboard and result tables - permission set to application as default
	cmds = [
	  {
	    command: 'mobile table create',
	    positional: [myMobileservice, myLeaderboard]
	  },
	  {
	    command: 'mobile table create',
	    positional: [myMobileservice, myResult]
	  },
	  {
	  	command: 'mobile script upload',
	  	positional: [myMobileservice, myInsertscript]
	  }
	]

	// error checks of scripty: existence of service and table names
	scripty.invoke(cmds, function(err, results) {
		if (err)
			throw err;
	});

}