(function() {
    'use strict';
    angular.module('app')
        .controller('EventRegisterController', EventRegisterController);

    EventRegisterController.$inject = ['EventRegisterModel'];

    function EventRegisterController(EventRegisterModel) {

        var EventRegister = this;
        EventRegister.Model = EventRegisterModel;


        //------------------------
        //  IMPLEMENTATIONS
        //------------------------
    }
})();
