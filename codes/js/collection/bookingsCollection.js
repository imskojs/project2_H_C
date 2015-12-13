(function() {
    'use strict';

    angular.module('app')
        .factory('Bookings', Bookings);

    Bookings.$inject = ['$resource', 'governorUrl', '$cordovaFileTransfer'];

    function Bookings($resource, governorUrl, $cordovaFileTransfer) {

        var bookingUrl = governorUrl + '/booking' + '/:list' +
            '/:image' + '/:mine' + '/:dateBetween' + '/:request';

        var params = {
            list: '@list',
            image: '@image',
            mine: '@mine',
            dateBetween: '@dateBetween'
        };

        var actions = {
            getBookings: {
                method: 'GET',
                params: {
                    list: 'list'
                }
            },
            getMyBookings: {
                method: 'GET',
                params: {
                    list: 'list',
                    mine: 'mine'
                }
            },
            getBookingsDateBetween: {
                method: 'GET',
                params: {
                    dateBetween: 'dateBetween'
                }
            },

            findById: {
                method: 'GET'
            },

            createBooking: {
                method: 'POST'
            },

            requestBooking: {
                method: 'POST',
                params: {
                    request: 'request'
                }
            },
            updateBooking: {
                method: 'PUT',
                isArray: true,
                headers: {
                    'Content-Type': 'text/plain'
                }
            },
            removeBooking: {
                method: 'DELETE'
            }
        };

        var service = $resource(bookingUrl, params, actions);

        //------------------------
        //  CUSTOM NON-HTTP METHODS
        //------------------------
        service.createBookingWithImage = function(parameters, booking) {
            angular.extend(booking, parameters);
            var filePath = booking.file;
            delete booking.file;
            var options = {
                params: booking,
                chunkedMode: false
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/booking/image', filePath, options)
            };
        };

        service.updateBookingWithImage = function(parameters, booking) {
            angular.extend(booking, parameters);
            var filePath = booking.file;
            delete booking.file;
            var options = {
                params: booking,
                chunkedMode: false,
                httpMethod: 'PUT'
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/booking/image', filePath, options)
            };

        };

        return service;
    }

    // Booking.get({
    //     list: 'list',
    //     category: 'SHOW-POST'
    // }).$promise
    //     .then(function success() {}, function err() {})

    // Bookings.createBookingWithImage({}, bookingWithFile).$promise
    //     .then(function success() {}, function error() {}, function progress(progress) {})

    // require id in bookingWithFile sails' req.param('id') not only look at url params but
    //also looks at the body of req, it is a sails spcific feature.
    // Bookings.createBookingWithImage({}, bookingWithFile).$promise
    //     .then(function success() {}, function error() {}, function progress(progress) {})

})();
