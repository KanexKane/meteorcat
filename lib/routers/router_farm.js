// use login in router_member.js

var last_farm_title = " | Cat Land Farm";

CatMemberFarmController = RouteController.extend({
  layoutTemplate: 'LayoutMemberFarm',
  onBeforeAction: function(){
    if(!Meteor.userId()){
      Router.go('CatMemberLogin');
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) {
      return;
    }
    var title = this.route.options.title ? this.route.options.title : "Home";
    
    SEO.set({
      title: title + last_farm_title,
    });
  }
});

// หน้าแรกจัดการฟาร์มของเรา
Router.route('/myfarm/', {
  name: "CatMemberFarmHome",
  controller: CatMemberFarmController
});
// จัดการแมวของฟาร์มเรา
Router.route('/myfarm/cats/', {
  name: "CatMemberFarmCats",
  controller: CatMemberFarmController
});
// แก้ไขข้อมูลทั่วไปของฟาร์ม [ชื่อ, url, คำอธิบาย, โลโก้, หน้าปก, editor header]
Router.route('/myfarm/settings/general', {
  name: "CatMemberFarmSettingGeneral",
  controller: CatMemberFarmController,
  waitOn: function(){
    return Meteor.subscribe('farmDetail');
  },
  data: function(){
    return Farms.findOne({ farm_user_id: Meteor.userId() });
  }
});
// แก้ไขข้อมูลการติดต่อ [เบอร์มือถือ, Line, Facebook, Instagram, Link แผนที่, editor contact us ]
Router.route('/myfarm/settings/contactus', {
  name: "CatMemberFarmSettingContactUs",
  controller: CatMemberFarmController
});
// แก้ไขข้อมูลโปรโมชั่น
Router.route('/myfarm/settings/promotion', {
  name: "CatMemberFarmSettingPromotion",
  controller: CatMemberFarmController
});