// Fixes the case where parent veritcal scrolling is disabled on ion-scroll
// element.

// Usage
// ion-scroll[direction="x" scroll-parent]
(function() {
    'use strict';

    angular.module('app')
        .directive('parentScroll', parentScroll);

    parentScroll.$inject = ['$ionicScrollDelegate', '$timeout', '$window'];

    function parentScroll($ionicScrollDelegate, $timeout, $window) {
        return {
            scope: true,
            restrict: 'A',
            compile: compile
        };

        function compile(element, attr) {

            if (!$window.horizontalIonScrollCount) {
                $window.horizontalIonScrollCount = 0;
            }

            $window.horizontalIonScrollCount++;
            attr.delegateHandle = "horizontal" + $window.horizontalIonScrollCount;

            return function(scope, element, attr) {
                $timeout(function() {
                    var horizontal = attr.delegateHandle;
                    var sv = $ionicScrollDelegate.$getByHandle(horizontal).getScrollView();

                    var container = sv.__container;

                    var originaltouchStart = sv.touchStart;
                    var originalmouseDown = sv.mouseDown;
                    var originaltouchMove = sv.touchMove;
                    var originalmouseMove = sv.mouseMove;

                    container.removeEventListener('touchstart', sv.touchStart);
                    container.removeEventListener('mousedown', sv.mouseDown);
                    $window.document.removeEventListener('touchmove', sv.touchMove);
                    $window.document.removeEventListener('mousemove', sv.mousemove);


                    sv.touchStart = function(e) {
                        e.preventDefault = function() {};
                        originaltouchStart.apply(sv, [e]);
                    };

                    sv.touchMove = function(e) {
                        e.preventDefault = function() {};
                        originaltouchMove.apply(sv, [e]);
                    };

                    sv.mouseDown = function(e) {
                        e.preventDefault = function() {};

                        if (originalmouseDown) {
                            originalmouseDown.apply(sv, [e]);
                        }

                    };


                    sv.mouseMove = function(e) {
                        e.preventDefault = function() {};

                        if (originalmouseMove) {
                            originalmouseMove.apply(sv, [e]);
                        }

                    };

                    container.addEventListener("touchstart", sv.touchStart, false);
                    container.addEventListener("mousedown", sv.mouseDown, false);
                    $window.document.addEventListener("touchmove", sv.touchMove, false);
                    $window.document.addEventListener("mousemove", sv.mouseMove, false);
                });

            };
        }
    }
})();
