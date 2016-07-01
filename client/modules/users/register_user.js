Template.RegisterUser.events({
    'submit #register-form': function(e, t) {

        e.preventDefault();

        var email = t.find('#account-email').value.trim()
        , password = t.find('#account-password').value
        , username = t.find('#account-username').value.trim();

        var data = {};
        data.username = username;
        data.password = password;
        data.email = email;

        Meteor.call('manualCreateUser', data, function (error, result) {
            if ( error ) {
                console.log( error );
            }

            Meteor.loginWithPassword(username, password, function() {
                Meteor.call('addUserToRoles', Meteor.userId(), 'user', 'user-group', function(err, result) {
                    Router.go('home');
                });
            });

        });

    return false;

 }
});
