// use login in router_member.js

var last_cat_title = " | Cat Land Farm";

CatMemberFarmCatController = RouteController.extend({
  layoutTemplate: 'LayoutMemberFarm',
  onBeforeAction: function(){
    if(!Meteor.userId()){
      Router.go('CatMemberLogin');
    }else{
      // ถ้า Login อยู่แล้วไม่ใช่ ไม่ได้เป็นเจ้าของฟาร์ม
      // if(!Roles.userIsInRole(Meteor.userId(), 'farm', 'user-group')){
      //   Router.go('home');
      // }
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) {
      return;
    }
    var title = this.route.options.title ? this.route.options.title : "Home";
    
    SEO.set({
      title: title + last_cat_title,
    });
  }
});


Router.route('/myfarm/cats', {
  name: "CatMemberFarmCats",
  controller: CatMemberFarmCatController,
  waitOn: function(){
    return Meteor.subscribe('catsInFarm', Session.get('myfarm_id'));
  },
});
Router.route('/myfarm/cats/create', {
  name: "CatMemberFarmCatCreate",
  controller: CatMemberFarmCatController,
  waitOn: function(){
    return [
      Meteor.subscribe('farmDetail'),
      Meteor.subscribe('cats'),
      Meteor.subscribe('catColors'),
      Meteor.subscribe('catBreeds')
    ];
  },
});
