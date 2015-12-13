(function() {
  'use strict';
  angular.module('app')
    .controller('PlaceController', PlaceController);

  PlaceController.$inject = [
    'PlaceModel', 'Dom', '$ionicHistory', '$scope', '$stateParams', '$state', '_', '$ionicScrollDelegate',
    'appStorage'
  ];

  function PlaceController(
    PlaceModel, Dom, $ionicHistory, $scope, $stateParams, $state, _, $ionicScrollDelegate,
    appStorage
  ) {
    var Place = this;
    Place.Model = PlaceModel;

    Place.menuSelectHandler = menuSelectHandler;
    Place.getParams = getParams;
    Place.isLocation = isLocation;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    function menuSelectHandler(arrayData, ionicScrollHandle, $index, item) {
      appStorage.scrollPositionY = 0;
      $state.go('main.place.list', {
        from: item.params.from
      });
      // Dom.menuScroller(arrayData, ionicScrollHandle, $index);
      PlaceModel.currentItem = item;
      console.log(PlaceModel.currentItem);
    }

    function getParams(param) {
      return $state.params[param];
    }

    function isLocation() {
      return $state.params.category === 'north' ||
        $state.params.category === 'south';
    }

    function onAfterEnter() {
      if ($stateParams.category === 'theme') {
        PlaceModel.currentCategory = PlaceModel.from.theme.category;
        // set currentItem to the one that is matching one of PlaceModel.from.theme.category
        angular.forEach(PlaceModel.currentCategory, function(obj) {
          var category = obj.params.from;
          if (category === $state.params.from) {
            PlaceModel.currentItem = obj;
          }
        });
      } else if ($stateParams.category === 'type') {
        PlaceModel.currentCategory = PlaceModel.from.type.category;
        angular.forEach(PlaceModel.currentCategory, function(obj) {
          var category = obj.params.from;
          if (category === $state.params.from) {
            PlaceModel.currentItem = obj;
          }
        });
      } else if ($stateParams.category === 'north' || $stateParams.category === 'south') {
        PlaceModel.currentCategory = PlaceModel.from.location.category;
        angular.forEach(PlaceModel.currentCategory, function(obj) {
          var category = obj.params.from;
          if (category === $state.params.from) {
            PlaceModel.currentItem = obj;
          }
        });
      } else {
        console.log('should not route back here');
      }
      moveIonScrollToCurrentIndex(PlaceModel.currentCategory);
    }

    //------------------------
    //  HELPER FUNCTIONS
    //------------------------



    function moveIonScrollToCurrentIndex(array) {
      var currentIndex = _.pluck(_.pluck(PlaceModel.currentCategory, 'params'), 'from')
        .indexOf($state.params.from);
      Dom.menuScroller(array, currentIndex, $ionicScrollDelegate);
      // Also set currentItem
      PlaceModel.currentItem = array[currentIndex];
    }
  }
})();
