(function() {
  'use strict';
  angular.module('app')
    .controller('TypeController', TypeController);

  TypeController.$inject = ['TypeModel', 'Message', '$cordovaGeolocation', '$scope', 'gpsService'];

  function TypeController(TypeModel, Message, $cordovaGeolocation, $scope, gpsService) {

    var Type = this;
    Type.Model = TypeModel;
    $scope.$on('$ionicView.enter', function() {
      gpsService.checkGPS();
    });
    //====================================================
    //  IMPLEMENTATION
    //====================================================

  }
})();
