Template.RegisterFarm.events({
    'keyup [name=farm_url]': function(e){
        var objExampleUrl = document.getElementById('exampleUrl');
        var farmUrl = document.getElementsByName('farm_url')[0].value.trim();

        var farm = Farms.findOne( { farm_url: farmUrl } );

        if( !!farm ) {
            objExampleUrl.setAttribute('class','text-danger');
            objExampleUrl.innerHTML = 'มีฟาร์มอื่นใช้ชื่อ Url นี้แล้ว';
        } else {
            farmUrl = 'http://catland.online/@' + farmUrl;
            objExampleUrl.removeAttribute('class');
            objExampleUrl.innerHTML = farmUrl;
        }
    },

});

AutoForm.addHooks('insertProfileFarm', {
    onSuccess: function() {
        Meteor.call('addUserToRoles', Meteor.userId(), 'farm', 'user-group', function(err, result) {
            Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
            Router.go('MemberFarmHome');
        });

    }
});