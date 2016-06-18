Template.MemberFarmSettingGeneral.events({
    'blur [name=farm_url]': function(e){

        var objExampleUrl = document.getElementById('exampleUrl');
        var farmUrl = document.getElementsByName('farm_url')[0].value.trim();

        Meteor.call( 'checkExistsFarmUrl', farmUrl, function(err, result) {
            // check in server: farm url already exists
            // if exists return true
            // else return false
            if( result ) {

                objExampleUrl.setAttribute('class','text-danger');
                objExampleUrl.innerHTML = 'มีฟาร์มอื่นใช้ชื่อ Url นี้แล้ว';

            } else {

                farmUrl = 'http://catland.online/@' + farmUrl;
                objExampleUrl.removeAttribute('class');
                objExampleUrl.innerHTML = farmUrl;

            }
        } );     

    }
});