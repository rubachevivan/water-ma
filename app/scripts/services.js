"use stritct";

app.factory('newsFactory', ['$resource',
      function($resource) {
         var news = {};
         var data = {
            posts: [{
               id: 0,
               name: "New Blog Post",
               content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            }, {
               id: 1,
               name: "Second Post",
               content: "some strange text"
            }, {
               id: 2,
               name: "Hello World",
               content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            }, {
               id: 3,
               name: "hello new world",
               content: "my name is Ivan Rubachev"
            }]
         };
         news.getAllPosts = function() {
            return data.posts;
         };
         news.getPost = function(id) {
            return data.posts[id];
         };
         return news;
      }
   ])
   .factory('dashboardFactory',
      function() {
         var metrics = {};
   });
