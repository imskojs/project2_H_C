(function() {
    'use strict';
    angular.module('app')
        .controller('AdminMenuController', AdminMenuController);

    AdminMenuController.$inject = ['AdminMenuModel', 'Places', '$scope'];

    function AdminMenuController(AdminMenuModel, Places, $scope) {

        var AdminMenu = this;
        AdminMenu.Model = AdminMenuModel;

        $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

        //------------------------
        //  IMPLEMENTATIONS
        //------------------------

        function onBeforeEnter() {
            Places.getMyPlaces({}).$promise
                .then(function success(data) {
                    console.log('---------- data ----------');
                    console.log(data);
                    console.log('HAS TYPE: ' + typeof data);
                    console.log('---------- CONSOLE END -------------------');

                }, function err(error) {
                    console.log('---------- error ----------');
                    console.log(error);
                    console.log('HAS TYPE: ' + typeof error);
                    console.log('---------- CONSOLE END -------------------');
                });
        }
    }
})();
