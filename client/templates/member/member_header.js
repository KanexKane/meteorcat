Template.MemberHeader.helpers({
   openFarm() {
       return !!Farms.findOne({ farm_user_id: Meteor.userId() });
   }
});