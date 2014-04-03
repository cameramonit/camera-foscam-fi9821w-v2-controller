<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

        <title>Camera 1</title>

        {% for url in stylesheet('default') %}
            <link rel="stylesheet" type="text/css" href="{{ url }}"/>
        {% endfor %}
    </head>
    <body>
        <article data-role="page" data-theme="b">
            <div data-role="content">
                <img src="/lastSnapshot.jpg" alt="" width="100%"/>
            </div>
        </article>

    </body>
</html>
