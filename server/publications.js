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