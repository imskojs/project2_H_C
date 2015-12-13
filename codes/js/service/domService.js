(function() {
  'use strict';

  angular.module('app')
    .factory('Dom', Dom);

  Dom.$inject = [
    '$timeout', '$window', '$ionicScrollDelegate', '$rootScope',
    'appStorage'
  ];

  function Dom(
    $timeout, $window, $ionicScrollDelegate, $rootScope,
    appStorage
  ) {
    var service = {
      focusById: focusById,
      menuScroller: menuScroller
    };

    return service;
    // <input id="daum-map-search-input" type="text">
    // Dom.focusById('daum-map-search-input');
    function focusById(id) {
      $timeout(function() {
        var domElement = $window.document.getElementById(id);
        if (domElement) {
          domElement.focus();
        }
      });
    }
    // <ion-scroll
    //     direction="x"
    //     scrollbar-x=false
    //     delegate-handle="categoryMenu"
    // >
    //     <ul class="category-ul">
    //         <li id="{{::category.id}}" class="category-li"
    //             ng-repeat="category in categories"
    //             ng-click="selectHandler(categories, 'categoryMenu', $index, $event, 2.8, category)">
    //             <h2>{{ category.location }}</h2>
    //         </li>
    //     </ul>
    // </ion-scroll>
    function menuScroller(arrayData, $index) {
      function calculatePixelToIndex(index) {
        var totalVw = 0;
        for (var i = 0; i < index; i++) {
          totalVw += arrayData[i].vw;
        }
        var totalPixelToIndex = (totalVw / 100) * $rootScope.windowWidth +
          ($rootScope.windowWidth / 2) +
          ((arrayData[index].vw / 100) * $rootScope.windowWidth / 2) -
          $rootScope.windowWidth;
        return totalPixelToIndex;
      }

      var pixelLocation = calculatePixelToIndex($index);
      console.log('this');
      console.log(pixelLocation);
      $timeout(function() {
        $ionicScrollDelegate.scrollTo(pixelLocation, appStorage.scrollPositionY, true);
      }, 0);
    }
  }

})();
