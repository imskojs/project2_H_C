(function() {
    'use strict';

    angular.module('app')
        .factory('Users', Users);


    Users.$inject = ['$resource', 'governorUrl'];

    function Users($resource, governorUrl) {

        var userUrl = governorUrl + '/:auth' + '/:register' + '/:user' + '/:local' +
            '/:checkNickname' + '/:list' + '/:role' + '/:myrole';

        var params = {
            auth: '@auth',
            register: '@register',
            user: '@user',
            checkNickname: '@checkNickname',
            list: '@list',
            role: '@role'
        };

        var actions = {
            register: {
                method: 'POST',
                params: {
                    register: 'register'
                }
            },
            checkNickname: {
                method: 'GET',
                params: {
                    user: 'user',
                    checkNickname: 'checkNickname'
                }
            },
            login: {
                method: 'POST',
                params: {
                    auth: 'auth',
                    local: 'local'
                }
            },
            getMyRole: {
                method: 'GET',
                params: {
                    role: 'role',
                    myrole: 'myrole'
                }
            }
        };

        var service = $resource(userUrl, params, actions);

        return service;
    }
})();
