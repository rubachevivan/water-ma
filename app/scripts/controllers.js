"use strict";
app.controller('DashboardController', ['$scope',
      function($scope) {
         $scope.chemlabels = ['pH', 'pH', 'pH', 'pH', 'pH', 'pH', 'pH'];
         $scope.chemseries = ['Series A', 'Series B'];
         $scope.colors = ['#00BCD4', '#303F9F'];
         $scope.chemdata = [
            [650, 590, 800, 810, 560, 550, 400],
            [280, 480, 400, 190, 860, 270, 900]
         ];


         $scope.epidlabels = ["Бактерии-2", "Бактерии-1"];
         $scope.epiddata = [300, 500];

      }
   ])
   .controller('HomeController', ['$scope', '$resource', 'newsFactory', function($scope, $resource, newsFactory) {
      //
      //
      //
      // Refering to weather API and loading basic weather widget with geolocation API
      //
      //
      //
      $scope.showWeather = false;
      $scope.message = "Загрузка...";
      var latitude = 0,
         longitude = 0;
      var url;

      function getCurrentWeather(position) {
         longitude = position.coords.longitude;
         latitude = position.coords.latitude;
         url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=44db6a862fba0b067b1930da0d769e98";
         console.log("current position is: " + latitude + " " + longitude);
         $resource(url)
            .get()
            .$promise.then(
               function(response) {
                  $scope.temperature = Math.round(response.main.temp - 273);
                  $scope.city = response.name;
                  $scope.showWeather = true;

                  var iconname = response.weather[0].icon;

                  if (iconname[iconname.length - 1] == "n") $scope.weathericon = "wi wi-owm-night-" + response.weather[0].id;
                  else $scope.weathericon = "wi-owm-day-" + response.weather[0].id;
                  //alert("changed lat " + latitude +  " or lng " + longitude);
               },
               function(response) {
                  $scope.message = "Error: " + response.status + " " + response.statusText;
               }
            );
      }

      function errorHandler(error) {
         alert("error " + error.code + " " + error.message);
      }

      var options = {
         enableHighAccuracy: true
      };

      if ("geolocation" in navigator)
         navigator.geolocation.getCurrentPosition(getCurrentWeather, errorHandler, options);
      else alert("Your browser doesnt support geolocation");

      setInterval(function() {
         if ("geolocation" in navigator)
            navigator.geolocation.getCurrentPosition(getCurrentWeather, errorHandler, options);
         else alert("Your browser doesnt support geolocation");
         $scope.$digest();
      }, 1800000);

      //
      //
      //
      // News Feed
      //
      //
      //
      $scope.posts = newsFactory.getAllPosts();
   }])
   //
   // controller that operates with new data from send view
   //
   .controller('SendController', ['$scope', 'fb',
      function($scope, fb) {

   }])
;
