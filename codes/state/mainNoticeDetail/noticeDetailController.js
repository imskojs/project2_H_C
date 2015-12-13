(function() {
    'use strict';
    angular.module('app')
        .controller('NoticeDetailController', NoticeDetailController);

    NoticeDetailController.$inject = ['NoticeDetailModel', '$scope', 'Message', 'Places', '$stateParams', 'Posts'];

    function NoticeDetailController(NoticeDetailModel, $scope, Message, Places, $stateParams, Posts) {
        var NoticeDetail = this;
        NoticeDetail.Model = NoticeDetailModel;

        $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

        //------------------------
        //  IMPLEMENTATION
        //------------------------
        function onBeforeEnter() {
            getAPost();
        }

        //------------------------
        //  HELPER
        //------------------------
        function getAPost() {
            Message.loading();
            Posts.get({
                id: $stateParams.id,
                populates: 'photos'
            }).$promise
                .then(function success(postWrapper) {
                    console.log(postWrapper);
                    NoticeDetailModel.post = postWrapper.post;
                    Message.hide();

                }, function err(error) {
                    console.log(error);
                    Message.hide();
                    Message.alert('공지사항 알림', '없는 공지사항 입니다');
                });
        }
    }
})();
