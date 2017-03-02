app.controller('MainCtrl', function ($scope, data) {
  
   $scope.menu = data.generateMenu();

});