Meteor.startup(function () {
    if (Meteor.isClient) {
        SEO.config({
            title: 'Cat Land',
            meta: {
                'description': 'Cat Land อาณาจักรแห่งแมว ดินแดนสวรรค์ของบรรดาทาส'
            }
        });
        $('head').append("<meta property='fb:pages' content='238710326317325'>");
    }
});

Router.configure({
    defaultBreadcrumbTitle: 'Home',
    defaultBreadcrumbLastLink: true,
    loadingTemplate: 'loading',
});

if (Meteor.isClient) {
    Accounts.onLogout(function() {
        Router.go('home');
    });
}