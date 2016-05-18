Meteor.publish(null, function (){
  return Meteor.roles.find({})
});

Meteor.publish('notifications', function(){
    return Notifications.find({ user_id: this.userId, read: false});
});

Meteor.publish('blogs', function(){
    return BlogPosts.find({});
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

//==============================
// Farm & Cat
//==============================

Meteor.publish('farmsList', function(){
    return Farms.find({ });
});
Meteor.publish('farmDetail', function(){
    return Farms.find({ farm_user_id: this.userId });
});
Meteor.publish('catsInfarm', function(_id){
    return Cats.find({ farm_id: _id });
});
Meteor.publish('cats', function(_id){
    //  เอาเฉพาะของฟาร์มเรา
    var farms = Farms.findOne({ farm_user_id: this.userId });
    return Cats.find({farm_id: farms._id });
});
Meteor.publish('catDetail', function(_id){
    var farms = Farms.findOne({ farm_user_id: this.userId });
    return Cats.find({ _id: _id, farm_id: farms._id });
});
Meteor.publish('catColors', function(){
    return CatColors.find({});
});
Meteor.publish('catBreeds', function(){
    return CatBreeds.find({}, {sort: {breed_name: 1}});
});