(function() {
    'use strict';

    angular.module('app')
        .factory('EventListModel', EventListModel);

    // EventListModel.$inject = [];

    function EventListModel() {

        var model = {
            posts: []
        };
        return model;
    }
})();
