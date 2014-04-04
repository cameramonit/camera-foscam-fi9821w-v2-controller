<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Camera 1</title>

        {% for url in stylesheet('default') %}
            <link rel="stylesheet" type="text/css" href="{{ url }}"/>
        {% endfor %}
    </head>
    <body>
        <article data-role="page" data-theme="b">
            <div data-role="content">
                <a href="/"><img src="/lastSnapshot.jpg/{{ random }}" alt="" width="100%"/></a>
            </div>
        </article>

    </body>
</html>
