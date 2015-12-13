//==========================================================================
//              Style for user selection.
//==========================================================================

(function() {
    'use strict';

    angular.module('app')
        .directive('touch', touch);

    touch.$inject = ['$timeout'];

    function touch($timeout) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element) {
            element.on('click', function() {
                element.addClass('touch');
                $timeout(function() {
                    element.removeClass('touch');
                }, 50);

            });
        }
    }

})();
