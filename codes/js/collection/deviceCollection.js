// TODO: remove pushservice and implement own device/push logic
(function() {
    'use strict';

    angular.module('app')
        .factory('Devices', Devices);

    Devices.$inject = ['$resource', 'governorUrl', 'PushService'];

    function Devices($resource, governorUrl, PushService) {

        var deviceUrl = governorUrl + '/device' + '/:sendMessageAll';

        var params = {
            sendMessageAll: '@sendMessageAll'
        };

        var actions = {
            pushAll: {
                method: 'GET',
                params: {
                    sendMessageAll: 'sendMessageAll'
                }
            },

            register: {
                method: 'POST',
            },

            update: {
                method: 'PUT'
            }
        };

        var service = $resource(deviceUrl, params, actions);

        service.getDeviceIdSync = function() {
            var deviceId = PushService.getDeviceId();
            return deviceId;
        };

        return service;
    }
})();
