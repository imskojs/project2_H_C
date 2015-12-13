(function() {
  'use strict';
  angular.module('app')
    .controller('ThemeController', ThemeController);

  ThemeController.$inject = ['ThemeModel', '$scope', 'Message', '$cordovaGeolocation', 'gpsService'];

  function ThemeController(ThemeModel, $scope, Message, $cordovaGeolocation, gpsService) {

    var Theme = this;
    Theme.Model = ThemeModel;

    $scope.$on('$ionicView.enter', function() {
      gpsService.checkGPS();
    });
  }
})();
