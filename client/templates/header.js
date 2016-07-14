import '/imports/client/register-helpers-common.js';

Template.header.onCreated(function() {
    if (Meteor.userId()) {
        // ลองหาดูก่อนว่ามีการ subscribe Farms อยู่หรือเปล่า
        // ถ้าไม่มีจะทำการ subscribe
        var farmCount = Farms.find().count();
        if ( farmCount == 0 ) { 
            var self = this;
            self.autorun(function() {
                self.subscribe('farmInfoByUserId', Meteor.userId());
            });
        }
    }
});

Template.header.helpers({
    noFarm: function () {
        if ( Roles.userIsInRole(Meteor.userId(), 'farm', 'user-group') ) {
            return false;
        } else {
            return true;
        }
    }
});

Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
    farmUrl() {
        if( Meteor.userId() ) {

            var farm = Farms.findOne({ farm_user_id: Meteor.userId() });

            if( !!farm  ) {
                return farm.farm_url;
            }
            
        } 
        
    },
    farmName() {
        if( Meteor.userId() ) {
            
            var farm = Farms.findOne({ farm_user_id: Meteor.userId() });

            if ( !!farm  ) {
                return farm.farm_name;
            }
            
        } 
    }
});