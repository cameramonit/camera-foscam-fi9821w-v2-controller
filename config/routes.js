module.exports = [
    {
        id: 'home',
        url: '/',
        controller: '@website.controllers.Home',
        action: 'index'
    },
    {
        id: 'control',
        url: '/control',
        controller: '@website.controllers.Home',
        action: 'control'
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



];

