(function() {
    'use strict';

    angular.module('app')
        .factory('Places', Places);

    Places.$inject = ['$resource', 'governorUrl', '$cordovaFileTransfer'];

    function Places($resource, governorUrl, $cordovaFileTransfer) {

        var placeUrl = governorUrl + '/place' + '/:list' + '/:mine' +
            '/:within' + '/:image' + ':photos';

        var params = {
            list: '@list',
            mine: '@mine',
            within: '@within',
            image: '@image',
            photos: '@photos'
        };

        var actions = {
            getPlaces: {
                method: 'GET',
                params: {
                    list: 'list'
                }
            },
            getMyPlaces: {
                method: 'GET',
                params: {
                    list: 'list',
                    mine: 'mine'
                }
            },
            getPlacesWithin: {
                method: 'GET',
                params: {
                    list: 'list',
                    within: 'within'
                }
            },
            getPlacePhotos: {
                method: 'GET',
                params: {
                    photos: 'photos'
                },
                isArray: true
            },
            findById: {
                method: 'GET'
            },
            createPlace: {
                method: 'POST'
            },
            createPlaceWithImage: {
                method: 'POST',
                params: {
                    image: 'image'
                }
            },
            updatePlace: {
                method: 'PUT',
                isArray: true

            },
            updateMyPlace: {
                method: 'PUT',
                params: {
                    mine: 'mine'
                },
                isArray: true
            },
            updatePlaceWithImage: {
                method: 'PUT',
                params: {
                    image: 'image'
                }
            },
            removePlace: {
                method: 'DELETE'
            }
        };

        var service = $resource(placeUrl, params, actions);

        //------------------------
        //  CUSTOM NON-HTTP METHODS
        //------------------------
        service.createPlaceWithImage = function(parameters, place) {
            angular.extend(place, parameters);
            var filePath = place.file;
            delete place.file;
            var options = {
                params: place,
                chunkedMode: false
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/place/image', filePath, options)
            };
        };

        service.updatePlaceWithImage = function(parameters, place) {
            angular.extend(place, parameters);
            var filePath = place.file;
            delete place.file;
            var options = {
                params: place,
                chunkedMode: false,
                httpMethod: 'PUT'
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/place/image', filePath, options)
            };

        };
        return service;
    }

})();
