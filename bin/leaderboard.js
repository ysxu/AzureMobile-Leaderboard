#!/usr/bin/env node

var leaderboard = require('../azure-leaderboard.js');

if(process.argv.length!=3){
	throw new Error("Use 'leaderboard service-name' format for this module. The command requires one parameter.");
}
else{
	if (process.argv[2]=="help" || process.argv[2]=="-h"){
			console.log("\n-azure recipe: leaderboard\nCreate leaderboard with 'azure-recipe-leaderboard service-name'\n");
	}
	else{
		// calls leaderboard module with service
		leaderboard.create(process.argv[2]);
	}
}

/*
if (process.argv.length==3 && process.argv[2]=="help"){
	console.log("\n-azure recipe: leaderboard\nCreate leaderboard with 'azure-recipe-leaderboard service-name leaderboard-name result-table-name'\n");
}
else if (process.argv.length!=5){
	throw new Error("Use 'azure-recipe-leaderboard service-name leaderboard-name result-table-name' format for this module. The command requires three parameters.");
}
else{
	// get user input
	var args = process.argv.slice(2);
	// calls leaderboard module with service, leaderboard, and result table
	leaderboard.create(args[0], args[1], args[2]);
}
*/