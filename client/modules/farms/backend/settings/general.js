Template.MemberFarmSettingGeneral.events({
    'keyup [name=farm_url]': function(e){
        var farmUrl = document.getElementsByName('farm_url')[0].value;
        document.getElementById('exampleUrl').innerHTML = farmUrl;
    }
});
