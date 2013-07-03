#!/usr/bin/env node
var leaderboard = require('../leaderboard.js');

if(process.argv.length!=2){
	throw new Error("Use this module by calling 'leaderboard' in command line.");
}
else{
	// calls leaderboard module with service
	leaderboard.use();
}