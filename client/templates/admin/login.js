Template.CatAdminLogin.onCreated(function(){
    Session.set('catAdminLoginErrors', '');
});

Template.CatAdminLogin.helpers({
    errorMessage: function(){return Session.get('catAdminLoginErrors')}
});

Template.CatAdminLogin.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginUsername.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(){
            if(Meteor.user()){
                Router.go('AdminHome');
            }else{
                Session.set('catAdminLoginErrors', 'ไม่สามารถเข้าสู่ระบบได้');
            }
        });
    }
});
