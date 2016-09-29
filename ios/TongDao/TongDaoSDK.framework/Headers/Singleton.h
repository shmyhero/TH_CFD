

// @interface
#define singleton_interface(className) \
+ (className *)shared##className;


// @implementation
#define singleton_implementation(className) \
static className *_instance; \
+ (id)allocWithZone:(NSZone *)zone \
{ \
    static dispatch_once_t onceToken; \
    dispatch_once(&onceToken, ^{ \
        _instance = [super allocWithZone:zone]; \
    }); \
    return _instance; \
} \
+ (className *)shared##className \
{ \
    static dispatch_once_t onceToken; \
    dispatch_once(&onceToken, ^{ \
        _instance = [[self alloc] init]; \
    }); \
    return _instance; \
}
//@interface
//#define singleton_iterface(classname)\
//+(className *)shared##className;
////@implementation
//#define sigleton_implementation(className)\
//static className *_instance;\
//+(id)allocWithZone:(NSZone*)zone\
//{\
//     static dispatch_once_t onceToken;\
//      dispatch_once(&onceToken,^{\
//          })\;
//        \
//}\