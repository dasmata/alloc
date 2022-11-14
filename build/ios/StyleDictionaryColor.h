
//
// StyleDictionaryColor.h
//

// Do not edit directly
// Generated on Sun, 13 Nov 2022 19:01:47 GMT


#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, StyleDictionaryColorName) {
ComponentFormErrorColor,
ComponentFormInputBackgroundColor,
ComponentFormInputColor,
ColorAccentPrimary,
ColorBackgroundPrimary,
ColorBackgroundLink,
ColorBackgroundInverse,
ColorBaseWhite,
ColorBaseBlack,
ColorBaseGray,
ColorBaseBlue,
ColorBaseRed100,
ColorFontPrimary,
ColorFontLink,
ColorFontInverse,
ColorFontError
};

@interface StyleDictionaryColor : NSObject
+ (NSArray *)values;
+ (UIColor *)color:(StyleDictionaryColorName)color;
@end
