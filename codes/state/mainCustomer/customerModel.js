(function() {
    'use strict';

    angular.module('app')
        .factory('CustomerModel', CustomerModel);



    function CustomerModel() {
        var model = {
            form: {
                email: null,
                phone: null,
                title: null,
                content: null
            }
        };
        return model;
    }
})();
