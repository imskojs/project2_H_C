(function() {
  'use strict';
  angular.module('app')
    .factory('DetailModel', DetailModel);


  function DetailModel() {

    var model = {
      current: {
        photos: [],
        name: '',
        address: '',
        openingHours: [],
        table: 0,
        male: '',
        female: '',
        summary: '',
        tags: [],
        updatedAt: ''
      },
      posts: []
    };
    return model;
  }
})();
