(function() {
    'use strict';
    angular.module('app')
        .factory('PlaceSearchModel', PlaceSearchModel);

    function PlaceSearchModel() {
        var model = {
            places: [
                // {
                //     name: 'Hungers Bar',
                //     description: '',
                //     address: '서울특별시 마포구 서교동 342-2 2층',
                //     location: {
                //         type: 'Point',
                //         coordinates: [133, 11]
                //     },
                //     tags: ['헌팅최적화', '수제햄버거', '수제맥주', '다이닝펍'],
                //     photos: [{
                //         url: 'http://placehold.it/500x300'
                //     }]
                // }, {
                //     name: 'Magpie Brewing',
                //     description: '',
                //     address: '서울특별시 마포구 서교동 342-2 2층',
                //     location: {
                //         type: 'Point',
                //         coordinates: [133, 11]
                //     },
                //     tags: ['헌팅최적화', '수제햄버거', '수제맥주', '희귀맥주'],
                //     photos: [{
                //         url: 'http://placehold.it/500x300'
                //     }]

                // }, {
                //     name: 'I AM A HERO',
                //     description: '',
                //     address: '서울특별시 마포구 서교동 342-2 2층',
                //     location: {
                //         type: 'Point',
                //         coordinates: [133, 11]
                //     },
                //     tags: ['헌팅최적화', '수제햄버거', '수제맥주', '소맥'],
                //     photos: [{
                //         url: 'http://placehold.it/500x300'
                //     }]
                // }
            ],
            more: false
        };

        return model;
    }
})();
