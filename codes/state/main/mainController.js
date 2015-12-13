(function() {
  'use strict';
  angular.module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['MainModel', '$ionicSideMenuDelegate', 'appStorage', 'Message', '$ionicViewSwitcher', '$state', '$timeout'];

  function MainController(MainModel, $ionicSideMenuDelegate, appStorage, Message, $ionicViewSwitcher, $state, $timeout) {

    var Main = this;
    Main.Model = MainModel;

    Main.isBarAdmin = false;
    Main.isLoggedIn = false;
    Main.toggleSideMenu = toggleSideMenu;
    Main.logOut = logOut;
    Main.goToState = goToState;

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    function goToState() {
      $ionicViewSwitcher.nextDirection('pop');
      $state.go('main.admin');
      $timeout(function() {
        $ionicSideMenuDelegate.toggleLeft(false);

      }, 300);
    }

    function toggleSideMenu() {
      if (appStorage.role === 'BAR_ADMIN' || appStorage.role === 'HUNGERS_ADMIN') {
        Main.isBarAdmin = true;
      } else {
        Main.isBarAdmin = false;
      }
      if (!appStorage.token) {
        // chnage text to login.
        Main.isLoggedIn = false;
      } else if (appStorage.token) {
        // change text to logout.
        Main.isLoggedIn = true;
      }

      $ionicSideMenuDelegate.toggleLeft();
    }

    function logOut() {
      Message.alert('로그아웃 알림', '로그아웃 하셨습니다.')
        .then(function() {
          delete appStorage.role;
          delete appStorage.user;
          delete appStorage.token;
          Main.isLoggedIn = false;
        });
    }


  }
})();
