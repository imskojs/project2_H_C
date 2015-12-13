(function() {
  'use strict';

  angular.module('app')
    .controller('AssociationController', AssociationController);

  AssociationController = ['AssociationModel', '$state', 'Contacts', 'Message', 'appStorage'];

  function AssociationController(AssociationModel, $state, Contacts, Message, appStorage) {

    var Association = this;
    Association.Model = AssociationModel;

    Association.formHandler = formHandler;

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    function formHandler() {
      if (!appStorage.role) {
        return Message.alert('제휴문의 알림', '로그인/회원가입을 하셔야 합니다.')
          .then(function() {
            $state.go('login');
          });
      }
      Message.loading();
      Contacts.contactAdmin({},
        formatForm(AssociationModel.form)
      ).$promise
        .then(function success() {
          AssociationModel.form = {};
          Message.hide();
          Message.alert('제휴문의 알림', '제휴문의가 성공적으로 접수 되었습니다. 가입하신 이메일로 연락 드리겠습니다.')
            .then(function() {
              $state.go('main.home.theme');
            });
        }, function err() {
          Message.hide();
          Message.alert('제휴문의 알림', '제목과 내용은 필수 사항입니다.');

        });

    }

    //------------------------
    //  HELPER
    //------------------------
    function formatForm(form) {
      var result = {};
      result.title = form.title;
      result.content = '<br>' + '업체명: ' + form.placeName + '<br>' +
        '전화번호: ' + form.phone + '<br>' +
        '지역: ' + form.location + '<br>' +
        '제목: ' + form.title + '<br>' +
        '내용: ' + form.content + '<br>';
      return result;
    }
  }
})();
