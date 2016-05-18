Template.CatMemberLogin.onCreated(function(){
    Session.set('catMemberLoginErrors', '');
});

Template.CatMemberLogin.helpers({
    errorMessage: function(){return Session.get('catMemberLoginErrors')}
})

Template.CatMemberLogin.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginUsername.value;
        var passwordVar = event.target.loginPassword.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(){
            if(Meteor.user()){
                Router.go('CatMemberFarmHome');
                // get farm id set to session
                var farms = Farms.findOne({ farm_user_id: Meteor.userId() });
                Session.set('myfarm_id', farms._id);
            }else{
                Session.set('catMemberLoginErrors', 'ไม่สามารถเข้าสู่ระบบได้');
            }            
        });
    }
});