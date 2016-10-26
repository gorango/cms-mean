(function() {
  'use strict';

  angular
    .module('routing')
    .constant('CIRCLES_CONFIG', {
      base: {
        radius: 100,
        fill: {
          color: '#607D8B',
          opacity: 0.4
        },
        stroke: {
          color: '#607D8B',
          opacity: 0.9,
          weight: 4
        }
      },
      red: {
        fill: { color: '#F44336' },
        stroke: { color: '#F44336' }
      },
      blue: {
        fill: { color: '#2196F3' },
        stroke: { color: '#2196F3' }
      },
      green: {
        fill: { color: '#4CAF50' },
        stroke: { color: '#4CAF50' }
      }
    })
    .constant('ROUTING_MAP_CONFIG', {
      center: {
        latitude: 43.62,
        longitude: -79.65
      },
      zoom: 11,
      options: {
        mapTypeControl: true,
        streetViewControl: true,
        zoomControl: false,
        maxZoom: 18,
        minZoom: 10,
        styles: [{
          'featureType': 'administrative',
          'elementType': 'labels.text.fill',
          'stylers': [{
            'color': '#444444'
          }]
        }, {
          'featureType': 'landscape',
          'elementType': 'all',
          'stylers': [{
            'color': '#f2f2f2'
          }]
        }, {
          'featureType': 'landscape',
          'elementType': 'geometry.fill',
          'stylers': [{
            'color': '#ffffff'
          }, {
            'visibility': 'on'
          }]
        }, {
          'featureType': 'poi',
          'elementType': 'all',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'road',
          'elementType': 'labels.text.fill',
          'stylers': [{
            'color': '#1d1d1d'
          }]
        }, {
          'featureType': 'road',
          'elementType': 'labels.text.stroke',
          'stylers': [{
            'lightness': '100'
          }, {
            'color': '#ffffff'
          }, {
            'weight': '5.35'
          }]
        }, {
          'featureType': 'road.highway',
          'elementType': 'all',
          'stylers': [{
            'visibility': 'simplified'
          }]
        }, {
          'featureType': 'road.highway',
          'elementType': 'geometry.fill',
          'stylers': [{
            'lightness': '9'
          }, {
            'saturation': '100'
          }, {
            'visibility': 'on'
          }, {
            'weight': '2.33'
          }, {
            'color': '#90A4AE'
          }]
        }, {
          'featureType': 'road.highway',
          'elementType': 'geometry.stroke',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'road.highway',
          'elementType': 'labels',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'geometry.fill',
          'stylers': [{
            'color': '#607d8b'
          }, {
            'lightness': '67'
          }]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'labels.text',
          'stylers': [{
            'lightness': '-30'
          }]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'labels.text.fill',
          'stylers': [{
            'lightness': '-64'
          }]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'labels.text.stroke',
          'stylers': [{
            'lightness': '100'
          }]
        }, {
          'featureType': 'road.arterial',
          'elementType': 'labels.icon',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'road.local',
          'elementType': 'geometry.fill',
          'stylers': [{
            'color': '#607d8b'
          }, {
            'lightness': '77'
          }]
        }, {
          'featureType': 'transit',
          'elementType': 'all',
          'stylers': [{
            'visibility': 'off'
          }]
        }, {
          'featureType': 'water',
          'elementType': 'all',
          'stylers': [{
            'color': '#46bcec'
          }, {
            'visibility': 'on'
          }]
        }, {
          'featureType': 'water',
          'elementType': 'geometry.fill',
          'stylers': [{
            'color': '#2196f3'
          }, {
            'lightness': '27'
          }]
        }]
      }
    });
}());
