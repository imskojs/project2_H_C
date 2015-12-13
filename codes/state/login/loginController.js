(function() {
    'use strict';

    angular.module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['LoginModel', '$state', 'Users', 'Message', 'appStorage'];

    function LoginController(LoginModel, $state, Users, Message, appStorage) {

        var Login = this;
        Login.Model = LoginModel;

        Login.loginHandler = loginHandler;

        //------------------------
        //  IMPLEMENTATIONS
        //------------------------
        function loginHandler() {
            Message.loading();
            Users.login({}, {
                identifier: LoginModel.form.email,
                password: LoginModel.form.password
            }).$promise
                .then(function success(authData) {

                    appStorage.token = authData.token;
                    appStorage.user = authData.user;
                    return Users.getMyRole({}).$promise;

                }, function err(error) {

                    console.log(error);
                    Message.hide();
                    Message.alert('로그인 알림', '이메일이나 암호가 잘못 되었습니다.')
                        .then(function() {
                            LoginModel.form = {};
                        });
                    throw new Error('loginFail');

                })
                .then(function success(roleData) {

                    appStorage.role = roleData.name;
                    Message.hide();
                    $state.go('main.home.theme');

                }, function err(error) {

                    console.log(error);

                });
        }

        //------------------------
        //  HELPER
        //------------------------
    }

})();
