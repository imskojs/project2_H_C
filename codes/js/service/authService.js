(function() {
  'use strict';

  angular.module('app')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['$q', '$injector', '$location', 'LocalService', 'appName', 'appStorage'];

  function AuthInterceptor($q, $injector, $location, LocalService, appName, appStorage) {

    return {
      request: function(req) {

          // var token = LocalService.get(appName + '_auth_token');
          var token = appStorage.token;

          // if (token) {
          //     token = angular.fromJson(LocalService.get(appName + '_auth_token')).token;
          // }

          if (token) {
            req.headers['Content-Type'] = 'application/json';
            req.headers.Authorization = 'Bearer ' + token;
          }
          return req;
        }
        // , responseError: function(response) {
        //     if (response.status === 401 || response.status === 403 || response.status === 405 || response.status === 498) {

      //         if ($location.path() !== "/login") {

      //             var appToken = appName + '_auth_token';
      //             delete $localStorage[appToken];
      //             // LocalService.unset(appName + '_auth_token');
      //             $location.path("/login");

      //             if (response.data == null) {
      //                 response.data = {
      //                     message: "권한이 없는 페이지이거나 로그인하지 않았습니다. 로그인해주세요."
      //                 };
      //             }
      //         } else {
      //             response.data.hideMessage = true;
      //         }
      //     } else if (response.status === 300) {

      //         var redirectPath = null;
      //         var message = '';
      //         switch (response.data.redirectCode) {
      //             case 'ACTIVATE':
      //                 redirectPath = "/resend/false";
      //                 message: "이메일 인증을 하셔야 서비스 이용이 가능합니다.";
      //                 break;
      //             case 'RESET':
      //                 redirectPath = "/passReset";
      //                 message: "비밀번호를 봐꿔주세요.";
      //                 break;
      //         }

      //         if ($location.path() !== redirectPath) {

      //             $location.path(redirectPath);

      //             if (response.data == null) {
      //                 response.data = {
      //                     message: message
      //                 };
      //             }
      //         } else {
      //             response.data.hideMessage = true;
      //         }
      //     }
      //     return $q.reject(response);
      // }
    };
  }


  angular.module('app')
    .service("AuthService", AuthService);
  // , '$cordovaOauth', $cordovaOauth
  AuthService.$inject = ['$http', '$q', '$location', '$state', 'governorUrl', 'LocalService', 'appName', 'kakaoKey', 'facebookKey'];

  function AuthService($http, $q, $location, $state, governorUrl, LocalService, appName, kakaoKey, facebookKey) {

    // var user = null;
    // var selectedApp = {
    //     name: '어플리켓'
    // };

    // function setUser(userInfo) {
    //     user = userInfo;
    // }

    // this.getUser = function() {
    //     return user;
    // }

    // function setApp(app) {
    //     $rootScope.appName = app.name;
    //     selectedApp = app;
    // }

    // this.getApp = function() {
    //     return selectedApp;
    // }

    // this.getToken = function() {
    //     var token = LocalService.get(appName + '_auth_token');

    //     if (token) {
    //         token = angular.fromJson(LocalService.get(appName + '_auth_token')).token;
    //         return token;
    //     } else {
    //         $state.go('login');
    //     }
    // }

    // this.init = function() {
    //     var token = JSON.parse(LocalService.get(appName + '_auth_token'));
    //     if (token != null && token.user != null)
    //         setUser(token.user);
    // }

    // this.register = function(user) {

    //     var deferred = $q.defer();

    //     $http({
    //         url: governorUrl + '/user/register',
    //         method: 'post',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         params: user
    //     })
    //         .success(function(data, status, headers, config) {
    //             deferred.resolve(data);
    //         })
    //         .error(function(data, status, headers, config) {
    //             deferred.reject(data);
    //         });
    //     return deferred.promise;
    // }

    this.registerWithImage = function(user, file, success, fail) {

      var options = new FileUploadOptions();

      var newUser = angular.copy(user);

      options.params = newUser;
      options.headers = {
        Connection: "close"
      }
      options.chunkedMode = false;

      var ft = new FileTransfer();

      ft.upload(file, encodeURI(governorUrl + '/user/registerWithImage'), success, fail, options, true);
    }

    // this.login = function(email, password) {

    //     var deferred = $q.defer();

    //     $http({
    //         url: governorUrl + '/auth/local',
    //         method: 'post',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         data: {
    //             'identifier': email,
    //             'password': password
    //         }
    //     })
    //         .success(function(data, status, headers, config) {

    //             console.log(data);
    //             LocalService.set(appName + '_auth_token', JSON.stringify(data));
    //             setUser(data.user);

    //             deferred.resolve(data);
    //         })
    //         .error(function(data, status, headers, config) {
    //             console.log(data);
    //             deferred.reject(data);
    //         });

    //     return deferred.promise;

    // }

    this.verifyResetCode = function(email, code) {

      var deferred = $q.defer();


      $http({
          url: governorUrl + '/user/passwordresetcomplete',
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'email': email,
            'code': code
          }
        })
        .success(function(data, status, headers, config) {
          LocalService.set(appName + '_auth_token', JSON.stringify(data));
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });

      return deferred.promise;

    }

    this.passReset = function(email) {

      var deferred = $q.defer();

      $http({
          url: governorUrl + '/user/resetStart',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'email': email
          }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    // this.logout = function() {
    //     LocalService.unset(appName + '_auth_token');
    //     setUser(null);
    //     $location.path("/login");
    // }

    this.changePassword = function(oldPassword, newPassword) {

      var deferred = $q.defer();

      $http({
          url: governorUrl + '/user/changePassword',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'oldPassword': oldPassword,
            'newPassword': newPassword
          }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });

      return deferred.promise;
    }

    this.checkNickname = function(nickname) {

      var deferred = $q.defer();

      $http({
          url: governorUrl + '/user/checknickname',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            nickname: nickname
          }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    this.checkEmail = function(email) {

      var deferred = $q.defer();

      $http({
          url: governorUrl + '/user/checkEmail',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
          params: {
            email: email
          }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    this.getMyProfile = function() {
      var deferred = $q.defer();

      $http({
          url: governorUrl + '/user/profile',
          method: 'get',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    this.updateMyProfile = function(nickname) {
      var deferred = $q.defer();

      $http({
          url: governorUrl + '/user/update',
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            nickname: nickname
          }
        })
        .success(function(data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    this.updateMyProfileWithImage = function(user, file, success, fail) {

      var options = new FileUploadOptions();

      var updateUser = angular.copy(user);

      options.params = updateUser;
      options.httpMethod = 'PUT';
      options.headers = {
        Connection: "close",
        Authorization: 'Bearer ' + this.getToken()
      }
      options.chunkedMode = false;

      var ft = new FileTransfer();

      ft.upload(file, encodeURI(governorUrl + '/user/updateWithImage'), success, fail, options, true);
    }


    // this.loginWithKakao = function() {

    //   var deferred = $q.defer();

    //   $cordovaOauth.kakao(kakaoKey).then(function(result) {
    //     result.provider = 'kakao';

    //     console.log('kakao server result');
    //     console.log(result);
    //     $http({
    //         url: governorUrl + '/auth/register',
    //         method: 'post',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         data: result
    //       })
    //       .success(function(data, status, headers, config) {

    //         LocalService.set(appName + '_auth_token', JSON.stringify(data));
    //         console.log('kakao response from server');
    //         console.log(JSON.stringify(data, null, 2));
    //         console.log(JSON.stringify(data.user, null, 2));
    //         setUser(data.user);

    //         deferred.resolve({
    //           message: 'done'
    //         });
    //       })
    //       .error(function(data, status, headers, config) {
    //         console.log(data);
    //         deferred.reject(data);
    //       });


    //   }, function(error) {
    //     deferred.reject(error);
    //   });

    //   return deferred.promise;
    // }

    // this.loginWithFacebook = function() {

    //   var deferred = $q.defer();

    //   $cordovaOauth.facebook(facebookKey, ["email"]).then(function(result) {
    //     result.provider = 'facebook';

    //     console.log('facebook server result');
    //     console.log(result);
    //     $http({
    //         url: governorUrl + '/auth/register',
    //         method: 'post',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         data: result
    //       })
    //       .success(function(data, status, headers, config) {

    //         LocalService.set(appName + '_auth_token', JSON.stringify(data));
    //         setUser(data.user);
    //         console.log('facebook response from our server');
    //         console.log(JSON.stringify(data, null, 2));
    //         console.log(JSON.stringify(data.user, null, 2));

    //         deferred.resolve({
    //           message: 'done'
    //         });
    //       })
    //       .error(function(data, status, headers, config) {
    //         console.log(data, status, headers, config);
    //         deferred.reject(data);
    //       });


    //   }, function(error) {
    //     deferred.reject(error);
    //   });

    //   return deferred.promise;
    // }





  }


})();
