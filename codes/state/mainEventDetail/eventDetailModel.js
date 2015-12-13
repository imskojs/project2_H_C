(function() {
    'use strict';

    angular.module('app')
        .factory('EventDetailModel', EventDetailModel);

    EventDetailModel.$inject = [];

    function EventDetailModel() {

        var model = {
            post: {},
            form: {
                title: '',
                content: '',
                name: '',
                contact: ''
            }
        };
        return model;
    }
})();
