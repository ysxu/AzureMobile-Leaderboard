AzureMobile-Leaderboard
=======================

Automated backend set up for azure mobile leaderboard using azure-scripty. 
The general code flow and Result table action script follow the instructions at http://code.msdn.microsoft.com/windowsapps/Adding-a-Leaderboard-to-1f9d216d.


# Getting started
## Before Installation
Make sure node.js is installed as well as npm modules azure-cli and azuremobile-recipe
```bash
npm install -g azure-cli
npm install -g azuremobile-recipe
```

## Install it
```bash
npm install -g azuremobile-leaderboard
```

To set up leaderboard with azure-cli installed and user account downloaded and imported:
```bash
azure mobile recipe use leaderboard
```

The module will create a Leaderboard table and a Result table, configure their action scripts, and download neccessary client-side files in the same directory as where the module is called.


## Use it
To update tables, make sure the method is 'async' and add the below snippets into project:
```bash
projectnamespace.Functions.functions leaderboard = new projectnamespace.Functions.functions();
Globals.ResultId = await leaderboard.SendResults(App.Data.PlayerName, hits, misses);
```

To display leaderboard, navigate to LeaderboardPage page from an existing page:
```bash
this.rootPage.GetFrameContent().Navigate(typeof(LeaderboardPage), this.rootPage);
```


Complete testing scripts coming soon.