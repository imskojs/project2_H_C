(function() {
  'use strict';
  angular.module('app')
    .controller('PlaceListController', PlaceListController);

  PlaceListController.$inject = ['PlaceListModel', 'PlaceModel', 'Places', '$state', '$scope', '$stateParams', 'Message', '$cordovaGeolocation', 'Distance', '$ionicScrollDelegate', 'appStorage'];

  function PlaceListController(PlaceListModel, PlaceModel, Places, $state, $scope, $stateParams, Message, $cordovaGeolocation, Distance, $ionicScrollDelegate, appStorage) {

    var PlaceList = this;
    PlaceList.Model = PlaceListModel;

    PlaceList.getFurtherPlaces = getFurtherPlaces;
    PlaceList.checkForMore = checkForMore;
    PlaceList.goToState = goToState;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    function goToState(place) {
      var scrollPos = $ionicScrollDelegate.$getByHandle('placeList').getScrollPosition();
      console.log("---------- scrollPos ----------");
      console.log(scrollPos);
      console.log("HAS TYPE: " + typeof scrollPos);
      appStorage.scrollPositionY = scrollPos.top;
      $state.go('main.detail', {
        id: place.id
      });
    }

    function getFurtherPlaces() {
      getNextPlacesWithinWithTags({
        tags: [$stateParams.from]
      });
    }

    function checkForMore() {
      return PlaceListModel.more;
    }

    function onBeforeEnter() {
      Message.loading();
      getPlacesWithinWithTags({
        tags: [$stateParams.from]
      });
    }

    //------------------------
    //  HELPER
    //------------------------
    function getPlacesWithinWithTags(tagsObj) {
      // if (U.areSiblingViews(['main.detail'])) {
      //   console.log("---------- 'main.detail' ----------");
      //   console.log('main.detail');
      //   console.log("HAS TYPE: " + typeof 'main.detail');

      //   return false;
      // }

      if (appStorage.isBackViewDetail) {
        appStorage.isBackViewDetail = false;
        Message.hide();
        return false;
      }
      PlaceListModel.places = [];
      PlaceListModel.more = false;
      // tagsObj={tags: ['hunting', 'romance', 'friends']};
      var tagsArray = tagsObj.tags; // tagsArray=['hunting', 'romance', 'friends'];
      var tagsArrayKorean = mapTagsToKorean(tagsArray); //tagsArrayKorean = ['헌팅', '감성', '친구'];
      var tagsCSVInKorean = tagsArrayKorean.join(','); //tagsCSVInKorean = '헌팅,감성,친구';

      $cordovaGeolocation.getCurrentPosition({
        maximumAge: 600000,
        timeout: 5000
      })
        .then(function success(position) {
          if (position.coords == null) {
            Message.hide();
            Message.alert(
              '위치 공유가 꺼져있습니다.',
              '위치 공유를 켜주세요.'
            );
            return false;
          }
          console.log(position.coords);
          return Places.getPlacesWithin({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              distance: 300000,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              PlaceListModel.currentLocation = [
                position.coords.longitude,
                position.coords.latitude
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceListModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              PlaceListModel.places = placesWrapper.places;
              PlaceListModel.more = placesWrapper.more;
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeList').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function err(error) {
              console.log(error);
              Message.hide();
              Message.alert();
            });

        }, function error(err) {
          console.log(err);
          PlaceListModel.places = [];
          PlaceListModel.more = false;
          Message.hide();

          Places.getPlacesWithin({
            latitude: 37.498085435791786,
            longitude: 127.02800027507125,
            distance: 300000,
            limit: 4,
            tags: tagsCSVInKorean,
            populates: 'photos'
          }).$promise
            .then(function success(placesWrapper) {
              PlaceListModel.more = placesWrapper.more;
              PlaceListModel.currentLocation = [
                127.02800027507125,
                37.498085435791786
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceListModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });

              PlaceListModel.places = placesWrapper.places;
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeList').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function err(error) {
              console.log(error);
              Message.hide();
              Message.alert();
            });
        });
    }

    function getNextPlacesWithinWithTags(tagsObj) {
      var tagsArray = tagsObj.tags; // tagsArray=['hunting', 'romance', 'friends'];
      var tagsArrayKorean = mapTagsToKorean(tagsArray); //tagsArrayKorean = ['헌팅', '감성', '친구'];
      var tagsCSVInKorean = tagsArrayKorean.join(','); //tagsCSVInKorean = '헌팅,감성,친구';

      $cordovaGeolocation.getCurrentPosition({
        maximumAge: 600000,
        timeout: 5000
      })
        .then(function success(position) {
          if (position.coords == null) {
            Message.hide();
            Message.alert(
              '위치 공유가 꺼져있습니다.',
              '위치 공유를 켜주세요.'
            );
            return false;
          }
          return Places.getPlacesWithin({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              distance: 300000,
              skip: PlaceList.Model.places.length,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceListModel.more = placesWrapper.more;
              PlaceListModel.currentLocation = [
                position.coords.longitude,
                position.coords.latitude
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceListModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;
              angular.forEach(placesWrapper.places, function(place) {
                PlaceListModel.places.push(place);
              });
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeList').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function err(error) {
              console.log(error);
            });

        }, function error(err) {
          console.log(err);
          Message.hide();
          // Message.alert(
          //   '위치 공유가 꺼져있습니다.',
          //   '위치 공유를 켜주세요.'
          // );
          return Places.getPlacesWithin({
              latitude: 37.498085435791786,
              longitude: 127.02800027507125,
              distance: 300000,
              skip: PlaceListModel.places.length,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceListModel.more = placesWrapper.more;
              PlaceListModel.currentLocation = [
                127.02800027507125,
                37.498085435791786
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceListModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              angular.forEach(placesWrapper.places, function(place) {
                PlaceListModel.places.push(place);
              });
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeList').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

            }, function err(error) {
              console.log(error);
            });
        });

    }


    //------------------------
    //  HELPER^2
    //------------------------
    function distanceFromCurrentLocation(currentCoord, placeCoord) {
      var p1 = {
        longitude: currentCoord[1],
        latitude: currentCoord[0]
      };
      var p2 = {
        longitude: placeCoord[1],
        latitude: placeCoord[0]
      };
      var distanceInMeters = Distance.between(p1, p2);
      return distanceInMeters;
    }

    function mapTagsToKorean(englishTags) {
      var mapperObjs = [{
        korean: '헌팅',
        english: 'hunting'
      }, {
        korean: '감성',
        english: 'eighties'
      }, {
        korean: '데이트',
        english: 'romance'
      }, {
        korean: '친구',
        english: 'friends'
      }, {
        korean: '이색',
        english: 'unique'
      }, {
        korean: '안주',
        english: 'dishes'
      }, {
        korean: '호프/포차',
        english: 'pocha'
      }, {
        korean: 'PUB',
        english: 'pub'
      }, {
        korean: '이자카야',
        english: 'izakaya'
      }, {
        korean: '맥주',
        english: 'beer'
      }, {
        korean: '민속/퓨전',
        english: 'fusion'
      }, {
        korean: 'BAR',
        english: 'lounge'
      }, {
        korean: '홍대',
        english: 'hongdea'
      }, {
        korean: '이태원',
        english: 'etehwon'
      }, {
        korean: '건대입구',
        english: 'gundeaentrance'
      }, {
        korean: '경리단길',
        english: 'gyungridangil'
      }, {
        korean: '강남',
        english: 'gangnam'
      }, {
        korean: '신논현',
        english: 'sinnonhyun'
      }, {
        korean: '가로수길',
        english: 'garohsoogil'
      }, {
        korean: '신림',
        english: 'shinrim'
      }];
      for (var i = 0; i < mapperObjs.length; i++) {
        var english = mapperObjs[i].english;
        var korean = mapperObjs[i].korean;
        for (var j = 0; j < englishTags.length; j++) {
          var englishTag = englishTags[j];
          if (englishTag === english) {
            englishTags.splice(j, 1, korean);
          }
        }
      }
      var convertedTagsArray = englishTags;
      return convertedTagsArray;
    }

  }
})();
