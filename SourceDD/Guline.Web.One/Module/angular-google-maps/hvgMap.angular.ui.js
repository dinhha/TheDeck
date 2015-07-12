/*
google map editor

module : d2.googleMap
directive[attr]: d2GoogleMapEditor
<div d2-google-map-editor d2-google-map-editor-search="address" ng-model="location" style="width:500px;height:350px;"></div>
ng-model : prop containt lat, long
d2-google-map-editor-search : prop change textbox search
*/


(function (window, angular) {
	if (!google.maps) { return; }
	var requestMaps = [];
	var googleMapIsLoaded = false;
	var MapObject = function (element, option) {
		var opt = {
			location: { lat: 10.7578263, lng: 106.70129680000002 },
			zoom: 8,
			textButtonSearch: "Search",
			textButtonClear: "Clear",
			onLocationChange: function (location) {

			}
		}
		opt = $.extend(opt, option);
		element = $(element);
		var elSearch = $('<input type="text" class="d2-map-search-text form-control" />');
		var map;
		var geocoder;
		var infoDisplay;
		var marker;
		var currentLocation;
		var elModal = null;
		function initialize() {
		    var elButtonSearch = $('<input type="button" class="d2-map-search-button btn btn-default btn-sm"  />').val(opt.textButtonSearch);
		    var elButtonClear = $('<input type="button" class="d2-map-clear-button btn btn-default btn-sm"  />').val(opt.textButtonClear);
			var elMap = $('<div class="d2-map-boby"><div>');
			
			element.append(elSearch).append(elButtonSearch).append(elButtonClear).append(elMap)
			infoDisplay = new google.maps.InfoWindow({
				content: ""
			});
			marker = new google.maps.Marker({
				draggable: true
			});
			geocoder = new google.maps.Geocoder();
			var mapOptions = {
				center: opt.location,
				zoom: opt.zoom
			};
			var attrModal = element.attr('d2-google-map-modal');
			var hideModal = false;
			if (attrModal) {
				elModal = element.closest(attrModal);
				if (elModal.length > 0) {
					elModal.show();
					hideModal = true;
				}
			}
			map = new google.maps.Map(elMap.get(0), mapOptions);

			google.maps.event.addDomListener(map, 'resize', function () {
			});
			google.maps.event.addDomListener(map, 'bounds_changed', function (e) {
				if (hideModal) {
					elModal.hide();
					hideModal = false;
				}
			});

			google.maps.event.addDomListener(marker, 'click', showInfoWindows);
			google.maps.event.addDomListener(marker, 'dragend', function () {
				var pos = marker.getPosition();
				setLocation(pos);
				onLocationChange();
			});
			google.maps.event.addDomListener(infoDisplay, 'closeclick', function () {
				clearMarker();
			})
			elButtonSearch.click(function () {
				setAddress(elSearch.val());
			});
			elSearch.keypress(function (e) {
				if (e.keyCode == 13) {
					setAddress($(this).val());
				}
			})
			elButtonClear.click(clearMarker);
			// nếu có currentLocation ta move và add marker
			if (currentLocation) {
				setLocation(currentLocation);
			}
		}
		function clearMarker() {
			setLocation(null);
			onLocationChange();
		}
		function showInfoWindows() {
			if (currentLocation) {
				infoDisplay.setContent('<div class="gg-m" style="min-width:180px; text-align:center">' + currentLocation + "</div>");
				infoDisplay.open(map, marker);
			}
		}
		///move marker đến vị trí location (null sẽ remover marker)
		function setLocation(location) {
			//<param name=location>google.maps.LatLng</param>
			currentLocation = location;
			if (map && marker) {
				if (currentLocation) {
					if (elModal != null && elModal.length > 0) {
						elModal.show();
						google.maps.event.trigger(map, "resize");
					}
					map.setCenter(currentLocation);
					marker.setMap(map);
					marker.setPosition(currentLocation);
					showInfoWindows();
				}
				else {
					marker.setMap(null);
					infoDisplay.close();
				}
			}
		}
		/// Tìm kiếm địa chỉ
		function setAddress(address) {
			address = address.trim();
			if (!geocoder) return;
			if (!address) return;
			geocoder.geocode({ 'address': address }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					setLocation(results[0].geometry.location);
					onLocationChange();
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			});
		}
		function onLocationChange() {
			if (currentLocation) {
				opt.onLocationChange(currentLocation.lat() + "," + currentLocation.lng())
			}
			else {
				opt.onLocationChange(null)
			}
		}
		return {
			init: function () {
				initialize();
			},
			setAddressSearch: function (address) {
				elSearch.val(address);
			},
			setLocation: function (location) {
				///<summary>Di chuyển marker. không call onLocationChange</summary>
				if (location) {
					var tmp = location.split(',');
					if (tmp.length != 2) {
						console.log("location invaild format", location);
						return;
					}
					setLocation(new google.maps.LatLng(tmp[0], tmp[1]));
				}
				else {
					setLocation(null);
				}
			}
		}
	}

	
	angular.module('d2.googleMap', []).directive('d2GoogleMapEditor', [function () {

			return {
				restrict: 'A',
				require: '?ngModel',
				link: function (scope, iElement, iAttrs, ngModel) {
					// new map object
					var mapObject = new MapObject(iElement, {
						onLocationChange: (function (ngModel) {
							// khi có sự thay đổi location
							return function (location) {
								if (ngModel) {
									// update vào mode
									ngModel.$setViewValue(location)
								}
							}
						})(ngModel)
					});
					// update thông tin ban đầu từ $modelValue
					mapObject.setLocation(ngModel.$modelValue);

					// init nếu google map is loaded, nếu không đưa vào requestMaps để init sau
					if (googleMapIsLoaded) {
						mapObject.init();
					}
					else {
						requestMaps.push(mapObject);
					}
					// when d2GoogleMapEditorSearch thay đổi update lại text search .
					scope.$watch(iAttrs.d2GoogleMapEditorSearch, function (newValue, oldValue) {
						mapObject.setAddressSearch(newValue);
					});
					// when ngModel thay đổi update lại map .
					scope.$watch(iAttrs.ngModel, function (newValue, oldValue) {
						mapObject.setLocation(newValue);
					});
				}
			};

		}]);

	google.maps.event.addDomListener(window, 'load', function () {
		googleMapIsLoaded = true;
		if (requestMaps) {
			for (var i = 0; i < requestMaps.length; i++) {
				requestMaps[i].init();
			}
		}
	});
})(window, angular);

