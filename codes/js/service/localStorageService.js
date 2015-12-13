(function() {
    'use strict';
    angular.module('app')
        .factory('LocalService', function() {
            return {
                get: function(key) {
                    return localStorage.getItem(key);
                },
                set: function(key, val) {
                    return localStorage.setItem(key, val);
                },
                unset: function(key) {
                    return localStorage.removeItem(key);
                },
                getSession: function(key) {
                    return sessionStorage.getItem(key);
                },
                setSession: function(key, val) {
                    return sessionStorage.setItem(key, val);
                },
                unsetSession: function(key) {
                    return sessionStorage.removeItem(key);
                }
            }
        });


})();
