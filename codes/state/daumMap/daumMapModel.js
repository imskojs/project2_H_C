(function() {
    'use strict';
    angular.module('app')
        .factory('DaumMapModel', DaumMapModel);

    function DaumMapModel() {
        var model = {
            // need to specify category for search
            category: 'NAIL-PLACE', // only one category hence fixed
            currentPosition: {
                latitude: 'FLOAT',
                longitude: 'FLOAT'
            },
            markers: [],
            places: [],
            selectedPlace: {
                // response.places[n] selected from DaumMapDirective
            },
            modal: {
                //Defined in DaumMapController
            },
            findMeThenSearchNearBy: function(justFindDontDraw) {
                //Defined in DaumMapDirective
                console.log(justFindDontDraw + 'is a boolean to use outside map view');
            },
            searchLocationNearBy: function() {
                //Defined in DaumMapDirective
            },
        };

        return model;
    }
})();
