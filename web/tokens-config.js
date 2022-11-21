const StyleDictionary = require('style-dictionary');
const transformer = StyleDictionary.transform['attribute/cti'].transformer;

const propertiesToCTI = {
  'width': {category: 'size', type: 'dimension'},
  'min-width': {category: 'size', type: 'dimension'},
  'max-width': {category: 'size', type: 'dimension'},
  'height': {category: 'size', type: 'dimension'},
  'min-height': {category: 'size', type: 'dimension'},
  'max-height': {category: 'size', type: 'dimension'},
  'border-width': {category: 'size', type: 'border', item: 'width'},
  'border-radius': { category: 'size', type: 'border', item: 'width' },
  'border-color': {category: 'color', type: 'border'},
  'background-color': {category: 'color', type: 'background'},
  'color': {category: 'color', type: 'font'},
  'text-color': { category: 'color', type: 'font' },
  'padding': {category: 'size', type: 'padding'},
  'padding-vertical': {category: 'size', type: 'padding'},
  'padding-horizontal': {category: 'size', type: 'padding'},
  'icon': {category: 'content', type: 'icon'},
  'font-size': {category: 'size', type: 'font'},
  'line-height': { category: 'size', type: 'line-height' },
  'size': {category: 'size', type: 'icon'}
}

const CTITransform = {
  type: `attribute`,
  transformer: (prop) => {
    // Only do this custom functionality in the 'component' top-level namespace.
    if (prop.path[0] === 'component') {
      // When defining component tokens, the key of the token is the relevant CSS property
      // The key of the token is the last element in the path array
      return propertiesToCTI[prop.path[prop.path.length - 1]];
    } else {
      // Fallback to the original 'attribute/cti' transformer
      return transformer(prop);
    }
  }
}


// eslint-disable-next-line no-undef
module.exports = {
  "source": ["src/**/*.token.json"],
  "transform": {
    // Override the attribute/cti transform
    'attribute/cti': CTITransform
  },
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        {
          "format": "css/variables",
          "destination": "variables.css"
        }
      ]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }]
    },
    "android": {
      "transformGroup": "android",
      "buildPath": "build/android/",
      "files": [{
        "destination": "font_dimens.xml",
        "format": "android/fontDimens"
      },{
        "destination": "colors.xml",
        "format": "android/colors"
      }]
    },
    "compose": {
      "transformGroup": "compose",
      "buildPath": "build/compose/",
      "files": [{
        "destination": "StyleDictionaryColor.kt",
        "format": "compose/object",
        "className": "StyleDictionaryColor",
        "packageName": "StyleDictionaryColor",
        "filter": {
          "attributes": {
            "category": "color"
          }
        }
      },{
        "destination": "StyleDictionarySize.kt",
        "format": "compose/object",
        "className": "StyleDictionarySize",
        "packageName": "StyleDictionarySize",
        "type": "float",
        "filter": {
          "attributes": {
            "category": "size"
          }
        }
      }]
    },
    "ios": {
      "transformGroup": "ios",
      "buildPath": "build/ios/",
      "files": [{
        "destination": "StyleDictionaryColor.h",
        "format": "ios/colors.h",
        "className": "StyleDictionaryColor",
        "type": "StyleDictionaryColorName",
        "filter": {
          "attributes": {
            "category": "color"
          }
        }
      },{
        "destination": "StyleDictionaryColor.m",
        "format": "ios/colors.m",
        "className": "StyleDictionaryColor",
        "type": "StyleDictionaryColorName",
        "filter": {
          "attributes": {
            "category": "color"
          }
        }
      },{
        "destination": "StyleDictionarySize.h",
        "format": "ios/static.h",
        "className": "StyleDictionarySize",
        "type": "float",
        "filter": {
          "attributes": {
            "category": "size"
          }
        }
      },{
        "destination": "StyleDictionarySize.m",
        "format": "ios/static.m",
        "className": "StyleDictionarySize",
        "type": "float",
        "filter": {
          "attributes": {
            "category": "size"
          }
        }
      }]
    },
    "ios-swift": {
      "transformGroup": "ios-swift",
      "buildPath": "build/ios-swift/",
      "files": [{
        "destination": "StyleDictionary+Class.swift",
        "format": "ios-swift/class.swift",
        "className": "StyleDictionaryClass",
        "filter": {}
      },{
        "destination": "StyleDictionary+Enum.swift",
        "format": "ios-swift/enum.swift",
        "className": "StyleDictionaryEnum",
        "filter": {}
      },{
        "destination": "StyleDictionary+Struct.swift",
        "format": "ios-swift/any.swift",
        "className": "StyleDictionaryStruct",
        "filter": {},
        "options": {
          "imports": "SwiftUI",
          "objectType": "struct",
          "accessControl": "internal"
        }
      }]
    },
    "ios-swift-separate-enums": {
      "transformGroup": "ios-swift-separate",
      "buildPath": "build/ios-swift/",
      "files": [{
        "destination": "StyleDictionaryColor.swift",
        "format": "ios-swift/enum.swift",
        "className": "StyleDictionaryColor",
        "filter": {
          "attributes": {
            "category": "color"
          }
        }
      },{
        "destination": "StyleDictionarySize.swift",
        "format": "ios-swift/enum.swift",
        "className": "StyleDictionarySize",
        "filter": {
          "attributes": {
            "category": "size"
          }
        }
      }]
    }
  }
}
