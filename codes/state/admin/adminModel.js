(function() {
    'use strict';

    angular.module('app')
        .factory('AdminModel', AdminModel);

    AdminModel.$inject = [];

    function AdminModel() {

        var model = {
            place: {},
            form: {
                male: '',
                female: '',
                popularFood: [{
                    name: null,
                    percentage: null
                }, {
                    name: null,
                    percentage: null
                }, {
                    name: null,
                    percentage: null
                }],
                popularDrink: [{
                    name: null,
                    percentage: null
                }, {
                    name: null,
                    percentage: null
                }, {
                    name: null,
                    percentage: null
                }]
            }
        };
        return model;
    }
})();
