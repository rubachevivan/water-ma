"use strict";
var app = angular.module('waterApp', ['ui.router', 'ngResource', 'firebase', 'chart.js'])
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
            }
         })

         .state('post', {
            url: '/newspost/:id',
            views: {
               'content': {
                  templateUrl: 'views/post.html',
                  controller: 'PostController'
               }
            }
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
            }
         })

         .state('send', {
            url: '/send',
            views: {
               'header': {
                  templateUrl: 'views/header.html'
               },
               'content': {
                  templateUrl: 'views/send.html'
               }
            }
         });
         $urlRouterProvider.otherwise('/');
   })
;
