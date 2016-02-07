"use strict";
var app = angular.module('waterApp', ['ui.router', 'water.controllers', 'water.services'])
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
