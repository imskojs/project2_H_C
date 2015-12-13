(function() {
    'use strict';

    angular.module('app')
        .factory('Likes', Likes);

    Likes.$inject = ['$resource', 'governorUrl'];

    function Likes($resource, governorUrl) {

        var likesUrl = governorUrl + '/post' + '/:like' + '/:unlike';

        var params = {
            like: '@like',
            unlike: '@unlike'
        };
        var actions = {
            likePost: {
                method: 'POST'
            },
            unlikePost: {
                method: 'DELETE'
            }
        };

        var service = $resource(likesUrl, params, actions);

        return service;
    }

})();
