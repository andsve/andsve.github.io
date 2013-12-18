---
layout: page
title: Articles
---
<ul class="articles">
{% for post in site.posts %}
<li><h3><a href="{{ post.url }}">{{ post.title }}</a></h3></li>
{% endfor %}
</ul>