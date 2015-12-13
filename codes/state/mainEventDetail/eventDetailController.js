(function() {
    'use strict';
    angular.module('app')
        .controller('EventDetailController', EventDetailController);

    EventDetailController.$inject = ['EventDetailModel', 'Posts', 'Message', '$stateParams',
        '$scope', '$ionicModal', 'Contacts', 'appStorage', '$state'
    ];

    function EventDetailController(EventDetailModel, Posts, Message, $stateParams, $scope, $ionicModal, Contacts, appStorage, $state) {

        var EventDetail = this;
        EventDetail.Model = EventDetailModel;
        EventDetail.isSelected = false;
        EventDetail.showTerms = false;
        EventDetail.sendForm = sendForm;


        $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
        $scope.$on('$ionicView.afterEnter', onAfterEnter);
        //====================================================
        //  IMPLEMENTATION
        //====================================================
        function onBeforeEnter() {
            getAPost();
        }

        function onAfterEnter() {
            $ionicModal.fromTemplateUrl('state/mainEventDetail/eventRegisterModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
                .then(function(modal) {
                    EventDetail.modal = modal;
                });
        }

        function sendForm() {
            if (!appStorage.role) {
                return Message.alert('이벤트 응모 알림', '로그인/회원가입을 하셔야 합니다.')
                    .then(function() {
                        EventDetail.modal.hide();
                        $state.go('login');
                    });
            }
            if (!EventDetail.isSelected) {
                return Message.alert('이벤트 응모 알림', '약관에 동의 하여 주세요.');
            }
            EventDetailModel.form.content = EventDetailModel.post.summary;
            EventDetailModel.form.title = EventDetailModel.post.title;
            if (!EventDetailModel.form.name || !EventDetailModel.form.contact) {
                return Message.alert('이벤트 응모 알림', '이름과 연락처를 넣어주세요');
            }
            Message.loading();
            Contacts.contactAdmin({},
                EventDetailModel.form
            ).$promise
                .then(function success() {

                    EventDetailModel.form = {};
                    return Posts.likePost({
                        post: EventDetailModel.post.id
                    });

                }, function err() {

                    throw new Error('formFail');

                })
                .then(function success(postWrapper) {

                    if (postWrapper && postWrapper.posts[0]) {
                        EventDetailModel.post.likes = postWrapper.posts[0].likes;
                    }
                    Message.hide();
                    Message.alert('이벤트 응모 알림', '이벤트 응모가 성공적으로 접수되었습니다. 가입하신 이메일로 연락드리겠습니다.')
                        .then(function() {
                            EventDetail.modal.hide();
                        });

                }, function err(error) {

                    console.log(error);
                    Message.hide();
                    Message.alert('제휴문의 알림', '제목과 내용은 필수 사항입니다.');

                });

        }

        //====================================================
        //  HELPER
        //====================================================
        function getAPost() {
            Message.loading();
            Posts.findById({
                id: $stateParams.id,
                populates: 'photos'
            }).$promise
                .then(function success(postWrapper) {
                    console.log(postWrapper.post);
                    EventDetailModel.post = postWrapper.post;
                    Message.hide();
                    console.log('----------  ----------');
                    console.log(EventDetail.Model.post.photos[0]);
                    console.log('---------- CONSOLE END -------------------');

                }, function err(error) {
                    console.log(error);
                    Message.hide();
                    Message.alert('공지사항 알림', '없는 공지사항 입니다');
                });
        }
    }
})();
