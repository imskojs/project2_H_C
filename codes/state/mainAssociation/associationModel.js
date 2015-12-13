(function() {
    'use strict';

    angular.module('app')
        .factory('AssociationModel', AssociationModel);

    function AssociationModel() {

        var model = {
            form: {
                placeName: null,
                phone: null,
                location: null,
                title: null,
                content: null
            }
        };
        return model;
    }
})();
