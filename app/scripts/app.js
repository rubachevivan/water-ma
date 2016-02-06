"use strict";
var app = angular.module('waterApp', ['ui.router', 'water.controllers', 'water.services'])
   .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('app', {
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

         .state('app.info', {
            url: 'information',
            views: {
               'content@': {
                  templateUrl: 'views/information.html',
                  controller: 'DashboardController'
               }
            }
         })

         .state('app.send', {
            url: 'send',
            views: {
               'content@': {
                  templateUrl: 'views/send.html'
               }
            }
         });
         $urlRouterProvider.otherwise('/');
   })
;
