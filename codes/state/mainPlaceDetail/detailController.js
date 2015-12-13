(function() {
  'use strict';
  angular.module('app')
    .controller('DetailController', DetailController);

  DetailController.$inject = ['DetailModel', '$stateParams', '$scope', 'Message',
    'Places', '$ionicSlideBoxDelegate', '$window', '$ionicModal', 'Posts', 'appStorage', 'moment', '$rootScope', '$ionicHistory', '$q', '$ionicScrollDelegate'
  ];

  function DetailController(DetailModel, $stateParams, $scope, Message, Places,
    $ionicSlideBoxDelegate, $window, $ionicModal, Posts, appStorage, moment, $rootScope, $ionicHistory, $q, $ionicScrollDelegate
  ) {
    var Detail = this;
    Detail.Model = DetailModel;

    Detail.callPhone = callPhone;
    Detail.showMenu = showMenu;
    Detail.openReview = openReview;
    Detail.isLoggedIn = isLoggedIn;
    Detail.isHuntingBar = isHuntingBar;
    Detail.hasPopularMenu = hasPopularMenu;
    Detail.hasSexPercentage = hasSexPercentage;
    Detail.goBack = goBack;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.enter', onEnter);
    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('$ionicView.beforeLeave', onBeforeLeave);

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    function goBack() {
      appStorage.isBackViewDetail = true;
      $ionicHistory.goBack();
    }

    function hasPopularMenu() {
      var hasFood = Detail.Model.current.popularFood && Detail.Model.current.popularFood[0].name;
      var hasDrink = Detail.Model.current.popularDrink && Detail.Model.current.popularDrink[0].name;
      if (hasFood || hasDrink) {
        return true;
      } else {
        return false;
      }
    }

    function hasSexPercentage() {
      var hasMale = Detail.Model.current.male;
      var hasFemale = Detail.Model.current.female;
      if (hasMale || hasFemale) {
        return true;
      } else {
        return false;
      }
    }

    function isHuntingBar() {
      return DetailModel.current.tags.indexOf('헌팅') !== -1;
    }

    function isLoggedIn() {
      return !!appStorage.role;
    }

    function callPhone() {
      $window.location.href = 'tel:' + DetailModel.current.phone;
    }

    function openReview() {
      $window.open(DetailModel.current.reviewUrl, '_system');
    }

    function showMenu() {
      Detail.modal.show();
    }

    function onBeforeEnter() {
      $ionicScrollDelegate.$getByHandle('placeDetail').scrollTop();
      Detail.showPhotos = false;
      $rootScope.isTransitioning = true;
      reset();
      var loadPromise = loadPlace();
      getPostsByPlaceId($stateParams.id);
      Detail.month = moment().month() + 1;
      Detail.week = Math.ceil(moment().date() / 7);
      var deferred = $q.defer();
      deferred.resolve(loadPromise);
      return deferred.promise
        .then(function() {
          $ionicSlideBoxDelegate.update();
          $ionicSlideBoxDelegate.slide(0, 0);
          $ionicSlideBoxDelegate.enableSlide(true);
        });
    }

    function onAfterEnter() {
      Detail.showPhotos = true;
      console.log("---------- Detail.Model.current.updatedAt ----------");
      console.log(Detail.Model.current.updatedAt);
      console.log("HAS TYPE: " + typeof Detail.Model.current.updatedAt);

    }

    function onEnter() {
      // $ionicSlideBoxDelegate.update();
      // $ionicSlideBoxDelegate.slide(0, 0);
      // $ionicSlideBoxDelegate.enableSlide(true);
    }

    function onBeforeLeave() {
      $ionicSlideBoxDelegate.slide(0, 0);
      $ionicSlideBoxDelegate.update();
    }

    //------------------------
    //  HELPER
    //------------------------
    function reset() {
      DetailModel.current = {};
      DetailModel.current.photos = [];
      DetailModel.current.openingHours = [];
      DetailModel.current.tags = [];
      // DetailModel.posts = [];
    }

    function loadPlace() {
      Message.loading();
      return Places.findById({
          id: $stateParams.id,
          populates: 'photos,products'
        }).$promise
        .then(function success(place) {
          console.log("---------- place ----------");
          console.log(place);
          console.log("HAS TYPE: " + typeof place);

          DetailModel.current = place;
          Message.hide();

        }, function err(error) {
          console.log(error);
          Message.alert(
            '주점 알림',
            '요청하신 주점은 없는 주점입니다.'
          );
        });
    }

    function getPostsByPlaceId(id) {
      Message.loading();
      return Posts.getPosts({
          place: id
        }).$promise
        .then(function succes(postsWrapper) {
          DetailModel.posts = postsWrapper.posts;
          console.log('---------- postsWrapper ----------');
          console.log(postsWrapper);
          console.log('HAS TYPE: ' + typeof postsWrapper);
          console.log('---------- CONSOLE END -------------------');

        }, function err(error) {
          console.log('---------- error ----------');
          console.log(error);
          console.log('HAS TYPE: ' + typeof error);
          console.log('---------- CONSOLE END -------------------');

        });
    }

    //====================================================
    //  Modal
    //====================================================
    $ionicModal.fromTemplateUrl('state/mainPlaceDetail/menuModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    })
      .then(function(modal) {
        Detail.modal = modal;
      });


  } //Factory function

})();
