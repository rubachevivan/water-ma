"use stritct";

app.factory('newsFactory', ['$firebaseArray', 'fb',
      function($firebaseArray, fb) {
         var news = {};

         news.getPosts = function() {
            var ref = new Firebase(fb.url + "news");
            return $firebaseArray(ref);
         };

         return news;
      }
])
.factory('dashboardFactory', ['$firebaseArray', '$firebaseObject', 'fb',
   function($firebaseArray, $firebaseObject, fb) {
      var metrics = {};
      metrics.getMetrics = function(param) {
         var ref = new Firebase(fb.url + "metrics/" + param);
         return $firebaseArray(ref);
      };
      metrics.getMetricsByWeek = function(param) {
         var ref = new Firebase(fb.url + "metrics/" + param);
         var query = ref.limitToLast(7);
         return $firebaseArray(query);
      };
      metrics.getQuality = function(param) {
         var ref = new Firebase(fb.url + "metrics/quality/" + param + "Quality");
         return $firebaseObject(ref);
      };
      metrics.getAllQuality = function() {
         var ref = new Firebase(fb.url + "metrics/quality");
         return $firebaseObject(ref);
      };
      metrics.getOrgan = function() {
         var ref = new Firebase(fb.url + "metrics/organ");
         var query = ref.limitToLast(1);
         return $firebaseArray(query);
      }
      return metrics;
   }
])
.factory("loginFactory", ['$firebaseAuth', 'fb', function($firebaseAuth, fb) {
   var ref = new Firebase(fb.url)
   return $firebaseAuth(ref);
}])
;
