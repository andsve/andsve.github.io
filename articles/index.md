---
layout: page
title: Articles
---

{% for post in site.posts %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
{% endfor %}
