(function() {
  'use strict';

  angular.module('applicat.push.service', ['ngCordova'])
    .service('PushService', PushService);

  PushService.$inject = [
    '$http', '$log', '$q', '$cordovaDialogs', '$window',
    '$timeout', '$rootScope', '$cordovaMedia',
    'googlePushSenderID', 'governorUrl'
  ];

  function PushService(
    $http, $log, $q, $cordovaDialogs, $window,
    $timeout, $rootScope, $cordovaMedia,
    googlePushSenderID, governorUrl
  ) {
    var deviceId = null;

    this.registerDevice = registerDevice;
    // maybe devideId is used outside of this service, or not...
    this.getDeviceId = function() {
      return deviceId;
    };

    //====================================================
    //  Implementation
    //====================================================
    function registerDevice() {
      var push = $window.PushNotification.init({
        android: {
          "senderID": googlePushSenderID
        },
        ios: {
          "badge": true,
          "sound": "true",
          "alert": "true"
        }
      });

      if (ionic.Platform.isIOS()) {
        push.getApplicationIconBadgeNumber(function(n) {
          push.setApplicationIconBadgeNumber(function() {
            console.log('---- setApplicationBadegeNumber success with ' + n + ' ----');
          }, function() {
            console.log('----- setApplicationBadgeNumber error -----');
          }, n);
        }, function() {
          console.log('---- getBadgeNumber error ----');
        });
      }

      push.on('registration', function(result) {
        if (ionic.Platform.isIOS()) {
          storeDeviceToken(result.registrationId, 'IOS');
        } else if (ionic.Platform.isAndroid()) {
          storeDeviceToken(result.registrationId, 'ANDROID');
        }
      });

      push.on('notification', function(notification) {
        if (ionic.Platform.isAndroid()) {
          $window.plugin.notification.local.schedule({
            title: notification.title,
            text: notification.message,
            icon: "res://icon.png",
            smallIcon: "res://pushicon.png"
          });
        } else if (ionic.Platform.isIOS()) {
          handleIOS(notification);
        }
      });
    }

    //====================================================
    //  Helpers
    //====================================================
    function storeDeviceToken(deviceId, deviceType) {
      var registration = {
        deviceId: deviceId,
        platform: deviceType,
        active: true
      };
      return $http({
          url: governorUrl + '/device',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: registration
        })
        .then(function(dataWrapper) {
          $log.info("PushService - registered to server: " + JSON.stringify(dataWrapper));
          deviceId = dataWrapper.data.device.deviceId;
        })
        .catch(function(err) {
          $log.info("PushService - error: " + JSON.stringify(err));
        });
    }


    function handleIOS(notification) {
      // If foreground is not checked here it would make a sound twice,
      //once when received in background and once more upon opening it by clicking
      //the notification.
      if (notification.additionalData.foreground === true) {
        // Play custom audio if a sound specified.
        if (notification.sound) {
          var audio = $cordovaMedia.newMedia(notification.sound);
          audio.then(function(r) {
            console.log('success');
            console.log(r);
            $timeout(function() {
              audio.play();
            }, 500);
          }, function(r) {
            console.log('error');
            console.log(r);
          });
        }
        $cordovaDialogs.alert(notification.title, notification.message);
      } else {
        $cordovaDialogs.alert(notification.title, notification.message);
      }
    }
  }
})();
