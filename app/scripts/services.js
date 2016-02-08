"use stritct";

app.factory('newsFactory', ['$firebaseArray', 'fb',
      function($firebaseArray, fb) {
         var news = {};

         news.getPosts = function() {
            var ref = new Firebase(fb.url + "news");
            return $firebaseArray(ref);
         }

         return news;
      }
   ])
