const StyleDictionary = require('style-dictionary');
const { Parser } = require("expr-eval");
const cssParser = require('css-math').parser
const transformer = StyleDictionary.transform['attribute/cti'].transformer;

console.log('Build started...');
console.log('\n==============================================');


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

const fontWeightMap = {
  100: 100,
  200: 200,
  300: 300,
  400: 400,
  500: 500,
  600: 600,
  700: 700,
  800: 800,
  900: 900,
  950: 950,
  'thin': 100,
  'hairline': 100,
  'extra-light': 100,
  'extralight': 200,
  'ultra-light': 200,
  'ultralight': 200,
  'extraleicht': 200,
  'light': 300,
  'leicht': 300,
  'normal': 400,
  'regular': 400,
  'book': 400,
  'buch': 400,
  'medium': 500,
  'kraeftig': 500,
  'kräftig': 500,
  'semi-bold': 600,
  'semibold': 600,
  'demi-bold': 600,
  'demibold': 600,
  'halbfett': 600,
  'bold': 700,
  'dreiviertelfett': 700,
  'extra-bold': 800,
  'extrabold': 800,
  'ultra-bold': 800,
  'ultrabold': 800,
  'ultabold': 800,
  'fett': 800,
  'black': 900,
  'heavy': 900,
  'super': 900,
  'extrafett': 900,
  'extra-black': 950,
  'ultra-black': 950
};

// ==========================================================================
// Transform Helpers
// ==========================================================================


// Helper: Transforms math in Figma Tokens
// SD: Doesn't natively support math, but FT does. This attempts to implement
// a solution for SD to transform math.
const parser = new Parser();

function checkAndEvaluateMath(expr) {
  try {
    return +parser.evaluate(expr).toFixed(3);
  } catch (ex) {
    return expr;
  }
}

const CTITransform = {
  name: 'attribute/cti',
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



// Helper: Transforms dimensions to px and consider other value units
// Figma supports: px, %
// W3C supports: px, rem
// PDS SD supports: unitless, px, rem, em, %
function transformDimension(value) {
  if (isNaN(value)) {
    return value;
  } else if (value === '0') {
    return value;
  }

  return value + "px";
}

// Helper: Transforms font-weight to numerical values
// Figma supports: string of exact weight name for the given font-family
// Note: We want to map the font-weight names to numerical values for CSS, etc.
function transformFontWeights(value) {
  const mapped = fontWeightMap[value.toString().toLowerCase()];
  return `${mapped}`;
}

// Helper: Transforms font-size
// Figma supports: px
// W3C supports: px, rem
// PDS SD supports: unitless, px, rem, em, %
function transformFontSizes(value) {
  if (value.toString().endsWith("px")) {
    return value;
  } else if (value.toString().endsWith("rem")) {
    return value;
  } else if (value.toString().endsWith("em")) {
    return value;
  } else if (value.toString().endsWith("%")) {
    return value;
  }

  return value + "px";
}

// Helper: Transforms line-height
// Figma supports: Auto, px, %
// W3C supports: px, rem
// PDS SD supports: Normal, Auto, unitless, px, rem, em, %
function transformLineHeight(value) {
  if (value.toString().endsWith("px")) {
    return value;
  } else if (value.toString().endsWith("rem")) {
    return value;
  } else if (value.toString().endsWith("em")) {
    return value;
  } else if (value.toString().endsWith("%")) {
    return value;
  }
  else if (value === 'normal') {
    return 'normal';
  }
  else if (value === 'Auto') {
    return 'normal';
  }

  return value;
}


// Helper: Transforms text-indent
// Figma supports: px
// W3C: Not in spec
// PDS SD supports: unitless, px
function transformParagraphIndent(value) {
  if (value.toString().endsWith("px")) {
    return value;
  } else if (value === '0') {
    return value;
  }

  return value + "px";
}

// Helper: Transforms letter-spacing
// Figma supports: px, %
// W3C supports: Not in spec
// PDS SD supports: normal, px, %
// Note: Transforming % to em for now (CSS doesn't support %) since not sure how to go from % to px
function transformLetterSpacing(value) {
  if (value.toString() === '0%') {
    return 'normal';
  } else if (value.toString().endsWith("%")) {
    const percentValue = value.slice(0, -1);
    return `${percentValue / 100}em`;
  }

  return value;
}

// Helper: Transforms border-radius
// Figma supports: px, %
// W3C supports: Not in spec
// PDS SD supports: unitless, px, %
function transformBorderRadius(value) {
  if (value.toString().endsWith("px")) {
    return value;
  } else if (value.toString().endsWith("%")) {
    return value;
  } else if (value == '0') {
    return value;
  }

  return value + "px";
}


// Helper: Transforms border-width
// Figma supports: px
// W3C supports: Not in spec
// PDS SD supports: unitless, px
function transformBorderWidth(value) {
  if (value.toString().endsWith("px")) {
    return value;
  } else if (value == '0') {
    return value;
  }

  return value + "px";
}

// ==========================================================================
// Register Custom Transforms
// ==========================================================================

// Transform: attribute cti
StyleDictionary.registerTransform(CTITransform);

// Transform: dimension
// Transform dimension token types into ideal format
StyleDictionary.registerTransform({
  name: "type/dimension",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["dimension", "sizing", "spacing"].includes(token.type),
  transformer: (token) => transformDimension(token.value),
});


// Transform: fontFamily
// Transform font-family token types into ideal format
StyleDictionary.registerTransform({
  name: "type/fontFamily",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["fontFamily", "fontFamilies"].includes(token.type),
  transformer: (token) => token.value,
});


// Transform: fontWeight
// Transform font-weight token types into ideal format
StyleDictionary.registerTransform({
  name: "type/fontWeight",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["fontWeight", "fontWeights"].includes(token.type),
  transformer: (token) => transformFontWeights(token.value),
});


// Transform: fontSize
// Transform font-size token types into ideal format
StyleDictionary.registerTransform({
  name: "type/fontSize",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["fontSize", "fontSizes"].includes(token.type),
  transformer: (token) => transformFontSizes(token.value),
});


// Transform: lineHeight
// Transform line-height token types into ideal format
StyleDictionary.registerTransform({
  name: "type/lineHeight",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["lineHeight", "lineHeights"].includes(token.type),
  transformer: (token) => transformLineHeight(token.value),
});


// Transform: letterSpacing
// Transform letter-spacing token types into ideal format
StyleDictionary.registerTransform({
  name: "size/letterSpacing",
  type: "value",
  transitive: true,
  matcher: (token) => token.type === "letterSpacing",
  transformer: (token) => transformLetterSpacing(token.value),
});


// Transform: paragraphIndent
// Transform text-case token types into ideal format
StyleDictionary.registerTransform({
  name: "type/paragraphIndent",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["paragraphIndent"].includes(token.type),
  transformer: (token) => transformParagraphIndent(token.value),
});


// Transform: borderRadius
// Transform border-radius token types into ideal format
StyleDictionary.registerTransform({
  name: "type/borderRadius",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["borderRadius"].includes(token.type),
  transformer: (token) => transformBorderRadius(token.value),
});


// Transform: borderWidth
// Transform border-width token types into ideal format
StyleDictionary.registerTransform({
  name: "type/borderWidth",
  type: "value",
  transitive: true,
  matcher: (token) =>
    ["borderWidth"].includes(token.type),
  transformer: (token) => transformBorderWidth(token.value),
});


// Transform: resolveMath
// Transform to resolve math across certain tokens
// Note: Sorta a hack, it works, but the resolved value is different in the resolved JS & JSON
StyleDictionary.registerTransform({
  name: "resolveMath",
  type: "value",
  transitive: true,
  // matcher: (token) => token,
  matcher: (token) =>
    ["dimension", "sizing", "spacing"].includes(token.type),
  // Putting this in strings seems to be required
  transformer: (token) => `${cssParser(checkAndEvaluateMath(token.value))}`
});


// ==========================================================================
// Register Custom Transform Groups
// ==========================================================================

StyleDictionary.registerTransformGroup({
  name: 'sv/css',
  // notice: here the "size/px" transform is not the pre-defined one, but the custom one we have declared above
  transforms: [
    'color/css',
    'content/icon',
    'name/cti/kebab',
    'time/seconds',
    'attribute/cti',
    'type/dimension',
    'type/fontFamily',
    'type/fontWeight',
    'type/fontSize',
    'type/lineHeight',
    'type/paragraphIndent',
    'type/borderRadius',
    'type/borderWidth',
    'size/letterSpacing',
    'resolveMath'
    // "type/typography"
  ]
});

StyleDictionary.registerTransformGroup({
  name: 'sv/scss',
  transforms: [
    'color/css',
    'content/icon',
    'name/cti/kebab',
    'time/seconds',
    'attribute/cti',
    'size/letterSpacing',
    'type/dimension',
    'type/fontFamily',
    'type/fontWeight',
    'type/fontSize',
    'type/lineHeight',
    'type/paragraphIndent',
    'type/borderRadius',
    'type/borderWidth',
    'resolveMath'

    // "type/typography"
  ]
});

StyleDictionary.registerTransformGroup({
  name: 'sv/less',
  transforms: [
    'color/css',
    'content/icon',
    'name/cti/kebab',
    'time/seconds',
    'attribute/cti',
    'size/letterSpacing',
    'type/dimension',
    'type/fontFamily',
    'type/fontWeight',
    'type/fontSize',
    'type/lineHeight',
    'type/paragraphIndent',
    'type/borderRadius',
    'type/borderWidth',
    'resolveMath'

    // "type/typography"
  ]
});


StyleDictionary.registerTransformGroup({
  name: 'sv/js',
  transforms: [
    'color/css',
    'content/icon',
    'name/cti/kebab',
    'time/seconds',
    'attribute/cti',
    'size/letterSpacing',
    'type/dimension',
    'type/fontFamily',
    'type/fontWeight',
    'type/fontSize',
    'type/lineHeight',
    'type/paragraphIndent',
    'type/borderRadius',
    'type/borderWidth',

    // "type/typography"
  ]
});




// eslint-disable-next-line no-undef
module.exports = {
  "source": ["src/**/*.token.json"],
  "platforms": {
    "css": {
      "transformGroup": "sv/css",
      "buildPath": "../web/src/css/",
      "files": [
        {
          "format": "css/variables",
          "destination": "variables.css"
        }
      ]
    },
    "scss": {
      "transformGroup": "sv/scss",
      "buildPath": "build/scss/",
      "files": [{
        "destination": "_variables.scss",
        "format": "scss/variables"
      }]
    },
    "less": {
      "transformGroup": "sv/less",
      "buildPath": "build/less/",
      "files": [{
        "destination": "variables.less",
        "format": "less/variables"
      }]
    },
    // "js": {
    //   "transformGroup": "sv/js",
    //   "buildPath": "build/js/",
    //   "files": [{
    //     "destination": "variables.js",
    //     "format": "js/variables"
    //   }]
    // },
  }
}
