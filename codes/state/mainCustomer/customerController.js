(function() {
    'use strict';
    angular.module('app')
        .controller('CustomerController', CustomerController);

    CustomerController.$inject = ['CustomerModel', 'Contacts', '$state', 'Message', 'appStorage'];

    function CustomerController(CustomerModel, Contacts, $state, Message, appStorage) {
        var Customer = this;
        Customer.Model = CustomerModel;

        Customer.formHandler = formHandler;

        //------------------------
        //  IMPLEMENTATION
        //------------------------
        function formHandler() {
            if (!appStorage.role) {
                return Message.alert('고객센터 알림', '로그인/회원가입을 하셔야 합니다.')
                    .then(function() {
                        $state.go('login');
                    });
            }
            Message.loading();
            Contacts.contactAdmin({},
                CustomerModel.form
            ).$promise
                .then(function success() {
                    CustomerModel.form = {};
                    Message.hide();
                    Message.alert('고객문의 알림', '고객문의가 성공적으로 접수 되었습니다. 가입하신 이메일로 연락 드리겠습니다.')
                        .then(function() {
                            $state.go('main.home.theme');
                        });
                }, function err() {
                    Message.hide();
                    Message.alert('고객묵의 알림', '제목과 내용은 필수 사항입니다.');

                });

        }
    }
})();
