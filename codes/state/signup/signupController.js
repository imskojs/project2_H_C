(function() {
  'use strict';
  angular.module('app')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['SignupModel', 'Users', '$scope', '$state', 'Message', '$timeout'];

  function SignupController(SignupModel, Users, $scope, $state, Message, $timeout) {
    var Signup = this;
    Signup.Model = SignupModel;

    Signup.setSex = setSex;
    Signup.checkDuplicateNickname = checkDuplicateNickname;
    Signup.registerationHandler = registerationHandler;
    SignupModel.form.birthYear = null;

    $scope.$on('$ionicView.enter', onAfterEnter);
    $scope.$on('$ionicView.leave', onAfterEnter);

    //------------------------
    //  IMPLEMENTATION
    //------------------------
    function setSex(sex) {
      Signup.Model.form.sex = sex;
    }

    function checkDuplicateNickname(nickname) {
      Message.loading();
      Users.checkNickname({
        nickname: nickname
      }).$promise
        .then(function success(data) {
          Message.hide();
          if (data.isAvailable) {
            Message.alert('닉네임 알림', '사용가능한 닉네임 입니다');
            SignupModel.nickNameChecked = true;
          } else {
            Message.alert('닉네임 알림', '이미 사용중인 닉네임입니다, 다른 닉네임을 써주세요.');
            SignupModel.form.nickname = null;
            SignupModel.nickNameChecked = false;
          }

        }, function err(error) {
          console.log('---------- error ----------');
          console.log(error);
          console.log('HAS TYPE: ' + typeof error);
          console.log('---------- CONSOLE END -------------------');
          Message.hide();
        });
    }

    function registerationHandler() {
      // if (SignupModel.nickNameChecked === false) {
      //     return Message.alert('니네임 알림', '닉네임 중복을 확인해주세요');
      // }
      if (SignupModel.form.password !== SignupModel.form.passwordConfirm) {
        return Message.alert('비밀번호 알림', '비밀번호를 다시 한번 확인해주시고 입력해주세요');
      }
      Users.register({}, SignupModel.form).$promise
        .then(function success(data) {
          console.log('---------- data ----------');
          console.log(data);
          console.log('HAS TYPE: ' + typeof data);
          console.log('---------- CONSOLE END -------------------');
          angular.copy({
            birthYear: null
          }, SignupModel.form);
          Message.alert('회원가입 성공', '회원가입을 성공하였습니다.')
            .then(function(res) {
              console.log('---------- res ----------');
              console.log(res);
              console.log('HAS TYPE: ' + typeof res);
              console.log('---------- CONSOLE END -------------------');

              $state.go('login');
            });
          // SignupModel.form = {};

        }, function err(error) {
          console.log('---------- error ----------');
          console.log(error);
          console.log('HAS TYPE: ' + typeof error);
          console.log('---------- CONSOLE END -------------------');
          Message.hide();

          // var invalidAttributes = error.data.message.invalidAttributes;
          // if (invalidAttributes && invalidAttributes.nickname) {
          //     Message.alert('닉네임 알림', '닉네임이 짧습니다.');
          //     SignupModel.nickNameChecked = false;
          // } else {
          Message.alert('가입실패', '다시 입력해주세요');
          // }
        });
      // $state.go('main.home.theme');
    }

    function onAfterEnter() {
      $timeout(function() {
        angular.copy({
          email: null,
          nickname: null,
          password: null,
          passwordConfirm: null,
          birthYear: null,
          sex: null
        }, SignupModel.form);
        SignupModel.form.birthYear = null;
      }, 0);
    }
  }
})();
