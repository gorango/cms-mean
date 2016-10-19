(function() {
  'use strict';

  angular
    .module('service')
    .constant('SERVICE_AREA_MAP_CONFIG', {
      center: {
        latitude: 43.61,
        longitude: -79.68
      },
      zoom: 10,
      options: {
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        scrollwheel: false,
        maxZoom: 13,
        minZoom: 9,
        styles: [
          {
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
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': [{
              'visibility': 'off'
            }]
          }, {
            'featureType': 'road',
            'elementType': 'all',
            'stylers': [{
              'saturation': -100
            }, {
              'lightness': 45
            }]
          }, {
            'featureType': 'road.highway',
            'elementType': 'all',
            'stylers': [{
              'visibility': 'simplified'
            }]
          }, {
            'featureType': 'road.arterial',
            'elementType': 'labels.icon',
            'stylers': [{
              'visibility': 'off'
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
              'color': '#41a1ed'
            }]
          }
        ]
      }
    })
    .constant('MAP_STYLES', [
      {
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
        'featureType': 'poi',
        'elementType': 'all',
        'stylers': [{
          'visibility': 'off'
        }]
      }, {
        'featureType': 'road',
        'elementType': 'all',
        'stylers': [{
          'saturation': -100
        }, {
          'lightness': 45
        }]
      }, {
        'featureType': 'road.highway',
        'elementType': 'all',
        'stylers': [{
          'visibility': 'simplified'
        }]
      }, {
        'featureType': 'road.arterial',
        'elementType': 'labels.icon',
        'stylers': [{
          'visibility': 'off'
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
          'color': '#41a1ed'
        }]
      }
    ])
    .constant('SERVICE_AREA_STYLES', {
      fill: {
        color: '#fff',
        opacity: 0.2
      },
      stroke: {
        color: 'rgb(244, 67, 54)',
        opacity: 0.8,
        weight: 6
      }
    })
    .constant('OUTER_SERVICE_AREA_COORDS', [
      {
        latitude: 40.38839687388361,
        longitude: -84.407958984375
      },
      {
        latitude: 46.39998810407942,
        longitude: -84.407958984375
      },
      {
        latitude: 46.39998810407942,
        longitude: -74.366455078125
      },
      {
        latitude: 40.38839687388361,
        longitude: -74.366455078125
      },
      {
        latitude: 40.38839687388361,
        longitude: -84.407958984375
      }
    ])
    .constant('INNER_SERVICE_AREA_COORDS', [
      {
        latitude: 43.47036259175014,
        longitude: -79.7834014892578
      },
      {
        latitude: 43.44594000506581,
        longitude: -79.7875213623046
      },
      {
        latitude: 43.39107786275974,
        longitude: -79.7099304199218
      },
      {
        latitude: 43.49925821066224,
        longitude: -79.6055603027343
      },
      {
        latitude: 43.534611617432816,
        longitude: -79.59800720214844
      },
      {
        latitude: 43.537598280094535,
        longitude: -79.58358764648438
      },
      {
        latitude: 43.55103643145803,
        longitude: -79.5801544189453
      },
      {
        latitude: 43.56198382141966,
        longitude: -79.5609283447265
      },
      {
        latitude: 43.58635949637695,
        longitude: -79.5355224609375
      },
      {
        latitude: 43.593819465174214,
        longitude: -79.50050354003906
      },
      {
        latitude: 43.62961444423518,
        longitude: -79.4668579101562
      },
      {
        latitude: 43.66290452383668,
        longitude: -79.5094299316406
      },
      {
        latitude: 43.69667260550319,
        longitude: -79.5128631591796
      },
      {
        latitude: 43.71057158566884,
        longitude: -79.5396423339843
      },
      {
        latitude: 43.74084034926642,
        longitude: -79.5506286621093
      },
      {
        latitude: 43.76068041570689,
        longitude: -79.5822143554687
      },
      {
        latitude: 43.78547124986761,
        longitude: -79.5897674560546
      },
      {
        latitude: 43.81173831375078,
        longitude: -79.6227264404296
      },
      {
        latitude: 43.84443209873527,
        longitude: -79.6371459960937
      },
      {
        latitude: 43.83947964604014,
        longitude: -79.6762847900390
      },
      {
        latitude: 43.819170291885584,
        longitude: -79.70993041992188
      },
      {
        latitude: 43.750761204595804,
        longitude: -79.78546142578125
      },
      {
        latitude: 43.69667260550319,
        longitude: -79.8438262939453
      },
      {
        latitude: 43.66687822574129,
        longitude: -79.8726654052734
      },
      {
        latitude: 43.64949133795468,
        longitude: -79.8609924316406
      },
      {
        latitude: 43.63458428413614,
        longitude: -79.8630523681640
      },
      {
        latitude: 43.62712937016884,
        longitude: -79.8733520507812
      },
      {
        latitude: 43.52764216261958,
        longitude: -79.7291564941406
      },
      {
        latitude: 43.515194704453215,
        longitude: -79.73945617675781
      },
      {
        latitude: 43.50224662373913,
        longitude: -79.7566223144531
      },
      {
        latitude: 43.48829943053877,
        longitude: -79.7607421875
      },
      {
        latitude: 43.47036259175014,
        longitude: -79.7834014892578
      }
    ])
    .constant('POSTAL_CODES', ['M9R', 'M9W', 'M8V', 'M8W', 'M8X', 'M8Y', 'M8Z', 'M9A', 'M9B', 'M9C', 'M9P', 'L4W', 'L4X', 'L4Y', 'L4Z', 'L5A', 'L5B', 'L5C', 'L5E', 'L5G', 'L5H', 'L5J', 'L5K', 'L5L', 'L5R', 'L5T', 'L5V', 'L5M', 'L5N', 'L5W', 'L6H', 'L6J', 'L6K', 'L6L', 'L6M', 'L6Y', 'L6X', 'L6W', 'L6V', 'L6Z', 'L6T']);
}());
