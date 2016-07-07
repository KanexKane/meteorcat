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
Meteor.publish('blogInCategory', function(category_slug){
    var category_id = BlogCategories.findOne({ category_slug: category_slug})._id;
    return BlogPosts.find({ post_category: category_id });
});
Meteor.publish('blogInCategoryByPostSlug', function( slug ){
    var post = BlogPosts.findOne( { post_slug: slug });
    return BlogPosts.find({ post_category: post.post_category });
});
Meteor.publish('categories', function(category_slug){
    if(category_slug){
        return BlogCategories.find({ category_slug: category_slug });
    } else {
        return BlogCategories.find({});
    }
});

Meteor.publish('comments', function ( findOptions ) {
    check( findOptions, {
        sort: Object,
        limit: Number
    });

    return BlogComments.find({}, findOptions);
});