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
                <div id="screen">
                    <img id="snapshot" src="/lastSnapshot.jpg" alt="" width="100%" height="100%"/>

                    <div id="presets" data-role="navbar">
                        <ul>
                            {% for preset in presets %}
                            <li><a href="#" data-preset="{{ preset }}">{{ preset }}</a></li>
                            {% endfor %}
                        </ul>
                    </div>

                    <div id="type" data-role="navbar">
                        <ul>
                            <li><a href="#" data-type="0">HD</a></li>
                            <li><a href="#" data-type="3">LD</a></li>
                        </ul>
                    </div>

                    <div id="directions">
                        <button id="control-up" data-icon="arrow-u" data-iconpos="notext">Haut</button>
                        <button id="control-right" data-icon="arrow-r" data-iconpos="notext">Droite</button>
                        <button id="control-down" data-icon="arrow-d" data-iconpos="notext">Bas</button>
                        <button id="control-left" data-icon="arrow-l" data-iconpos="notext">Gauche</button>
                    </div>
                </div>
            </div>
        </article>



        {% for url in javascript('default') %}
            <script type="text/javascript" src="{{ url }}"></script>
        {% endfor %}
    </body>
</html>
