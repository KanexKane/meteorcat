Template.RegisterUser.events({
   'submit #register-form': function(e, t) {

       e.preventDefault();

       var email = t.find('#account-email').value.trim()
           , password = t.find('#account-password').value
           , username = t.find('#account-username').value.trim();

       Accounts.createUser( { username: username, email: email, password : password }, function(err) {
           if (err) {
               // Inform the user that account creation failed
               console.log(err);
           } else {
               // Success. Account has been created and the user
               // has logged in successfully.

               Meteor.loginWithPassword(username, password, function() {
                   Meteor.call('addUserToRoles', Meteor.userId(), 'user', 'user-group', function(err, result) {
                       Router.go('home');
                   });
               });
           }

       });
       return false;

   }
});