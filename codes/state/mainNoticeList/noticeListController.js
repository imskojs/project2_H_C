(function() {
    'use strict';
    angular.module('app')
        .controller('NoticeListController', NoticeListController);

    NoticeListController.$inject = ['NoticeListModel', 'Posts', '$state', '$scope', 'Message'];

    function NoticeListController(NoticeListModel, Posts, $state, $scope, Message) {

        var NoticeList = this;
        NoticeList.Model = NoticeListModel;

        NoticeList.getNewerPosts = getNewerPosts;
        NoticeList.getOlderPosts = getOlderPosts;
        NoticeList.checkForMore = checkForMore;

        $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

        //------------------------
        //  IMPLEMENTATION
        //------------------------
        // Check for newer stuff;
        function getNewerPosts() {
            var currentPosts = NoticeListModel.postsWrapper.posts;
            return Posts.getPosts({
                    category: 'NOTICE-POST',
                    limit: 10,
                    newerThan: currentPosts[0].id
                }).$promise
                .then(function success(data) {
                    console.log(data);
                    if (!data.posts.length) {
                        Message.alert(
                            '새로운포스트가 없습니다',
                            '나중에 다시 확인해주세요'
                        );
                    }
                    data.posts.forEach(function(post) {
                        currentPosts.unshift(post);
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                }, function err(error) {
                    console.log(error);
                    Message.alert();
                    $scope.$broadcast('scroll.refreshComplete');
                });
        }

        //  Check for older stuff
        function getOlderPosts() {
            var currentPosts = NoticeListModel.postsWrapper.posts;
            Posts.getPosts({
                category: 'NOTICE-POST',
                sort: 'id DESC',
                limit: 10,
                olderThan: currentPosts[currentPosts.length - 1].id
            }).$promise
                .then(function success(data) {
                    data.posts.forEach(function(post) {
                        currentPosts.push(post);
                    });
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    NoticeListModel.postsWrapper.more = data.more;
                }, function err(error) {
                    console.log(error);
                    Message.alert();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }

        function onBeforeEnter() {
            if (NoticeListModel.postsWrapper.posts.length < 10) {
                Message.loading();
                return Posts.getPosts({
                        category: 'NOTICE-POST',
                        sort: 'id DESC',
                        limit: 10
                        // , eager: true
                    }).$promise
                    .then(function success(data) {
                        console.log(data);
                        NoticeListModel.postsWrapper = data;
                        Message.hide();
                    }, function err(error) {
                        console.log(error);
                        Message.alert();
                        Message.hide();
                    });
            }
        }
        // Check if there is more data if none infinite-scroll is disabled.;
        function checkForMore() {
            return NoticeListModel.postsWrapper.more;
        }

    }
})();
