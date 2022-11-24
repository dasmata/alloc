
//
// StyleDictionaryColor.h
//

// Do not edit directly
// Generated on Tue, 22 Nov 2022 18:10:52 GMT


#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, StyleDictionaryColorName) {
ComponentFormErrorColor,
ComponentFormInputBackgroundColor,
ComponentFormInputColor,
ColorAccentPrimary,
ColorBackgroundPrimary,
ColorBackgroundLink,
ColorBackgroundInverse,
ColorBackgroundError,
ColorBackgroundSuccess,
ColorBackgroundWarning,
ColorBackgroundInfo,
ColorBaseWhite,
ColorBaseBlack,
ColorBaseBlue,
ColorBaseGray,
ColorBaseGreen100,
ColorBaseGreen200,
ColorBaseRed100,
ColorBaseRed200,
ColorBaseYellow100,
ColorBaseYellow200,
ColorBaseBlue100,
ColorBaseBlue200,
ColorBorderError,
ColorBorderBlack,
ColorBorderBlue,
ColorBorderSuccess,
ColorBorderWarning,
ColorBorderInfo,
ColorFontPrimary,
ColorFontLink,
ColorFontInverse,
ColorFontError
};

@interface StyleDictionaryColor : NSObject
+ (NSArray *)values;
+ (UIColor *)color:(StyleDictionaryColorName)color;
@end
