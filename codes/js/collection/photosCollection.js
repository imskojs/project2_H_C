(function() {
    'use strict';

    angular.module('app')
        .factory('Photos', Photos);

    Photos.$inject = ['$resource', 'governorUrl', 'AuthService', '$cordovaFileTransfer'];

    function Photos($resource, governorUrl, AuthService, $cordovaFileTransfer) {

        var photosUrl = governorUrl + '/photo';

        var params = {};

        var actions = {
            removePhoto: {
                method: 'DELETE'
            }
        };

        var service = $resource(photosUrl, params, actions);

        service.uploadPhoto = function(parameters, post) {
            angular.extend(post, parameters);
            var filePath = post.file ? post.file : '[]';
            delete post.file;
            var options = {
                params: post,
                chunkedMode: false,
                headers: {
                    Connection: "close",
                    Authorization: 'Bearer ' + AuthService.getToken()
                }
            };
            console.log(post);
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/photo', filePath, options, true)
            };
        };

        return service;
    }

})();
