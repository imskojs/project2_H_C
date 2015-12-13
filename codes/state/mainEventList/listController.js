(function() {
  'use strict';
  angular.module('app')
    .controller('EventListController', EventListController);

  EventListController.$inject = ['EventListModel', 'Posts', '$stateParams', 'Message', '$scope'];

  function EventListController(EventListModel, Posts, $stateParams, Message, $scope) {

    var category = '';

    var EventList = this;
    EventList.Model = EventListModel;

    EventList.getOlderPosts = getOlderPosts;
    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    $scope.$on('$ionicView.beforeLeave', onBeforeLeave);

    //====================================================
    //  IMPLEMENTATION
    //====================================================

    function onBeforeEnter() {
      if ($stateParams.eventType === 'hungersEvent') {
        category = 'HUNGERS-EVENT-POST';
      } else if ($stateParams.eventType === 'barEvent') {
        category = 'LIQUOR-EVENT-POST';
      }
      getPosts(category);
    }



    //====================================================
    //  HELPER
    //====================================================
    // category: 'HUNGERS-EVENT-POST',
    // category: 'LIQUOR-EVENT-POST',
    function getOlderPosts() {
      if ($stateParams.eventType === 'hungersEvent') {
        category = 'HUNGERS-EVENT-POST';
      } else if ($stateParams.eventType === 'barEvent') {
        category = 'LIQUOR-EVENT-POST';
      }
      var currentPosts = EventListModel.posts;
      Posts.getPosts({
        category: category,
        sort: 'id DESC',
        limit: 5,
        populates: 'photos',
        olderThan: currentPosts[currentPosts.length - 1].id
      }).$promise
        .then(function success(postsWrapper) {
          postsWrapper.posts.forEach(function(post) {
            currentPosts.push(post);
          });
          $scope.$broadcast('scroll.infiniteScrollComplete');
          EventListModel.more = postsWrapper.more;
        }, function err(error) {
          console.log(error);
          Message.alert();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    function getPosts(category) {
      if (EventListModel.posts.length < 5) {
        Message.loading();
        return Posts.getPosts({
            category: category,
            sort: 'id DESC',
            limit: 5,
            populates: 'photos'
          }).$promise
          .then(function success(postsWrapper) {
            EventListModel.posts = postsWrapper.posts;
            EventListModel.more = postsWrapper.more;
            Message.hide();
          }, function err(error) {
            console.log(error);
            Message.alert();
            Message.hide();
          });
      }
    }

    function onBeforeLeave() {
      EventListModel.posts.length = 0;
    }

  }
})();
