(function() {
    'use strict';
    angular.module('app')
        .factory('Posts', Posts);

    Posts.$inject = ['$resource', 'governorUrl', '$cordovaFileTransfer', 'AuthService'];

    function Posts($resource, governorUrl, $cordovaFileTransfer, AuthService) {

        var postUrl = governorUrl + '/post' + '/:list' +
            '/:image' + '/:mine' + '/:like';

        var params = {
            list: '@list',
            image: '@image',
            mine: '@mine',
            like: '@like'
        };

        var actions = {
            getPosts: {
                method: 'GET',
                params: {
                    list: 'list'
                }
            },
            getMyPosts: {
                method: 'GET',
                params: {
                    list: 'list',
                    mine: 'mine'
                }
            },
            findById: {
                method: 'GET'
            },
            createPost: {
                method: 'POST'
            },
            updatePost: {
                method: 'PUT'
            },
            likePost: {
                method: 'POST',
                params: {
                    like: 'like'
                }
            },
            removePost: {
                method: 'DELETE'
            }
        };

        var service = $resource(postUrl, params, actions);

        //------------------------
        //  CUSTOM NON-HTTP METHODS
        //------------------------
        service.createPostWithImage = function(parameters, post) {
            angular.extend(post, parameters);
            var filePath = post.file ? post.file : '[]';
            delete post.file;
            post.category = "SHOW-POST";
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
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/post', filePath, options, true)
            };
        };

        service.updatePostWithImage = function(parameters, post) {
            angular.extend(post, parameters);
            var filePath = post.file;
            delete post.file;
            var options = {
                params: post,
                chunkedMode: false,
                httpMethod: 'PUT',
                headers: {
                    Connection: "close",
                    Authorization: 'Bearer ' + AuthService.getToken()
                }
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/post', filePath, options, true)
            };

        };

        return service;
    }

    // Post.get({
    //     list: 'list',
    //     category: 'SHOW-POST'
    // }).$promise
    //     .then(function success() {}, function err() {})

    // Posts.createPostWithImage({}, postWithFile).$promise
    //     .then(function success() {}, function error() {}, function progress(progress) {})

    // require id in postWithFile sails' req.param('id') not only look at url params but
    //also looks at the body of req, it is a sails spcific feature.
    // Posts.createPostWithImage({}, postWithFile).$promise
    //     .then(function success() {}, function error() {}, function progress(progress) {})


})();
