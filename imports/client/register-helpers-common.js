// Template.registerHelper('activeRouteClass', function() {
// });

Template.registerHelper('activeRouteClass', function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
        return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
});

Template.registerHelper('errorMessageSession', function(sessionName, sessionField) {
    return Session.get(sessionName)[sessionField];
});
Template.registerHelper('errorClassSession', function(sessionName, sessionField) {
    return !!Session.get(sessionName)[sessionField] ? 'has-error' : '';
});