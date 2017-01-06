---
layout: three_post
title: Getting NSTouchBar to play nice with GLFW
comments: true
tags: osx macos glfw cocoa objective-c nstouchbar touchbar macbook
---
I wanted to add some simple buttons in the new fancy [NSTouchBar](https://developer.apple.com/reference/appkit/nstouchbar) for one of my projects:

![TouchBar showing emojis for text input](/static/posts/2017-01-07-touchbar_emoji.png "TouchBar showing emojis for text input")

However, I couldn't find a quick and short introduction on how to use it without going full Objective-C, Swift or Xcode-path.

After some hacking I managed to put together a short version that people should be able to build upon. It will also play nice in C/C++ projects, since that is what most of my codebase is built on.

{% highlight objc %}
#include <GLFW/glfw3.h>
#define GLFW_EXPOSE_NATIVE_COCOA
#include <GLFW/glfw3native.h>

static NSString *touchBarCustomizationId = @"com.something.customization_id";
static NSString *touchBarItemId = @"com.something.item_id";

@interface GLFWTouchBarDelegate : NSObject <NSTouchBarDelegate>
    - (NSTouchBar *)makeTouchBar;
    - (NSTouchBarItem *)touchBar:(NSTouchBar *)touchBar makeItemForIdentifier:(NSTouchBarItemIdentifier)identifier;
    - (void)glfwButtonAction:(id)sender;
@end

@implementation GLFWTouchBarDelegate
    - (NSTouchBar *)makeTouchBar
    {
        // Create TouchBar object
        NSTouchBar *touchBar = [[NSTouchBar alloc] init];
        touchBar.delegate = self;
        touchBar.customizationIdentifier = touchBarCustomizationId;

        // Set the default ordering of items.
        touchBar.defaultItemIdentifiers = @[touchBarItemId, NSTouchBarItemIdentifierOtherItemsProxy];
        touchBar.customizationAllowedItemIdentifiers = @[touchBarItemId];
        touchBar.principalItemIdentifier = touchBarItemId;

        return touchBar;
    }

    - (NSTouchBarItem *)touchBar:(NSTouchBar *)touchBar makeItemForIdentifier:(NSTouchBarItemIdentifier)identifier
    {
        if ([identifier isEqualToString:touchBarItemId])
        {
            NSButton *button = [NSButton buttonWithTitle:NSLocalizedString(@"GLFW Rules", @"") target:self action:@selector(glfwButtonAction:)];

            NSCustomTouchBarItem* g_TouchBarItem = [[NSCustomTouchBarItem alloc] initWithIdentifier:touchBarItemId];
            g_TouchBarItem.view = button;
            g_TouchBarItem.customizationLabel = NSLocalizedString(@"Truth Button", @"");

            return g_TouchBarItem;
        }

        return nil;
    }

    - (void)glfwButtonAction:(id)sender
    {
        NSLog(@"The 'GLFW Rules' button was pressed!");
    }
@end

// Call this from your C++ side:
GLFWTouchBarDelegate* g_TouchBarDelegate = NULL;
void ShowTouchBar()
{
    if (!g_TouchBarDelegate) {
        g_TouchBarDelegate = [[GLFWTouchBarDelegate alloc] init];
        [NSApplication sharedApplication].automaticCustomizeTouchBarMenuItemEnabled = YES;
    }

    NSTouchBar* touchBar = [g_TouchBarDelegate makeTouchBar];

    NSWindow* nswin = glfwGetCocoaWindow(window);
    nswin.touchBar = touchBar;
    // If not using GLFW or unknown NSWindow*:
    /*
    // Somehow I needed to loop over `windows` here,
    // not sure why, but `mainWindow` did not work, oh well.
    NSArray<NSWindow*>* windows = [NSApplication sharedApplication].windows;
    for (int i = 0; i < windows.count; ++i) {
        NSWindow* wnd = windows[i];
        wnd.touchBar = touchBar;
    }
    */
}
{% endhighlight %}

This will create a touchbar with one button, displaying "*GLFW Rules*", when `ShowTouchBar()` is called.

In the example I'm using GLFW, but it is also possible to uncomment the last part to get it working with other frameworks that does not supply the active `NSWindow*`.

Here is a quick screenshot of the result of the example code above:

![TouchBar showing the GLFW Rules button.](/static/posts/2017-01-07-glfw-button.png "TouchBar showing the GLFW Rules button.")
