(function() {
    'use strict';

    angular.module('app')
        .factory('Comments', Comments);

    Comments.$inject = ['$resource', 'governorUrl'];

    function Comments($resource, governorUrl) {

        var commentUrl = governorUrl + '/post/comment';

        var params = {};

        var actions = {
            addCommentToPost: {
                method: 'POST'
            }
        };

        var service = $resource(commentUrl, params, actions);

        return service;
    }

})();
