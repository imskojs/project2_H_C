(function() {
  'use strict';
  angular.module('app')
    .controller('PlaceSearchController', PlaceSearchController);

  PlaceSearchController.$inject = ['PlaceSearchModel', 'PlaceModel', 'Places', '$state', '$scope', '$stateParams', 'Message', '$cordovaGeolocation', 'Distance', '$ionicScrollDelegate', 'daum'];

  function PlaceSearchController(PlaceSearchModel, PlaceModel, Places, $state, $scope, $stateParams, Message, $cordovaGeolocation, Distance, $ionicScrollDelegate, daum) {

    var PlaceSearch = this;
    PlaceSearch.Model = PlaceSearchModel;
    var lastSearchType = '';

    PlaceSearch.searchType = 'tag';
    PlaceSearch.getFurtherPlaces = getFurtherPlaces;
    PlaceSearch.checkForMore = checkForMore;
    PlaceSearch.searchLocationNearBy = searchLocationNearBy;
    PlaceSearch.setPlaceholderText = setPlaceholderText;
    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.leave', onLeave);

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    //  Check for places further away;
    function getFurtherPlaces() {
      if (lastSearchType === 'address') {
        return getNextPlacesWithinByLocation(PlaceSearch.search);
      } else if (lastSearchType === 'placeName') {
        return getNextPlacesWithinByName(PlaceSearch.search);
      } else if (lastSearchType === 'tag') {
        var valueObj = {
          tags: [PlaceSearch.search]
        };
        return getNextPlacesWithinWithTags(valueObj);
      }
    }
    // Check if there is more data if none infinite-scroll is disabled.;
    function checkForMore() {
      return PlaceSearchModel.more;
    }

    function onBeforeEnter() {
      lastSearchType = '';
    }

    function onLeave() {
      lastSearchType = '';
    }

    function searchLocationNearBy(value) {
      $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop(false);
      Message.loading();
      lastSearchType = 'tag';
      var valueObj = {
        tags: [value]
      };
      return getPlacesWithinWithTags(valueObj);

      // if (PlaceSearch.searchType === 'address') {
      //   lastSearchType = 'address';
      //   return getPlacesWithinByLocation(value);
      // } else if (PlaceSearch.searchType === 'placeName') {
      //   lastSearchType = 'placeName';
      //   return getPlacesWithinByName(value);
      // } else if (PlaceSearch.searchType === 'tag') {
      //   lastSearchType = 'tag';
      //   var valueObj = {
      //     tags: [value]
      //   };
      //   return getPlacesWithinWithTags(valueObj);
      // }
    }

    function setPlaceholderText() {
      if (PlaceSearch.searchType === 'address') {
        return '지역을 입력해주세요';
      } else if (PlaceSearch.searchType === 'placeName') {
        return '주점명을 입력해주세요';
      } else if (PlaceSearch.searchType === 'tag') {
        return '키워드를 입력해주세요';
      }
    }


    //------------------------
    //  HELPER
    //------------------------
    function getPlacesWithinByLocation(value) {
      var ps = new daum.maps.services.Places();
      if (!value) {
        Message.hide();
        Message.alert('통합검색 알림', '지역을 입력해주세요');
        return;
      }
      ps.keywordSearch(value, function(status, data) {
        // if no search result, notify and exit.
        if (data.places[0] === undefined) {
          Message.hide();
          Message.alert(
            '요청하신 장소가 없습니다',
            '다시검색해주세요'
          );
          return false;
        }

        return Places.getPlacesWithin({
            latitude: data.places[0].latitude,
            longitude: data.places[0].longitude,
            distance: 300000,
            limit: 4,
            populates: 'photos'
          }).$promise
          .then(function success(placesWrapper) {
            $cordovaGeolocation.getCurrentPosition({
              maximumAge: 600000,
              timeout: 5000
            })
              .then(function suc(position) {
                // Get distance from current location;
                PlaceSearchModel.currentLocation = [
                  position.coords.longitude,
                  position.coords.latitude
                ];
                angular.forEach(placesWrapper.places, function(place) {
                  var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                  place.distanceFromCurrent = distanceInMeters;
                });
                // End;
                PlaceSearchModel.places = placesWrapper.places;
                PlaceSearchModel.more = placesWrapper.more;
                Message.hide();

                $ionicScrollDelegate.$getByHandle('placeSearch').resize();
                $scope.$broadcast('scroll.infiniteScrollComplete');
              }, function er(error) {
                Message.alert(
                  '위치 공유가 꺼져있습니다.',
                  '위치 공유를 켜주세요.'
                );
                console.log(error);
                Message.hide();
              });
          }, function err(error) {
            console.log(error);
          });

      }, function(err) {
        console.log(err);
        Message.hide();
        Message.alert();
      });
    }

    function getNextPlacesWithinByLocation(value) {
      var ps = new daum.maps.services.Places();
      ps.keywordSearch(value, function(status, data) {

        // if no search result, notify and exit.
        if (data.places[0] === undefined) {
          Message.hide();
          Message.alert(
            '요청하신 장소가 없습니다',
            '다시검색해주세요'
          );
          return false;
        }

        return Places.getPlacesWithin({
            latitude: data.places[0].latitude,
            longitude: data.places[0].longitude,
            distance: 300000,
            skip: PlaceSearchModel.places.length,
            limit: 4,
            populates: 'photos'
          }).$promise
          .then(function success(placesWrapper) {
            $cordovaGeolocation.getCurrentPosition({
              maximumAge: 600000,
              timeout: 5000
            })
              .then(function suc(position) {
                // Get distance from current location;
                PlaceSearchModel.currentLocation = [
                  position.coords.longitude,
                  position.coords.latitude
                ];
                angular.forEach(placesWrapper.places, function(place) {
                  var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                  place.distanceFromCurrent = distanceInMeters;
                });
                // End;
                angular.forEach(placesWrapper.places, function(place) {
                  PlaceSearchModel.places.push(place);
                });

                PlaceSearchModel.more = placesWrapper.more;
                Message.hide();


                $ionicScrollDelegate.$getByHandle('placeSearch').resize();
                $scope.$broadcast('scroll.infiniteScrollComplete');

              }, function er(error) {
                Message.hide();
                Message.alert(
                  '위치 공유가 꺼져있습니다.',
                  '위치 공유를 켜주세요.'
                );
                console.log(error);
              });
          }, function err(error) {
            console.log(error);
          });

      }, function(err) {
        console.log(err);
        console.log(err);
        Message.hide();
        Message.alert();
      });
    }


    function getPlacesWithinByName(name) {
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
              limit: 4,
              filter: name,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                position.coords.longitude,
                position.coords.latitude
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;

              PlaceSearchModel.places = placesWrapper.places;
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();


            }, function err(error) {
              console.log(error);
            });

        }, function err(error) {
          console.log(error);
          Message.hide();
          // Message.alert(
          //   '위치 공유가 꺼져있습니다.',
          //   '위치 공유를 켜주세요.'
          // );
          return Places.getPlacesWithin({
              latitude: 37.498085435791786,
              longitude: 127.02800027507125,
              distance: 300000,
              limit: 4,
              filter: name,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                127.02800027507125,
                37.498085435791786
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;

              PlaceSearchModel.places = placesWrapper.places;
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();


            }, function err(error) {
              console.log(error);
            });

        });
      Message.hide();
    }


    function getNextPlacesWithinByName(name) {
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
              skip: PlaceSearch.Model.places.length,
              limit: 4,
              filter: name,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                position.coords.longitude,
                position.coords.latitude
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;
              angular.forEach(placesWrapper.places, function(place) {
                PlaceSearchModel.places.push(place);
              });
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

              // $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();


            }, function err(error) {
              console.log(error);
            });

        }, function err(error) {
          console.log(error);
          Message.hide();
          // Message.alert(
          //   '위치 공유가 꺼져있습니다.',
          //   '위치 공유를 켜주세요.'
          // );
          return Places.getPlacesWithin({
              longitude: 127.02800027507125,
              latitude: 37.498085435791786,
              distance: 300000,
              skip: PlaceSearch.Model.places.length,
              limit: 4,
              filter: name,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                127.02800027507125,
                37.498085435791786
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;
              angular.forEach(placesWrapper.places, function(place) {
                PlaceSearchModel.places.push(place);
              });
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();

              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

              // $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();


            }, function err(error) {
              console.log(error);
            });

        });
    }

    function getPlacesWithinWithTags(tagsObj) {
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
          return Places.getPlacesWithin({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              distance: 300000,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                position.coords.longitude,
                position.coords.latitude
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;

              PlaceSearchModel.places = placesWrapper.places;
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();


              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              // $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();


            }, function err(error) {
              console.log(error);
            });

        }, function error(err) {
          console.log(err);
          // Message.alert(
          //   '위치 공유가 꺼져있습니다.',
          //   '위치 공유를 켜주세요.'
          // );
          Message.hide();
          return Places.getPlacesWithin({
              longitude: 127.02800027507125,
              latitude: 37.498085435791786,
              distance: 300000,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                127.02800027507125,
                37.498085435791786
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;

              PlaceSearchModel.places = placesWrapper.places;
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();


              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              // $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();


            }, function err(error) {
              console.log(error);
            });

        });
      Message.hide();
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
              skip: PlaceSearch.Model.places.length,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                position.coords.longitude,
                position.coords.latitude
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;
              angular.forEach(placesWrapper.places, function(place) {
                PlaceSearchModel.places.push(place);
              });
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();

              console.log('---------- PlaceSearchModel.places ----------');
              console.log(PlaceSearchModel.places);
              console.log('HAS TYPE: ' + typeof PlaceSearchModel.places);
              console.log('---------- CONSOLE END -------------------');

              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

              // $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();

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
              longitude: 127.02800027507125,
              latitude: 37.498085435791786,
              distance: 300000,
              skip: PlaceSearch.Model.places.length,
              limit: 4,
              tags: tagsCSVInKorean,
              populates: 'photos'
            }).$promise
            .then(function success(placesWrapper) {
              // Get distance from current location;
              PlaceSearchModel.currentLocation = [
                127.02800027507125,
                37.498085435791786
              ];
              angular.forEach(placesWrapper.places, function(place) {
                var distanceInMeters = distanceFromCurrentLocation(PlaceSearchModel.currentLocation, place.location.coordinates);
                place.distanceFromCurrent = distanceInMeters;
              });
              // End;
              angular.forEach(placesWrapper.places, function(place) {
                PlaceSearchModel.places.push(place);
              });
              PlaceSearchModel.more = placesWrapper.more;
              Message.hide();

              console.log('---------- PlaceSearchModel.places ----------');
              console.log(PlaceSearchModel.places);
              console.log('HAS TYPE: ' + typeof PlaceSearchModel.places);
              console.log('---------- CONSOLE END -------------------');

              $ionicScrollDelegate.$getByHandle('placeSearch').resize();
              $scope.$broadcast('scroll.infiniteScrollComplete');

              // $ionicScrollDelegate.$getByHandle('placeSearch').scrollTop();

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
