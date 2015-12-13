(function() {
    'use strict';

    angular.module('app')
        .factory('RoyaltyPoints', RoyaltyPoints);

    RoyaltyPoints.$inject = ['$resource', 'governorUrl'];

    function RoyaltyPoints($resource, governorUrl) {

        var royaltyUrl = governorUrl + '/royaltyPoint' + '/:list' + '/:mine';

        var params = {
            list: '@list',
            mine: '@mine'
        };

        var actions = {
            getRoyaltyPoints: {
                method: 'GET',
                params: {
                    list: 'list'
                }
            },

            getMyRoyaltyPoints: {
                method: 'GET',
                params: {
                    list: 'list',
                    mine: 'mine'
                }
            },

            findById: {
                method: 'GET'
            },

            createRoyaltyPoint: {
                method: 'POST',
            },

            updateRoyaltyPoint: {
                method: 'PUT',
                isArray: true
            },

            removeRoyaltyPoint: {
                method: 'DELETE'
            }
        };

        var service = $resource(royaltyUrl, params, actions);

        return service;
    }

})();
