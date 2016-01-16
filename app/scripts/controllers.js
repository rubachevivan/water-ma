angular.module('waterApp')
   .controller('DashboardController', function($scope) {
      $scope.chemlabels = ['pH', 'pH', 'pH', 'pH', 'pH', 'pH', 'pH'];
      $scope.chemseries = ['Series A', 'Series B'];
      $scope.colors = ['#00BCD4', '#303F9F'];
      $scope.chemdata = [
         [650, 590, 800, 810, 560, 550, 400],
         [280, 480, 400, 190, 860, 270, 900]
      ];


      $scope.epidlabels = ["Бактерии-2", "Бактерии-1"];
      $scope.epiddata = [300, 500];
   });
