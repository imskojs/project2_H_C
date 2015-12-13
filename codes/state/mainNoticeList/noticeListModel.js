(function() {
    'use strict';
    angular.module('app')
        .factory('NoticeListModel', NoticeListModel);

    function NoticeListModel() {
        var model = {
            postsWrapper: {
                posts: [{
                    title: '헝거스 약관변경안내',
                    content: '',
                    createdAt: new Date(),
                    category: '',
                    comments: [],
                    photos: [{
                        url: ''
                    }]
                }],
                more: false
            }
        };
        return model;
    }
})();
