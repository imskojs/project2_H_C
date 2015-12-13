myApp
.directive('daumMap', [
'DaumMapModel', 'Places',
function (DaumMapModel, Places){
    return {
        scope: {
            markerSrc: '@',
            markerClickedSrc: '@',
            markerWidth: '@',
            markerHeight: '@',
        },
        link: function (scope, element, attr){
//==========================================================================
//              Global Map Property
//==========================================================================
            // Initiate map
            var DOM = element[0];
            var mapOptions = {
                center: new daum.maps.LatLng(37.5691469, 126.978647),
                level: 5,
                draggable: true
            };
            var map = new daum.maps.Map(DOM, mapOptions);
            // place service
            var ps = new daum.maps.services.Places();
            // Marker style properties.
            var markerSize = new daum.maps.Size(markerWidth, markerHeight);
            var markerImg = new daum.maps.MarkerImage(markerSrc, markerSize);
            var markerClickedImg = new daum.maps.MarkerImage(markerClickedSrc, markerSize);
//==========================================================================
//              HELPER FUNCTIONS
//==========================================================================
            // Calc nearby locations within a category function
            var calcNearBy = function (lat, lng, category) {
                var minLat = lat - .3;
                var maxLat = lat + .3;
                var minLng = lng - .6;
                var maxLng = lng + .6;
                var params = {
                    category: category,
                    minLat: minLat,
                    maxLat: maxLat,
                    minLng: minLng,
                    maxLng: maxLng
                };
                return params; 
            }; 
            // Draw Markers after query
            var drawMarkers = function (searchParams){
                // Reset previous markers; 
                angular.forEach(DaumMapModel.markers, function (marker, i, self){
                    marker.setMap(null); 
                    delete self[i]; 
                });
                // Get places
                Places.get(searchParams, function(response){
                    // Save and draw nearby places with category
                    angular.copy(response.places, DaumMapModel.places);
                    angular.forEach(DaumMapModel.places, function (place, i, self){
                        var position = new daum.maps.LatLng(place.latitude, place.longitude);
                        var marker = new daum.maps.Marker({
                            map: map,
                            position: position,
                            title: String(i),
                            image: markerImg,
                            clickable: true
                        })
                        daum.maps.event.addListener(marker, 'click', function(){
                            var marker = this;
                            scope.$apply(function (){
                              // change rest img to unselected.
                                  angular.forEach(DaumMapModel.markers, function (marker, i, self){
                                        marker.setImage(markerImg);
                                  });
                                  // change this marker to selected.
                                  marker.setImage(markerClickedImg);
                                  // show modal for clicked marker
                                  DaumMapModel.modal.show();
                                  // load content based on location of the array
                                  var index = Number(marker.getTitle());
                                  angular.copy( DaumMapModel.places[index], DaumMapModel.selectedPlace);
                            });
                        });
                        // Save converted place with click event added.
                        DaumMapModel.markers.push(marker);
                    })
                    //TODO: ,function err(){}
                });
            };
//==========================================================================
//              Find Current location and search nearby
//==========================================================================
            DaumMapModel.findMeThenSearchNearBy = function (){
                navigator.geolocation.getCurrentPosition(function (position){
                    // get current position.
                    angular.copy(position.coords, DaumMapModel.currentPosition);
                    map.setCenter(new daum.maps.LatLng(
                        DaumMapModel.currentPosition.lat,
                        DaumMapModel.currentPosition.lng
                    ));
                    // calc nearby with category.
                    var searchParams = calcNearBy(
                        DaumMapModel.currentPosition.lat,
                        DaumMapModel.currentPosition.lng,
                        DaumMapModel.category
                    );
                    drawMarkers(searchParams);
                });
            };
//==========================================================================
//              Find specific location with value and search nearby
//==========================================================================
            DaumMapModel.searchMapNearBy = function (value){
                ps.keywordSearch(value, function (status, data, pagination){
                    // Center the map to the first result of the search
                    map.panTo( new daum.maps.LatLng(
                        data.places[0].latitude,
                        data.places[0].longitude
                    ))
                    var searchParams = calcNearBy(
                        data.places[0].latitude,
                        data.places[0].longitude,
                        DaumMapModel.category
                    );
                    drawMarkers(searchParams);
                })
            }
        }
    }

}])