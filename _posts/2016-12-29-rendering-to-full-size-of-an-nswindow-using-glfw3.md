---
layout: three_post
title: Rendering to full size of an NSWindow using GLFW3
comments: true
tags: osx macos glfw cocoa objective-c method-swizzling
---
In one of my projects I wanted to render (using OpenGL) to the full area of a window, including the title bar. This would enable me to create a more custom look for my tool, similar to how Spotify looks;

![Spotify having a custom window color.](/static/posts/2016-12-29-spotify.png "Spotify having a custom window color.")

After digging around it seemed possible by setting `titlebarAppearsTransparent` and `backgroundColor` properties for the `NSWindow`. Easy stuff if you have full control of your window code, but if you are using a third party windowing library, such as GLFW, you need to do some more work.

If you also want to be able to move the window by draging the title bar, it gets even trickier. But thanks to something called [method swizzling](http://nshipster.com/method-swizzling/) it's possible to solve it in runtime, without any code changes!

Below is what I ended up using for GLFW; just call `HackFullContentView(GLFWwindow* window)` once for every GLFW window you open. It will set the needed properties for the `NSWindow`, but also override/swizzle the `mouseDownCanMoveWindow` property getter (otherwise a read only property) of the `GLFWContentView` class.

{% highlight objc %}
#include <GLFW/glfw3.h>
#define GLFW_EXPOSE_NATIVE_COCOA
#include <GLFW/glfw3native.h>

#import <objc/runtime.h>

// Dummy class for supplying a fake mouseDownCanMoveWindow selector.
@interface FakeView : NSView
@end
@implementation FakeView
- (BOOL)fakeMouseDownCanMoveWindow { return YES; }
@end

void HackFullContentView(GLFWwindow* window)
{
    // For each new window we open, the following code needs to be run.
    NSWindow* wnd = glfwGetCocoaWindow(window);
    wnd.titlebarAppearsTransparent = YES;
    wnd.titleVisibility = NSWindowTitleHidden;
    wnd.backgroundColor = NSColor.blackColor;

    // We only need override/swizzle the selector once.
    static bool run_once = true;
    if (run_once)
    {
        run_once = false;
        NSView* glView = [wnd contentView];
        Method originalMethod = class_getInstanceMethod([glView class], @selector(mouseDownCanMoveWindow));
        Method categoryMethod = class_getInstanceMethod(FakeView.class, @selector(fakeMouseDownCanMoveWindow));
        method_exchangeImplementations(originalMethod, categoryMethod);
    }
}
{% endhighlight %}

Here is a quick screenshot of the result, a GLFW window rendering [dear imgui](https://github.com/ocornut/imgui):

![GLFW window with custom color.](/static/posts/2016-12-29-glfw.png "GLFW window with custom color.")
