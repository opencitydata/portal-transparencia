var app = angular.module('ZaragozaOpenDataInterface', ['ngRoute','ngSanitize','truncate']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/', {templateUrl: '/assets/app/src/views/index.html', controller: 'MainCtrl'}).
    when('/sobre-el-autor', {templateUrl: '/assets/app/src/views/about.html', controller: 'MainCtrl'}).
    when('/referencias', {templateUrl: '/assets/app/src/views/references.html', controller: 'MainCtrl'}).
    when('/ayuda', {templateUrl: '/assets/app/src/views/help.html', controller: 'MainCtrl'}).
    when('/datos/:section/:resource', {templateUrl: '/assets/app/src/views/list.html', controller: 'DataCtrl'}).
    when('/datos/:section/:resource/:subresource', {templateUrl: '/assets/app/src/views/list.html', controller: 'DataCtrl'}).
    when('/dato/:section/:resource/:id', {templateUrl: '/assets/app/src/views/show.html', controller: 'DataCtrl'}).
    when('/dato/:section/:resource/:subresource/:id', {templateUrl: '/assets/app/src/views/show.html', controller: 'DataCtrl'}).
    otherwise({redirectTo: '/'});
}]);