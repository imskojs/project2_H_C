(function() {
  'use strict';
  angular.module('app')
    .factory('SignupModel', SignupModel);

  SignupModel.$inject = ['_', 'moment'];

  function SignupModel(_, moment) {

    var currentYear = moment().year();

    var years = _.range(currentYear - 90, currentYear + 1 - 18, 1);
    years = angular.forEach(years, function(year) {
      return String(year);
    });

    var model = {
      years: years,
      form: {
        email: null,
        nickname: null,
        password: null,
        passwordConfirm: null,
        birthYear: null,
        sex: null
      },
      nickNameChecked: false
    };

    return model;
  }
})();
