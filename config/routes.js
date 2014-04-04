module.exports = [
    // The main view
    // It is a read only view
    {
        id: 'home',
        url: '/',
        controller: '@website.controllers.Home',
        action: 'index'
    },

    // The admin view
    {
        id: 'admin',
        url: '/admin',
        controller: '@website.controllers.Home',
        action: 'admin'
    },

    // The archives
    {
        id: 'archives',
        url: '/archives',
        controller: '@website.controllers.Archive',
        action: 'index'
    },
    {
        id: 'archiveDay',
        url: '/archives/:date',
        controller: '@website.controllers.Archive',
        action: 'day'
    },



    {
        id: 'lastSnapshot',
        url: '/lastSnapshot.jpg',
        controller: '@website.controllers.Home',
        action: 'lastSnapshot'
    },
    {
        id: 'lastSnapshotNoCache',
        url: '/lastSnapshot.jpg/:time',
        controller: '@website.controllers.Home',
        action: 'lastSnapshot'
    },
    {
        id: 'actionGoto',
        url: '/action/:id/:value',
        controller: '@website.controllers.Home',
        action: 'action'
    },
    {
        id: 'action',
        url: '/action/:id',
        controller: '@website.controllers.Home',
        action: 'action'
    },
    {
        id: 'config',
        url: '/config/:name',
        controller: '@website.controllers.Home',
        action: 'config'
    },




];

