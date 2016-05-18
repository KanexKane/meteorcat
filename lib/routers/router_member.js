var last_member_title = " | Cat Member";

Router.route('/catmember/login', {
  name: "CatMemberLogin",
  layoutTemplate: '',
  waitOn: function(){
    return Meteor.subscribe('farmsList');
  },
  onBeforeAction: function(){
    // ถ้า Login อยู่แล้วให้ไปที่
    if(Meteor.userId()){
      Router.go("CatMemberFarmHome");
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) { return; }

    var title = 'Member Login';
    
    SEO.set({
      title: title + last_admin_title,
    });
  }
});