// Input
// vm.openingHours = [{start: "07:00", end: "20:20"}, ..., {start: "08:00", end: "18:00"} ]

// Usage
// div{vm.openingHours | groupByOpeningHours}

// Output
// ["월~목 07:00 ~ 20:20", "금~토 08:00 ~ 16:00", "일요일 휴무"]

(function() {
  'use strict';

  angular.module('app')
    .filter('groupByOpeningHours', groupByOpeningHours);

  groupByOpeningHours.$inject = ['_'];

  function groupByOpeningHours(_) {
    return filter;

    function filter(openingHours) {
      // append index to object
      openingHours = appendIndexToObj(openingHours);
      // group by same hours
      var grouped = groupByBusinessHours(openingHours);
      // create [{days: [0, 1], start: "08:00", end: "20:00"},...}
      var orderedResultArray = createArrayOfObjWithGroup(grouped);
      // create ["월 ~ 금" 08:00 ~ 03:00", "일요일 휴무"]
      var textArray = _.map(orderedResultArray, function(result) {
        // result = {days:[0,1], start: '', end: ''};
        result.days = _.map(result.days, function(day) {
          var daysKorean = parseDay(day);
          return daysKorean;
        });
        result.days = tildeArrayValuesToText(result.days);
        var apendTime = '';
        if (result.start === result.end) {
          apendTime = '휴무';
        } else {
          apendTime = result.start + ' ~ ' + result.end;
        }
        var texts = result.days + ' ' + apendTime;
        return texts;
      });

      return textArray;
    }


    function appendIndexToObj(openingHours) {
      for (var i = 0; i < openingHours.length; i++) {
        openingHours[i].index = i;
      }
      return openingHours;
    }

    function groupByBusinessHours(openingHours) {
      var grouped = _.groupBy(openingHours, function(hoursObj) {
        var start = hoursObj.start;
        var end = hoursObj.end;
        var groupCategory = start + end;
        return groupCategory;
      });
      return grouped;
    }

    function createArrayOfObjWithGroup(grouped) {
      // grouped = ['1212': [{start:'', end:'', index: 0}, ...]]
      // out = [{days:[0,1], start:'',  end:''}, ...]
      var keys = Object.keys(grouped);

      var resultArray = [];
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var subOpeningHoursArray = grouped[key];

        var daysResult = [];
        for (var j = 0; j < subOpeningHoursArray.length; j++) {
          var openingHourObj = subOpeningHoursArray[j];
          daysResult.push(openingHourObj.index);
        }

        var start = subOpeningHoursArray[0].start;
        var end = subOpeningHoursArray[0].end;

        resultArray.push({
          days: daysResult,
          start: start,
          end: end
        });
      }

      var orderedResultArray = _.sortBy(resultArray, function(obj) {
        var day = obj.days[0];
        if (day === 0) {
          day = 7;
        }
        return day;
      });

      return orderedResultArray;
    }

    function parseDay(day) {
      if (day === 0) {
        return '일';
      } else if (day === 1) {
        return '월';
      } else if (day === 2) {
        return '화';
      } else if (day === 3) {
        return '수';
      } else if (day === 4) {
        return '목';
      } else if (day === 5) {
        return '금';
      } else if (day === 6) {
        return '토';
      }
    }

    function tildeArrayValuesToText(array) {
      var daysInNumbers = _.map(array, function(dayInKorean) {
        if (dayInKorean === '일') {
          return 7;
        } else if (dayInKorean === '월') {
          return 1;
        } else if (dayInKorean === '화') {
          return 2;
        } else if (dayInKorean === '수') {
          return 3;
        } else if (dayInKorean === '목') {
          return 4;
        } else if (dayInKorean === '금') {
          return 5;
        } else if (dayInKorean === '토') {
          return 6;
        }
      });
      for (var i = 0; i < daysInNumbers.length - 1; i++) {
        var day_1 = daysInNumbers[i];
        var day_2 = daysInNumbers[i + 1];
        if (Math.abs(day_1 - day_2) > 1) {
          var concatStart = array[0];
          for (var j = 1; j < daysInNumbers.length; j++) {
            concatStart = concatStart + ', ' + array[j];
          }
          return concatStart;
        }
      }
      if (array.length > 2) {
        return array[0] + ' ~ ' + array[array.length - 1];
      } else if (array.length === 2) {
        return array[0] + ', ' + array[1];
      } else if (array.length === 1) {
        return array[0];
      }
    }
  }

})();
