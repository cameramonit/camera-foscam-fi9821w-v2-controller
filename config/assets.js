module.exports = {
    // The destination of the computed files
    destination: {
    },

    // The available files
    files: [
        '@website:resources/**/*'
    ],

    // The javascript packages
    javascripts: {
        filters: ['combine'],

        default: {
            files: [
                '@website:resources/lib/jquery-2.1.0.min.js',
                '@website:resources/lib/jquery.mobile-1.4.2.min.js',
                '@website:resources/javascripts/controller.js'
            ],
            baseUrl: '/javascripts/'
        }
    },

    // The stylesheet packages
    stylesheets: {
        // The default filters for each package
        filters: [
            '@sass.assetFilter', 'combine'
        ],

        // Package named "default"
        default: {
            // Files of the package
            files: [
                '@website:resources/lib/jquery.mobile-1.4.2.min.css',
                '@website:resources/stylesheets/style.scss'
            ]
        }
    }

};

