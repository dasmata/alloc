
//
// StyleDictionaryColor.m
//

// Do not edit directly
// Generated on Tue, 22 Nov 2022 18:10:52 GMT


#import "StyleDictionaryColor.h"

@implementation StyleDictionaryColor

+ (UIColor *)color:(StyleDictionaryColorName)colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
[UIColor colorWithRed:0.769f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:0.012f green:0.400f blue:0.839f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.012f green:0.400f blue:0.839f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.671f blue:0.671f alpha:1.000f],
[UIColor colorWithRed:0.671f green:1.000f blue:0.671f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:0.671f alpha:1.000f],
[UIColor colorWithRed:0.671f green:0.671f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:0.012f green:0.400f blue:0.839f alpha:1.000f],
[UIColor colorWithRed:0.867f green:0.867f blue:0.867f alpha:1.000f],
[UIColor colorWithRed:0.671f green:1.000f blue:0.671f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.769f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.769f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:1.000f green:0.671f blue:0.671f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:0.671f alpha:1.000f],
[UIColor colorWithRed:0.769f green:0.769f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.671f green:0.671f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.000f blue:0.769f alpha:1.000f],
[UIColor colorWithRed:0.769f green:0.000f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:0.671f green:0.671f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.769f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.769f green:0.769f blue:0.000f alpha:1.000f],
[UIColor colorWithRed:0.000f green:0.000f blue:0.769f alpha:1.000f],
[UIColor colorWithRed:0.067f green:0.067f blue:0.067f alpha:1.000f],
[UIColor colorWithRed:0.012f green:0.400f blue:0.839f alpha:1.000f],
[UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
[UIColor colorWithRed:0.769f green:0.000f blue:0.000f alpha:1.000f]
    ];
  });

  return colorArray;
}

@end