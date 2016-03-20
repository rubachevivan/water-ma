"use strict";
app.controller('DashboardController', ['$rootScope', '$scope', 'dashboardFactory', 'newsFactory',
         function($rootScope, $scope, dashboardFactory, newsFactory) {
            /*
             Adding new values
            */

            $scope.biolMetrics = dashboardFactory.getMetrics("biol");
            $scope.radMetrics = dashboardFactory.getMetrics("rad");
            $scope.oilMetrics = dashboardFactory.getMetrics("oil");

            /*
               functions to emulate sensoric network work,
               and add fake info. First is to add normal data,
               second is to emulate danger situation
            */

            $scope.addGood = function(param) {
               $scope[param + "Metrics"].$add({
                  contents: 0,
                  timestamp: Firebase.ServerValue.TIMESTAMP
               });
            };

            $scope.addBad = function(param) {
               var rnd = Math.floor(Math.random() * 10);
               $scope[param + "Metrics"].$add({
                  contents: rnd,
                  timestamp: Firebase.ServerValue.TIMESTAMP
               });
            };


            /*
               reading last 7 values to display them at the graph
               for this in services.js/dashboardFactory using special query
            */

            /*
               to controll if one of the parameters is not good i use rootScope
               if waterState is equal to 0 it means everything is ok when it is
               equal to 1 - it means water quality is poor
            */
            $rootScope.waterState = {};
            function getChart(param, maximum) {
               $scope[param + "Data"] = dashboardFactory.getMetricsByWeek(param);
               $scope[param + "Data"].$loaded()
                  .then(function() {
                        $scope.$watchCollection(param + "Data", function(newValues, oldValues) {
                           $scope[param + "Labels"] = [];
                           $scope[param + "Series"] = [param];
                           $scope[param + "CurrentMetrics"] = [
                              []
                           ];
                           $scope[param + "Message"] = "Показатели в норме.";
                           newValues.forEach(function(item, index, arr) {
                              var date = new Date(item.timestamp),
                                 day;
                              switch (date.getDay()) {
                                 case 0: day = "Вс";
                                 break;
                                 case 1: day = "Пн";
                                 break;
                                 case 2: day = "Вт";
                                 break;
                                 case 3: day = "Ср";
                                 break;
                                 case 4: day = "Чт";
                                 break;
                                 case 5: day = "Пт";
                                 break;
                                 case 6: day = "Сб";
                                 break;
                              }
                              $scope[param + "Labels"][index] = day + ", " + date.getDate();
                              $scope[param + "CurrentMetrics"][0][index] = item.contents;
                           });
                           if($scope[param + "CurrentMetrics"][0][6] > maximum) {
                                 var obj = dashboardFactory.getQuality(param);
                                 obj.$value = 0;
                                 obj.$save();
                                 $scope[param + "Message"] = "Внимание! Концентрация превышена.";
                           } else {
                                 var obj = dashboardFactory.getQuality(param);
                                 obj.$value = 1;
                                 obj.$save();
                                 $scope[param + "Message"] = "Концентрация в норме.";
                           }
                        });
                     });
            }

            getChart("biol", 0);
            getChart("rad", 0.1);
            //console.log($scope.radSeries);
            $scope.oilData = dashboardFactory.getMetricsByWeek("oil");
            $scope.oilData.$loaded()
               .then(function(){
                  $scope.$watchCollection("oilData", function(newValues, oldValues) {
                     $scope.oilCurrentMetrics = [];
                     $scope.oilLabels = ["Нефть", "Вода"];
                     $scope.oilCurrentMetrics.push(+newValues[newValues.length - 1].contents);
                     $scope.oilCurrentMetrics.push(100 - newValues[newValues.length - 1].contents);
                     console.log($scope.oilCurrentMetrics[0]);
                     if($scope.oilCurrentMetrics[0] > 20) {
                        $scope.oilMessage = "Внимание! Концентрация превышена.";
                     }
                     else {
                        $scope.oilMessage = "Концентрация в норме.";
                     }
                  });
               });
         /*
            organolept parameters query and bla bla
         */
            $scope.organData = dashboardFactory.getOrgan();
            $scope.organData.$loaded()
               .then(function() {
                  console.log($scope.organData);
                  $scope.$watchCollection("organData", function(newValues, oldValues) {
                     $scope.colorStyle = "organGood";
                     $scope.opacityStyle = "organGood";
                     $scope.smellStyle = "organGood";
                     $scope.tasteStyle = "organGood";

                     $scope.colour = "Цветность воды в норме";
                     $scope.opacity = "Вода прозрачная";
                     $scope.smell = "Запах в порядке";
                     $scope.taste = "Привкус в порядке";

                     if(newValues[0].color >= 2) {
                        $scope.colour = "Цветность воды не в порядке";
                        $scope.colorStyle = "organBad";
                     }
                     if(newValues[0].opacity >= 2) {
                        $scope.opacity = "Мутность высока";
                        $scope.opacityStyle = "organBad";
                     }
                     if(newValues[0].smell >= 2) {
                        $scope.smell = "Вода имеет неприятный запах";
                        $scope.smellStyle = "organBad";
                     }
                     if(newValues[0].taste >= 2) {
                        $scope.taste = "Вода имеет неприятный привкус";
                        $scope.tasteStyle = "organBad";
                     }
                  });
               });

         /*
            adding new news posts to firebase and clearing input fields
         */
            $scope.posts = newsFactory.getPosts();

            $scope.addPost = function() {
               $scope.posts.$add({
                  name: $scope.name,
                  description: $scope.description,
                  content: $scope.content,
                  timestamp: Firebase.ServerValue.TIMESTAMP
               });

               $scope.name = "";
               $scope.description = "";
               $scope.content = "";
            };
         }])
      .controller('HomeController', ['$scope', '$resource', 'newsFactory', 'dashboardFactory', function($scope, $resource, newsFactory, dashboardFactory) {
         /*
            Refering to weather API and loading basic weather widget with geolocation API
            This code is not in the services.js because of asynchronous loading it is not
            showing weather if it loads it in services.js
         */
         $scope.quality = dashboardFactory.getAllQuality();
         $scope.quality.$loaded()
            .then(function() {
               $scope.$watch('quality', function(newVal, oldVal, scope) {
                  $scope.waterState = newVal;
               });
            });
         $scope.showWeather = false;
         $scope.message = "Загрузка...";
         var latitude = 0,
            longitude = 0;
         var url;

         function getCurrentWeather(position) {
            longitude = position.coords.longitude;
            latitude = position.coords.latitude;
            url = "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=e533bf08b8165b80eb6f417c66f0ab0b";
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

         /*
            Displaing news at the home page. News post are added via the dashboard.
         */
         $scope.posts = newsFactory.getPosts();

      }])
      /*
         controller that operates with new data from send view
         and set forms clean
      */

      .controller('SendController', ['$scope', 'dashboardFactory',
         function($scope, dashboardFactory) {
            $scope.oilData = dashboardFactory.getMetrics("oil");
            $scope.addOilData = function() {
               if(+$scope.oilContents > 20) {
                  var obj = dashboardFactory.getQuality("oil");
                  obj.$value = 0;
                  obj.$save();
               } else {
                  var obj = dashboardFactory.getQuality("oil");
                  obj.$value = 1;
                  obj.$save();
               }
               $scope.oilData.$add({
                  contents: $scope.oilContents,
                  comments: $scope.oilComment,
                  timestamp: Firebase.ServerValue.TIMESTAMP
               });
               $scope.oilContents = "";
               $scope.oilComment = "";
            };
            $scope.smell;
            $scope.taste;
            $scope.colour;
            $scope.opacity;

            $scope.organData = dashboardFactory.getMetrics("organ");
            $scope.addOrganData = function() {
               if($scope.smell > 2 || $scope.taste > 2 || $scope.colour > 2 || $scope.opacity > 2) {
                  var obj = dashboardFactory.getQuality("organ");
                  obj.$value = 0;
                  obj.$save();
               } else {
                  var obj = dashboardFactory.getQuality("organ");
                  obj.$value = 1;
                  obj.$save();
               }
               $scope.organData.$add({
                   smell: +$scope.smell,
                   taste: +$scope.taste,
                   color: +$scope.colour,
                   opacity: +$scope.opacity
               });
               $scope.smell = "";
               $scope.taste = "";
               $scope.colour = "";
               $scope.opacity = "";
            }
         }])
      .controller("LoginController", ['$scope', 'loginFactory', function($scope, loginFactory) {
         $scope.email;
         $scope.password;
         $scope.login = function() {
            loginFactory.$authWithPassword({
               email: $scope.email,
               password: $scope.password
            }).then(function() {
               console.log('YEEEY!');
            }).catch(function(error){
               console.error("Authentication failed " + error);
            })
         }
      }])
;
