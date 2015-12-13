(function() {
    'use strict';
    angular.module('app')
        .factory('Products', Products);

    Products.$inject = ['$resource', 'governorUrl', '$cordovaFileTransfer'];

    function Products($resource, governorUrl, $cordovaFileTransfer) {

        var productUrl = governorUrl + '/product' + '/:list' +
            '/:image' + '/:mine' + '/:checkProductCode';

        var params = {
            list: '@list',
            image: '@image',
            mine: '@mine',
            checkProductCode: '@checkProductCode'
        };

        var actions = {
            getProducts: {
                method: 'GET',
                params: {
                    list: 'list'
                }
            },
            getMyProducts: {
                method: 'GET',
                params: {
                    list: 'list',
                    mine: 'mine'
                }
            },
            checkProductCode: {
                method: 'GET',
                params: {
                    checkProductCode: 'checkProductCode'
                }
            },
            findById: {
                method: 'GET'
            },
            createProduct: {
                method: 'POST'
            },
            updateProduct: {
                method: 'PUT'
            },
            removeProduct: {
                method: 'DELETE'
            }
        };

        var service = $resource(productUrl, params, actions);

        //------------------------
        //  CUSTOM NON-HTTP METHODS
        //------------------------
        service.createProductWithImage = function(parameters, product) {
            angular.extend(product, parameters);
            var filePath = product.file;
            delete product.file;
            var options = {
                params: product,
                chunkedMode: false
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/product/image', filePath, options)
            };
        };

        service.updateProductWithImage = function(parameters, product) {
            angular.extend(product, parameters);
            var filePath = product.file;
            delete product.file;
            var options = {
                params: product,
                chunkedMode: false,
                httpMethod: 'PUT'
            };
            return {
                '$promise': $cordovaFileTransfer.upload(governorUrl + '/product/image', filePath, options)
            };

        };

        return service;
    }
})();
