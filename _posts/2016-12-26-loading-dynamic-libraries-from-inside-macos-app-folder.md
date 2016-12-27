---
layout: three_post
title: Loading dynamic libraries from inside macOS .app-folders
comments: true
tags: osx macos defold luajit ffi dylib
---
Having trouble loading your dynamic libraries from inside an app-folder on macOS? Tried setting both `DYLD_LIBRARY_PATH` and `DYLD_FALLBACK_LIBRARY_PATH` through scripts without success? So did I, and here is how I managed to solve it:

Copy the library next to the binary inside the app-folder:
{% highlight shell %}
$ ls
Example.app libexample.dylib
$ cp libexample.dylib Example.app/Contents/MacOS/
{% endhighlight %}

Then add a `rpath` to the binary pointing to `@loader_path/.`:
{% highlight shell %}
$ install_name_tool -add_rpath @loader_path/. Example.app/Contents/MacOS/Example
{% endhighlight %}

