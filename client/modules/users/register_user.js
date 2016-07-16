import '/imports/client/register-helpers-common';
Template.RegisterUser.onCreated(function() {
    Session.set('userRegisterErrors', {});
});
Template.RegisterUser.events({
    'submit form': function(e) {

        e.preventDefault();

        var email = $.trim($(e.target).find('#account-email').val())
        , password = $(e.target).find('#account-password').val()
        , username = $.trim($(e.target).find('#account-username').val());

        var errors = {};
        if ( email == '' ) {
            errors.email = 'กรอกอีเมล';
        }
        if ( username == '' ) {
            errors.username = 'กรอก Username';
        }
        if ( password == '' ) {
            errors.password = 'กรอก Password';
        }

        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('userRegisterErrors', errors);
        }

        var data = {};
        data.username = username;
        data.password = password;
        data.email = email;
        
        Meteor.call('manualCreateUser', data, function (error, result) {
            if ( error ) {
                return false;
            } 
            Meteor.loginWithPassword(username, password, function() {
                Meteor.call('addUserToRoles', Meteor.userId(), 'user', 'user-group', function(err, result) {
                    if ( error ) {
                        return false;
                    } 

                    Router.go('home');
                });
            });

        });

    return false;

 }
});
