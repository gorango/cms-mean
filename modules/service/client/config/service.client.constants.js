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
        latitude: 43.49103931200484,
        longitude: -79.661865234375
      },
      {
        latitude: 43.49876012743523,
        longitude: -79.64950561523438
      },
      {
        latitude: 43.49004300585231,
        longitude: -79.6347427368164
      },
      {
        latitude: 43.48157373999691,
        longitude: -79.62203979492188
      },
      {
        latitude: 43.49602059624177,
        longitude: -79.60624694824219
      },
      {
        latitude: 43.51046399699564,
        longitude: -79.60006713867188
      },
      {
        latitude: 43.53510940481582,
        longitude: -79.59903717041017
      },
      {
        latitude: 43.53809604282298,
        longitude: -79.58461761474614
      },
      {
        latitude: 43.55153408323949,
        longitude: -79.58118438720703
      },
      {
        latitude: 43.56248138279788,
        longitude: -79.56195831298824
      },
      {
        latitude: 43.58685685639638,
        longitude: -79.53655242919923
      },
      {
        latitude: 43.59431676355144,
        longitude: -79.5015335083008
      },
      {
        latitude: 43.6301114467192,
        longitude: -79.46788787841793
      },
      {
        latitude: 43.66340125095968,
        longitude: -79.51045989990233
      },
      {
        latitude: 43.69716905314005,
        longitude: -79.51389312744135
      },
      {
        latitude: 43.71106791821883,
        longitude: -79.54067230224604
      },
      {
        latitude: 43.74133643108268,
        longitude: -79.55165863037105
      },
      {
        latitude: 43.76117633310124,
        longitude: -79.58324432373043
      },
      {
        latitude: 43.763903805293104,
        longitude: -79.59491729736328
      },
      {
        latitude: 43.752745178356285,
        longitude: -79.6354293823242
      },
      {
        latitude: 43.72794077927287,
        longitude: -79.67216491699219
      },
      {
        latitude: 43.7162791618341,
        longitude: -79.67525482177734
      },
      {
        latitude: 43.671844983221604,
        longitude: -79.69619750976562
      },
      {
        latitude: 43.65321752346015,
        longitude: -79.71508026123047
      },
      {
        latitude: 43.64154136955292,
        longitude: -79.73499298095703
      },
      {
        latitude: 43.62961444423518,
        longitude: -79.74700927734376
      },
      {
        latitude: 43.61544814581708,
        longitude: -79.76657867431642
      },
      {
        latitude: 43.610973884387924,
        longitude: -79.7823715209961
      },
      {
        latitude: 43.592824856091156,
        longitude: -79.80537414550783
      },
      {
        latitude: 43.58511607834954,
        longitude: -79.8091506958008
      },
      {
        latitude: 43.52814000752928,
        longitude: -79.73018646240232
      },
      {
        latitude: 43.49552248630757,
        longitude: -79.6780014038086
      },
      {
        latitude: 43.49103931200484,
        longitude: -79.661865234375
      }
    ])
    .constant('POSTAL_CODES', [
      'L4T',
      'L4W',
      'L4X',
      'L4Y',
      'L4Z',
      'L5A',
      'L5B',
      'L5C',
      'L5E',
      'L5G',
      'L5H',
      'L5J',
      'L5K',
      'L5L',
      'L5M',
      'L5N',
      'L5R',
      // 'L5T',   !!!
      'L5V',
      'L5W',
      // 'L6H',
      // 'L6J',
      // 'L6K',
      // 'L6L',
      // 'L6M',
      'L6T',
      // 'L6W',
      // 'L6V',
      'L6W',
      // 'L6X',
      'L6Y',
      // 'L6Z',
      'M8V',
      'M8W',
      'M8X',
      'M8Y',
      // 'M8Z',   !!!
      'M9A',
      'M9B',
      'M9C',
      'M9P',
      'M9R',
      'M9V',
      'M9W'
    ]);
}());
