Meteor.publish(null, function (){
  return Meteor.roles.find({})
});

Meteor.publish('notifications', function(){
    return Notifications.find({ user_id: this.userId, read: false});
});

Meteor.publish('blogs', function(findOptions){
    return BlogPosts.find({}, findOptions);
});
Meteor.publish('blogDetail', function(_id){
    check(_id, String);
    return BlogPosts.find({_id: _id});
});
Meteor.publish('blogCategoryDetail', function(_id){
    check(_id, String);
    return BlogCategories.find({_id: _id});
});
Meteor.publish('blogDetailBySlug', function(post_slug){
    check(post_slug, String);
    return BlogPosts.find({post_slug: post_slug});
});

Meteor.publish('categories', function(){
    return BlogCategories.find({});
});

Meteor.publish('blogimages', function(){
    return BlogImages.find({});
});

//==================================================
// Farm
//==================================================

// ฟาร์มทั้งหมด
Meteor.publish('allFarms', function(){
    return Farms.find({ });
});
// รายละเอียดฟาร์ม หาโดยใช้ userId
Meteor.publish('farmInfoByUserId', function(userId){
    return Farms.find({ farm_user_id: userId });
});
// รายละเอียดฟาร์ม หาโดยใช้ farm_url
Meteor.publish('farmInfoByUrl', function(farm_url){
    return Farms.find({ farm_url: farm_url });
});
// แมวทั้งหมดในฟาร์ม หาโดยใช้ farm_url
Meteor.publish('allCatsInFarmByUrl', function(farm_url){
    var farm;
    if(farm_url !== undefined){
        farm = Farms.findOne({ farm_url: farm_url });
    }else{
        farm = Farms.findOne({ farm_user_id: this.userId });
    }
    return Cats.find({ farm_id: farm._id });
});
// แมวทั้งหมดในฟาร์ม หาโดยใช้ farm_id
Meteor.publish('allCatsInFarmById', function(farm_id){
    return Cats.find({ farm_id: farm._id });
});
// แมวทั้งหมดในฟาร์ม หาโดยใช้ user_id
Meteor.publish('allCatsInFarmByUserId', function(userId){
    var farms = Farms.findOne({ farm_user_id: userId });
    return Cats.find({farm_id: farms._id });
});
// รายละเอียดแมว หาโดยใช้ id
Meteor.publish('catDetailById', function(_id){
    return Cats.find({ _id: _id });
});
// สีของแมวทั้งหมด
Meteor.publish('allCatColors', function(){
    return CatColors.find({});
});
// สายพันธุ์ของแมวทั้งหมด
Meteor.publish('allCatBreeds', function(){
    return CatBreeds.find({}, {sort: {breed_name: 1}});
});
