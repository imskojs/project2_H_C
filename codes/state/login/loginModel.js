(function() {
    'use strict';

    angular.module('app')
        .factory('LoginModel', LoginModel);

    function LoginModel() {

        var model = {
            form: {
                email: null,
                password: null
            }
        };
        return model;
    }

})();
