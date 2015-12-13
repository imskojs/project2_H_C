(function() {
  'use strict';
  angular.module('app')
    .factory('PlaceModel', PlaceModel);

  function PlaceModel() {

    var model = {
      from: {
        theme: {
          category: [{
            name: '헌팅',
            summary: '실시간 남녀성비가 제공되는 가장 Hot 한 헌팅 주점',
            params: {
              from: 'hunting',
              category: 'theme'
            },
            vw: 18.6
          }, {
            name: '데이트',
            summary: '연인 혹은 썸남썸녀를 위한 낭만적이고 로맨틱한 분위기의 주점',
            params: {
              from: 'romance',
              category: 'theme'
            },
            vw: 18.6
          }, {
            name: '친구',
            summary: '편안한 사람들과 부담 없이 한잔할 수 있는 주점',
            params: {
              from: 'friends',
              category: 'theme'
            },
            vw: 18.6
          }, {
            name: '이색',
            summary: '취향저격! 특별하고 유쾌한 이색 주점',
            params: {
              from: 'unique',
              category: 'theme'
            },
            vw: 18.6
          }, {
            name: '안주',
            summary: '특별한 안주와 곁들이면 맛과 분위기가 배가 되는 다이닝 주점',
            params: {
              from: 'dishes',
              category: 'theme'
            },
            vw: 18.6
          }, {
            name: '감성',
            summary: '추억을 자극하는 복고풍 분위기의 주점',
            params: {
              from: 'eighties',
              category: 'theme'
            },
            vw: 18.6
          }]
        },
        type: {
          category: [{
            name: '호프/포차',
            summary: '젊은 감성의 아지트, 한국식 소주 호프 & 포차',
            params: {
              from: 'pocha',
              category: 'type'
            },
            vw: 27
          }, {
            name: 'PUB',
            summary: '이국적인 분위기에서 다양한 주류 및 안주를 즐길 수 있는 서양식 주점',
            params: {
              from: 'pub',
              category: 'type'
            },
            vw: 18.6
          }, {
            name: '이자카야',
            summary: '맛, 술, 분위기 삼위일체의 정통 일본식 선술집',
            params: {
              from: 'izakaya',
              category: 'type'
            },
            vw: 25
          }, {
            name: 'BAR',
            summary: '특별한 데이트 혹은 친구들과의 특별한 만남을 위한 주점',
            params: {
              from: 'lounge',
              category: 'type'
            },
            vw: 18.6
          }, {
            name: '맥주',
            summary: '늦은 저녁 힘든 일과를 마치고 가볍게 한잔할 수 있는 맥주 전문점',
            params: {
              from: 'beer',
              category: 'type'
            },
            vw: 18.6
          }, {
            name: '민속/퓨전',
            summary: '비오는 날 생각나는 파전 & 막걸리 또는 특색 있는 안주의 향연이 있는 민속 & 퓨전 주점',
            params: {
              from: 'fusion',
              category: 'type'
            },
            vw: 25
          }]
        },
        location: {
          category: [{
            name: '홍대입구',
            summary: '',
            params: {
              from: 'hongdea',
              category: 'north'
            },
            vw: 25
          }, {
            name: '이태원',
            summary: '',
            params: {
              from: 'etehwon',
              category: 'north'
            },
            vw: 22
          }, {
            name: '건대입구',
            summary: '',
            params: {
              from: 'gundeaentrance',
              category: 'north'
            },
            vw: 25
          }, {
            name: '경리단길',
            summary: '',
            params: {
              from: 'gyungridangil',
              category: 'north'
            },
            vw: 25
          }, {
            name: '강남',
            summary: '',
            params: {
              from: 'gangnam',
              category: 'south'
            },
            vw: 18.6
          }, {
            name: '신논현',
            summary: '',
            params: {
              from: 'sinnonhyun',
              category: 'south'
            },
            vw: 22
          }, {
            name: '가로수길',
            summary: '',
            params: {
              from: 'garohsoogil',
              category: 'south'
            },
            vw: 25
          }, {
            name: '신림',
            summary: '',
            params: {
              from: 'shinrim',
              category: 'south'
            },
            vw: 18.6
          }]
        }

      },
      currentCategory: [],
      currentItem: {}
    };

    return model;
  }
})();
