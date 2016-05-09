// // posts list กำหนดค่าว่าแสดงจำนวนเท่าไหร่ sort ด้วยอะไร
// Meteor.publish('posts', function(options){
//     check(options, {
//         sort: Object,
//         limit: Number
//     });
//     return Posts.find({}, options);
// });
// // ย้ายหน้า single page มาใช้อันนี้แทนเพราะถ้าใช้อันบนมันก็ Error
// Meteor.publish('singlePost', function(id){
//     check(id, String);
//     return Posts.find(id);
// });

// Meteor.publish('comments', function(postId){
//     check(postId, String);
//     return Comments.find({postId: postId});
// });

Meteor.publish('notifications', function(){
    return Notifications.find({ userId: this.userId, read: false});
});

Meteor.publish('blogs', function(){
    return BlogPosts.find({});
});
Meteor.publish('blogDetail', function(_id){
    check(_id, String);
    return BlogPosts.find({_id: _id});
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