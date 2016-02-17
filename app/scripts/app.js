"use strict";
var app = angular.module('waterApp', ['ui.router', 'ngResource', 'firebase', 'chart.js'])
   .run(function($rootScope, $state, $firebaseAuth) {
      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
         var ref = new Firebase("https://water-ma.firebaseio.com/");
         var authObj = $firebaseAuth(ref);
         var authData = authObj.$getAuth()
         if (toState.authenticate && !authData) {
            $state.transitionTo("home");
            event.preventDefault();
         }
      });
   })
   .constant("fb", {
      url: "https://water-ma.firebaseio.com/"
   })
   .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('home', {
            url: '/',
            views: {
               'header': {
                  templateUrl: 'views/header.html'
               },
               'content': {
                  templateUrl: 'views/home.html',
                  controller: 'HomeController'
               }
            },
            authenticate: false
         })

         .state('login', {
            url: '/login',
            views: {
               'content': {
                  templateUrl: 'views/login.html',
                  controller: 'LoginController'
               }
            },
            authenticate: false
         })

         .state('dashboard', {
            url: '/dashboard',
            views: {
               'header': {
                  templateUrl: 'views/header.html'
               },
               'content': {
                  templateUrl: 'views/information.html',
                  controller: 'DashboardController'
               }
            },
            authenticate: true
         })

         .state('send', {
            url: '/send',
            views: {
               'header': {
                  templateUrl: 'views/header.html'
               },
               'content': {
                  templateUrl: 'views/send.html',
                  controller: 'SendController'
               }
            },
            authenticate: true
         });
         $urlRouterProvider.otherwise('/');
   })
;
