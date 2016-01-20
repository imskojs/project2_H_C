(function() {
  'use strict';

  angular.module('app', [
    'applicat.push.service',
    'ionic',
    'ngCordova',
    'ngResource',
    'ngTemplates',
    'ngStorage'
  ])

  .run([

    '$ionicPlatform', '$rootScope', '$stateParams', '$state', 'AuthService', '$window', '$ionicHistory', '$ionicSideMenuDelegate', 'Message', '$timeout', 'PushService', 'gpsService', 'appStorage',

    function($ionicPlatform, $rootScope, $stateParams, $state, AuthService, $window, $ionicHistory, $ionicSideMenuDelegate, Message, $timeout, PushService, gpsService, appStorage) {
      // $state.go('main.home.theme');
      // AuthService.init();
      $rootScope.goBack = function() {
        $ionicHistory.goBack();
      };

      $rootScope.appStorage = appStorage;

      $rootScope.isState = function(state) {
        return state === $ionicHistory.currentStateName();
      };

      $rootScope.isParam = function(paramObj) {
        for (var key in paramObj) {
          var value = paramObj[key];
          if ($stateParams[key] === value) {
            return true;
          }
        }
        return false;
      };


      $rootScope.goToState = function(state, params) {
        $ionicSideMenuDelegate.toggleLeft(false);
        $state.go(state, params);
      };

      $rootScope.loading = function() {
        Message.loading();
        $timeout(function() {
          Message.hide();
        }, 2000);
      };

      $rootScope.$on('$stateChangeStart', function() {
        Message.loading();
      });

      $rootScope.$on('$stateChangeSuccess', function() {
        Message.hide();
      });

      function areStates(states) {
        console.log('states');
        console.log(states.indexOf($ionicHistory.currentStateName()) !== -1);
        return states.indexOf($ionicHistory.currentStateName()) !== -1;
      }

      $ionicPlatform.ready(function() {
        if ($window.cordova && $window.cordova.plugins.Keyboard) {
          $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          $state.go('main.home.theme');
          PushService.registerDevice();
        }
        if ($window.StatusBar) {
          $window.StatusBar.styleDefault();
        }
        if ($window.cordova) {
          gpsService.checkGPS();
          $state.go('main.home.theme');
        }
        $ionicPlatform.registerBackButtonAction(function(e) {
          e.preventDefault();
          if (areStates(['main.detail'])) {
            appStorage.isBackViewDetail = true;
            return $ionicHistory.goBack();
          }
          $ionicHistory.goBack();
        }, 101);

        // $ionicPlatform.registerBackButtonAction(function(e) {

        //   console.log('gogo');
        //   // console.log($rootScope.isState('admin'));
        //   e.preventDefault();

        //   if ($rootScope.isState('admin')) {
        //     console.log('gogo admin');
        //     return $state.go('main.home.theme');
        //   }
        //   $ionicHistory.goBack();
        // }, 101);

      });
    }
  ])

  .config([

    '$stateProvider', '$httpProvider',

    function($stateProvider, $httpProvider) {

      // Security handler
      $httpProvider.interceptors.push('AuthInterceptor');

      // Allow session
      // $httpProvider.defaults.withCredentials = true;
      $stateProvider

        .state('main.admin', {
          url: '/admin',
          views: {
            main: {
              templateUrl: 'state/admin/admin.html',
              controller: 'AdminController as Admin'
            }
          }
        })
        .state('adminMenu', {
          url: '/adminMenu',
          templateUrl: 'state/adminMenu/adminMenu.html',
          controller: 'AdminMenuController as AdminMenu'
        })

      .state('login', {
        url: '/login',
        templateUrl: 'state/login/login.html',
        controller: 'LoginController as Login'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: 'state/signup/signup.html',
        controller: 'SignupController as Signup'
      })

      .state('eventRegister', {
        url: '/eventRegister/:id',
        templateUrl: 'state/eventRegister/eventRegister.html',
        controller: 'EventRegisterController as EventRegister'
      })


      .state('main.daumMap', {
        url: '/daumMap/:id',
        views: {
          main: {
            templateUrl: 'state/daumMap/daumMap.html',
            controller: 'DaumMapController as Map'
          }
        }
      })

      .state('main', {
        // abstract: true,
        url: '/main',
        templateUrl: 'state/main/main.html',
        controller: 'MainController as Main'
      })

      .state('main.home', {
          // abstract: true,
          url: '/home',
          views: {
            main: {
              templateUrl: 'state/mainHome/home.html',
              controller: 'HomeController as Home'
            }
          }
        })
        .state('main.home.theme', {
          url: '/theme',
          views: {
            home: {
              templateUrl: 'state/mainHomeTheme/theme.html',
              controller: 'ThemeController as Theme'
            }
          }
        })
        .state('main.home.type', {
          url: '/type',
          views: {
            home: {
              templateUrl: 'state/mainHomeType/type.html',
              controller: 'TypeController as Type'
            }
          }
        })
        .state('main.home.location', {
          url: '/location',
          views: {
            home: {
              templateUrl: 'state/mainHomeLocation/location.html',
              controller: 'LocationController as Location'
            }
          }
        })

      .state('main.detail', {
        url: '/detail/:id',
        views: {
          main: {
            templateUrl: 'state/mainPlaceDetail/detail.html',
            controller: 'DetailController as Detail'
          }
        }
      })

      .state('main.event', {
          url: '/event',
          views: {
            main: {
              templateUrl: 'state/mainEvent/event.html',
              controller: 'EventController as Event'
            }
          }
        })
        .state('main.event.list', {
          url: '/list/:eventType',
          views: {
            event: {
              templateUrl: 'state/mainEventList/list.html',
              controller: 'EventListController as EventList'
            }
          }
        })
        .state('main.eventDetail', {
          url: '/eventDetail/:id',
          views: {
            main: {
              templateUrl: 'state/mainEventDetail/eventDetail.html',
              controller: 'EventDetailController as EventDetail'
            }
          }
        })

      .state('main.place', {
          url: '/place/:category',
          views: {
            main: {
              templateUrl: 'state/mainPlace/place.html',
              // controller: 'PlaceController as Place'
            }
          }
        })
        .state('main.place.list', {
          url: '/:from/list',
          views: {
            place: {
              templateUrl: 'state/mainPlaceList/placeList.html',
              controller: 'PlaceListController as PlaceList'
            }
          }
        })

      .state('placeSearch', {
        url: '/placeSearch',
        templateUrl: 'state/placeSearch/placeSearch.html',
        controller: 'PlaceSearchController as PlaceSearch'
      })

      .state('main.noticeList', {
        url: '/noticeList',
        views: {
          main: {
            templateUrl: 'state/mainNoticeList/noticeList.html',
            controller: 'NoticeListController as NoticeList'
          }
        }
      })

      .state('main.noticeDetail', {
        url: '/noticeDetail/:id',
        views: {
          main: {
            templateUrl: 'state/mainNoticeDetail/noticeDetail.html',
            controller: 'NoticeDetailController as NoticeDetail'
          }
        }
      })

      .state('main.association', {
        url: '/association',
        views: {
          main: {
            templateUrl: 'state/mainAssociation/association.html',
            controller: 'AssociationController as Association'
          }
        }
      })

      .state('main.contract', {
        url: '/contract',
        views: {
          main: {
            templateUrl: 'state/mainContract/contract.html'
              // controller: 'ContractController as Contract'
          }
        }
      })

      .state('main.customer', {
        url: '/customer',
        views: {
          main: {
            templateUrl: 'state/mainCustomer/customer.html',
            controller: 'CustomerController as Customer'
          }
        }
      });

    } //END
  ]);

})();
