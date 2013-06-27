using System;

/*
 * add the following snippet to set up:
 * using leaderboard;
 * azure_leaderboard.functions leaderboard = new azure_leaderboard.functions();
 * call functions:
 * leaderboard.SendResults(int hits, int misses);
 * leaderboard.RefreshLeaderboard(int resultsId);
 * leaderboard.RefreshLeaderboard(int resultsId);
 *
 */
 
namespace azure_leaderboard {
    public class functions{
        public async void SendResults(int hits, int misses) 
        { 
            var resultsEntity = new % { PlayerName = App.Data.PlayerName, Hits = hits, Misses = misses }; 
            await App.MobileService.GetTable<%>().InsertAsync(resultsEntity); 
         
            this.RefreshLeaderboard(resultsEntity.Id); 
        }

        public async void RefreshLeaderboard(int resultsId) 
        { 
            var sw = new Stopwatch(); 
            sw.Start(); 
         
            var leaderboardUpdated = false; 
            while (!leaderboardUpdated && sw.ElapsedMilliseconds < 5000)  
            { 
                 var aux = await App.MobileService.GetTable<%>().Where(r => r.Id == resultsId).ToEnumerableAsync(); 
         
                 var resultsItem = aux.Single(); 
                 leaderboardUpdated = resultsItem.LeaderboardUpdated; 
            } 
         
            sw.Stop(); 
         
            if (leaderboardUpdated) 
            { 
                 var leaderboardItems = await App.MobileService.GetTable<$>().ToEnumerableAsync(); 
                 leaderboardItems = leaderboardItems.OrderBy(item => item.Position).Take(5); 
         
                 var model = new LeaderboardModel(); 
                 foreach (var item in leaderboardItems) 
                 { 
                      model.Items.Add(new LeaderboardItemModel 
                      { 
                            Player = item.PlayerName, 
                            Position = item.Position, 
                            Score = item.Score 
                      }); 
                 } 
         
                 this.DataContext = model; 
         
                 this.LoadingLeaderboardLegend.Visibility = Windows.UI.Xaml.Visibility.Collapsed; 
                 this.LoadingLeaderboardProgressRing.Visibility = Windows.UI.Xaml.Visibility.Collapsed; 
                 this.LeaderboardGridView.Visibility = Windows.UI.Xaml.Visibility.Visible; 
            } 
            else 
            { 
                 this.LoadingLeaderboardLegend.Visibility = Windows.UI.Xaml.Visibility.Collapsed; 
                 this.LoadingLeaderboardProgressRing.Visibility = Windows.UI.Xaml.Visibility.Collapsed; 
         
                 var msg = new MessageDialog("The leaderboard could not be retrieved, please check if the server-side script is properly configured on the mobile service."); 
                 await msg.ShowAsync(); 
            } 
        }

        public async void RefreshLeaderboard(int resultsId)  
        {  
            var sw = new Stopwatch();  
            sw.Start();  
          
            var leaderboardUpdated = false;  
            while (!leaderboardUpdated && sw.ElapsedMilliseconds < 5000)   
            {  
                 var aux = await App.MobileService.GetTable<%>().Where(r => r.Id == resultsId).ToEnumerableAsync();  
          
                 var resultsItem = aux.Single();  
                 leaderboardUpdated = resultsItem.LeaderboardUpdated;  
            }  
          
            sw.Stop();  
          
            if (leaderboardUpdated)  
            {  
                 var leaderboardItems = await App.MobileService.GetTable<$>().ToEnumerableAsync();  
                 leaderboardItems = leaderboardItems.OrderBy(item => item.Position).Take(5);  
          
                 var model = new LeaderboardModel();  
                 foreach (var item in leaderboardItems)  
                 {  
                      model.Items.Add(new LeaderboardItemModel  
                      {  
                            Player = item.PlayerName,  
                            Position = item.Position,  
                            Score = item.Score  
                      });  
                 }  
          
                 this.DataContext = model;  
          
                 this.LoadingLeaderboardLegend.Visibility = Windows.UI.Xaml.Visibility.Collapsed;  
                 this.LoadingLeaderboardProgressRing.Visibility = Windows.UI.Xaml.Visibility.Collapsed;  
                 this.LeaderboardGridView.Visibility = Windows.UI.Xaml.Visibility.Visible;  
            }  
            else  
            {  
                 this.LoadingLeaderboardLegend.Visibility = Windows.UI.Xaml.Visibility.Collapsed;  
                 this.LoadingLeaderboardProgressRing.Visibility = Windows.UI.Xaml.Visibility.Collapsed;  
          
                 var msg = new MessageDialog("The leaderboard could not be retrieved, please check if the server-side script is properly configured on the mobile service.");  
                 await msg.ShowAsync();  
            }  
        }
    }
}