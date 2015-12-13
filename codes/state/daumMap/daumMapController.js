(function() {
    'use strict';

    angular.module('app')
        .controller('DaumMapController', DaumMapController);

    DaumMapController.$inject = ['DaumMapModel', '$ionicModal', '$scope', '$state', '$stateParams', '$timeout'];

    function DaumMapController(DaumMapModel, $ionicModal, $scope, $state, $stateParams, $timeout) {

        var Map = this;
        Map.Model = DaumMapModel;

        Map.searchType = "address";



        Map.findMeThenSearchNearBy = DaumMapModel.findMeThenSearchNearBy;

        Map.searchLocationNearBy = function(value) {

            if (Map.searchType === 'address') {
                return DaumMapModel.searchLocationNearBy(value);
            } else if (Map.searchType === 'placeName') {
                return DaumMapModel.searchPlaceByName(value);
            }
        };

        Map.setPlaceholderText = function() {
            if (Map.searchType === 'address') {
                return '지역을 검색해주세요';
            } else if (Map.searchType === 'placeName') {
                return '상호명을 입력해주세요';
            }
        };

        Map.goToDetailHandler = function(state) {
            DaumMapModel.modal.hide();
            $state.go(state, {
                id: DaumMapModel.selectedPlace.id
            });
        };
        Map.goToHandler = function(state, params) {
            $state.go(state, params);
        };
        Map.hasStateParams = function(paramName) {
            return !!$stateParams[paramName];
        };


        // Make currently selected place from DaumMapDirective available at ModalView
        Map.selectedPlace = DaumMapModel.selectedPlace;

        $scope.$on('$ionicView.enter', function() {
            // Set Modal
            $ionicModal.fromTemplateUrl('state/daumMap/placeModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            })
                .then(function(modal) {
                    DaumMapModel.modal = modal;
                });
            DaumMapModel.domMap.relayout();
            if ($stateParams.id) {
                DaumMapModel.findPlaceByIdThenDrawAPlace($stateParams.id);
            }
        });
        $scope.$on('$ionicView.afterEnter', function() {
            $timeout(function() {
                DaumMapModel.domMap.relayout();
            }, 0);
        });

    }
})();
