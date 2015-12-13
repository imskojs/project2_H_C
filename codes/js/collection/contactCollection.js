// TODO: remove pushservice and implement own device/push logic
(function() {
    'use strict';

    angular.module('app')
        .factory('Contacts', Contacts);

    Contacts.$inject = ['$resource', 'governorUrl'];

    function Contacts($resource, governorUrl) {

        var deviceUrl = governorUrl + '/:contact' + '/:admin';

        var params = {
            'contact': '@contact',
            'admin': '@admin'
        };

        var actions = {
            contactAdmin: {
                method: 'POST',
                params: {
                    contact: 'contact',
                    admin: 'admin'
                }
            }
        };

        var service = $resource(deviceUrl, params, actions);

        return service;
    }
})();
