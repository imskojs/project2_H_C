(function() {
    'use strict';
    angular.module('app')
        .factory('NoticeDetailModel', NoticeDetailModel);

    function NoticeDetailModel() {
        var model = {
            currentPlace: {
                title: '헝거스 소비자 약관 변경 안내',
                createdAt: new Date()
            }
        };

        return model;
    }
})();
