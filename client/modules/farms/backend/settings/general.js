Template.MemberFarmSettingGeneral.events({
    'keyup [name=farm_url]': function(e){
        var farmUrl = document.getElementsByName('farm_url')[0].value;
        farmUrl = 'http://catland.online/@' + farmUrl;
        document.getElementById('exampleUrl').innerHTML = farmUrl;
    }
});