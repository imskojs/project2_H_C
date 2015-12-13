(function() {
  'use strict';
  angular.module('app')
    .filter('cloudinary400', cloudinaryFilter.bind(null, 400))
    .filter('cloudinary500', cloudinaryFilter.bind(null, 500));

  function cloudinaryFilter(size) {
    var matching = /upload/;
    return function(input) {
      if (input) {
        var index = input.search(matching);
        return input.substring(0, index) + 'upload/c_scale,w_' + size + '/' + input.substring(input.lastIndexOf('/'));
      } else
        return input;
    };
  }
})();
