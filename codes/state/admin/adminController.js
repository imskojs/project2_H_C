(function() {
  'use strict';
  angular.module('app')
    .controller('AdminController', AdminController);

  AdminController.$inject = ['AdminModel', 'Places', '$scope', 'Message', 'appStorage', '$state'];

  function AdminController(AdminModel, Places, $scope, Message, appStorage, $state) {

    var Admin = this;
    Admin.Model = AdminModel;
    Admin.updateTableSexPercentage = updateTableSexPercentage;
    Admin.updatePopularMenu = updatePopularMenu;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------

    function onBeforeEnter() {
      Message.loading();
      Places.getMyPlaces({
        id: appStorage.user.id
      }).$promise
        .then(function success(placesWrapper) {
          console.log('---------- placesWrapper ----------');
          console.log(placesWrapper);
          console.log('HAS TYPE: ' + typeof placesWrapper);
          console.log('---------- CONSOLE END -------------------');

          AdminModel.place = placesWrapper.places[0];
          Message.hide();
        }, function err(error) {
          console.log(error);
          Message.hide();
          Message.alert('관리자 알림', '현재가지고 있으신 바가 없습니다.');
        });
    }

    function updateTableSexPercentage() {
      Places.updateMyPlace({
        id: AdminModel.place.id
      }, {
        male: AdminModel.form.male,
        female: AdminModel.form.female
      }).$promise
        .then(function success(data) {
          Message.hide();
          AdminModel.form.male = '';
          AdminModel.form.female = '';
          Message.alert('실시간정보 알림', '테이블 현황이 업데이트 되었습니다.');
          console.log('---------- data ----------');
          console.log(data);
          console.log('HAS TYPE: ' + typeof data);
          console.log('---------- CONSOLE END -------------------');

        }, function err(error) {
          Message.hide();
          Message.alert();
          console.log('---------- error ----------');
          console.log(error);
          console.log('HAS TYPE: ' + typeof error);
          console.log('---------- CONSOLE END -------------------');

        });

    }

    function updatePopularMenu() {
      Places.updateMyPlace({
        id: AdminModel.place.id
      }, {
        popularFood: AdminModel.form.popularFood,
        popularDrink: AdminModel.form.popularDrink
      }).$promise
        .then(function success(data) {
          Message.hide();
          Message.alert('실시간정보 알림', '인기 안주와 인기 주류가 업데이트 되었습니다.')
            .then(function() {
              $state.go('main.home.theme');
            });
          // AdminModel.form.popularFood = [{
          //     name: '',
          //     percentage: ''
          // }, {
          //     name: '',
          //     percentage: ''
          // }, {
          //     name: '',
          //     percentage: ''
          // }];
          // AdminModel.form.popularDrink = [{
          //     name: '',
          //     percentage: ''
          // }, {
          //     name: '',
          //     percentage: ''
          // }, {
          //     name: '',
          //     percentage: ''
          // }];
          console.log('---------- data ----------');
          console.log(data);
          console.log('HAS TYPE: ' + typeof data);
          console.log('---------- CONSOLE END -------------------');

        }, function err(error) {
          Message.hide();
          Message.alert();
          console.log('---------- error ----------');
          console.log(error);
          console.log('HAS TYPE: ' + typeof error);
          console.log('---------- CONSOLE END -------------------');

        });


    }
  }
})();
