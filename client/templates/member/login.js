Template.MemberLogin.onCreated(function(){
    Session.set('MemberLoginErrors', '');
});

Template.MemberLogin.helpers({
    errorMessage: function(){return Session.get('MemberLoginErrors')}
})

Template.MemberLogin.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginUsername.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(){
            if(Meteor.user()){
                Router.go('MemberFarmHome');
            }else{
                Session.set('MemberLoginErrors', 'ไม่สามารถเข้าสู่ระบบได้');
            }
        });
    }
});
