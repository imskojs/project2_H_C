(function() {
    'use strict';
    angular.module('app')
        .controller('EventController', EventController);

    EventController.$inject = ['EventModel'];

    function EventController(EventModel) {

        var Event = this;
        Event.Model = EventModel;


        //------------------------
        //  IMPLEMENTATIONS
        //------------------------
    }
})();
