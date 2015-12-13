/**
 * Created by Seunghoon Ko on 10/10/2015
 * As part of applicat platform
 *
 * Copyright (C) Applicat (www.applicat.co.kr) & Seunghoon Ko - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Seunghoon Ko <imskojs@gmail.com>, 10/10/2015
 *
 */
(function() {
  'use strict';

  angular.module('app')
    .factory('U', U);

  U.$inject = [
    '$ionicHistory', '$ionicScrollDelegate', '$timeout', '_', '$filter',
    'Message', '$ionicSideMenuDelegate', '$state',
    '$ionicViewSwitcher', '$ionicSlideBoxDelegate'
  ];

  function U(
    $ionicHistory, $ionicScrollDelegate, $timeout, _, $filter,
    Message, $ionicSideMenuDelegate, $state,
    $ionicViewSwitcher, $ionicSlideBoxDelegate
  ) {

    var service = {
      isForwardView: isForwardView,
      isBackView: isBackView,
      isSiblingView: isSiblingView,
      areSiblingViews: areSiblingViews,
      resize: resize,
      update: update,
      resetSlides: resetSlides,
      reset: reset,
      goToState: goToState,
      goBack: goBack,
      error: error,
      bindData: bindData,
      appendData: appendData,
      broadcast: broadcast
    };

    return service;

    function isForwardView(stateName) {
      console.log($ionicHistory.viewHistory());
      var isView =
        $ionicHistory.viewHistory().forwardView &&
        $ionicHistory.viewHistory().forwardView.stateName === stateName;
      return isView;
    }

    function isBackView(stateName) {
      console.log($ionicHistory.viewHistory());
      var isView =
        $ionicHistory.viewHistory().backView &&
        $ionicHistory.viewHistory().backView.stateName === stateName;
      return isView;
    }

    function isSiblingView(stateName) {
      return isForwardView(stateName) || isBackView(stateName);
    }

    function areSiblingViews(stateNames) {
      var i;
      var stateName;
      for (i = 0; i < stateNames.length; i++) {
        stateName = stateNames[i];
        if (isSiblingView(stateName)) {
          return true;
        }
      }
      return false;
    }

    function resize() {
      $timeout(function() {
        $ionicScrollDelegate.resize();
      }, 0);
    }

    function update() {
      $timeout(function() {
        $ionicSlideBoxDelegate.update();
      }, 0);
    }

    function resetSlides() {
      $ionicSlideBoxDelegate.slide(0, 0);
      $ionicSlideBoxDelegate.update();
    }

    function reset(model) {
      for (var key in model) {
        if (Array.isArray(model[key])) {
          model[key] = [];
        } else if (model[key] !== null && typeof model[key] === 'object') {
          model[key] = {};
        } else if (typeof model[key] === 'boolean') {
          model[key] = false;
        } else {
          model[key] = null;
        }
      }
    }

    function goToState(state, params, direction) {
      Message.hide();
      $timeout(function() {
        if (direction) {
          $ionicViewSwitcher.nextDirection(direction);
        }
        $state.go(state, params);
        $ionicSideMenuDelegate.toggleLeft(false);
      }, 0);
    }

    function goBack(direction) {
      if (direction) {
        $ionicViewSwitcher.nextDirection(direction);
      }
      $ionicHistory.goBack();
    }

    function error(err) {
      Message.hide();
      Message.alert();
      console.log(err);
    }

    function bindData(data, model, name) {
      // if data is a dataWrapper
      if (name[name.length - 1] === 's') {
        model[name] = data[name];
        model.more = data.more;
        // if data is a data
      } else {
        model[name] = data;
      }
      resize();
      $timeout(function() {
        model.loading = false;
      }, 50);
    }

    function appendData(dataWrapper, model, name) {
      if (name[name.length - 1] === 's') {
        angular.forEach(dataWrapper[name], function(item) {
          model[name].push(item);
        });
        model.more = dataWrapper.more;
        resize();
        // if data is a data
      } else {
        console.error('no dataWrapper.data perhaps dataWrapper is data.');
      }
    }

    function broadcast($scope) {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

  } // Service END
})();
