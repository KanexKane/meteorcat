// use login in router_member.js

var last_cat_title = " | Cat Land Farm";

CatMemberFarmCatController = RouteController.extend({
  layoutTemplate: 'LayoutMemberFarm',
   waitOn: function(){
    return [
      Meteor.subscribe('farmDetail')
    ];
  },
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
      Meteor.subscribe('cats'),
      Meteor.subscribe('catColors'),
      Meteor.subscribe('catBreeds')
    ];
  },
});
Router.route('/myfarm/cats/edit/:_id', {
  name: "CatMemberFarmCatEdit",
  controller: CatMemberFarmCatController,
  waitOn: function(){
    return [
      Meteor.subscribe('catDetail', this.params._id),
      Meteor.subscribe('catColors'),
      Meteor.subscribe('catBreeds')
    ];
  },
  data: function(){
    // ที่ใช้แค่นี้ไม่ต้องหาด้วย farm id อีก เพราะกรองมาตั้งแต่ขั้นตอน waitOn แล้ว
    return Cats.findOne({ _id: this.params._id});
  }
});
