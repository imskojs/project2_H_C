(function() {
  'use strict';
  angular.module('app')
    .factory('Logs', Logs);

  Logs.$inject = ['$resource', 'governorUrl'];

  function Logs($resource, governorUrl) {

    var postUrl = governorUrl + '/log';

    var params = {
      log: '@log'
    };

    var actions = {
      log: {
        method: 'POST',
        params: {
          log: 'log'
        }
      }
    };

    var service = $resource(postUrl, params, actions);
    return service;
  }

})();
