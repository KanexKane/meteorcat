BlogPosts = new Mongo.Collection('blog_posts');
BlogCategories = new Mongo.Collection('blog_categories');

BlogPosts.allow({
    update: function(userId, post){ return ownsDocument(userId, post); },
    remove: function(userId, post){ return ownsDocument(userId, post); }
});

BlogPosts.deny({
    update: function(userId, post, fieldNames, modifier){
        var erros = validatePost(modifier.$set);
        return errors.title || errors.url;
    }
});

Meteor.methods({
    blogPostInsert: function(postAttributes){
        check(Meteor.userId(), String);
        check(postAttributes, {
            post_title: String,
            post_slug: String,
            post_categories: String,
            post_content: String
        });

        var errors = validatePost(postAttributes);
        if(errors){
            errors.forEach( function(element, index) {
                throw throwError(element);
            });
            
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore 
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var post = _.extend(postAttributes, {
            post_author_userid: user._id,
            post_author: user.username,
            post_date: new Date()
        });

        var postId = BlogPosts.insert(post);
        return {
            _id: postId
        };
    }
});

validatePost = function(post){
    var errors = {};

    if(!post.title){
        errors.title = "Please fill in a headline";
    }
    if(!post.url){
        errors.url = "Please fill in a URL";
    }
    return errors;
}

Images = new FS.Collection("images", {
  //stores: [new FS.Store.FileSystem("images", {path: "/Applications/mamp/htdocs/meteorcat/public/uploads/"})]
  stores: [new FS.Store.FileSystem("images", {path: "~/public/uploads/"})]
});

Images.allow({
  insert: function() {
    return true;
  },
  download: function(userId, fileObj){
    return true;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }

});