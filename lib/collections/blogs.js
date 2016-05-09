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
    blogCreate: function(postAttributes){
        check(Meteor.userId(), String);
        check(postAttributes, {
            post_title: String,
            post_slug: String,
            post_category: String,
            post_content: String,
            post_featured_image: String
        });

        var errors = validatePost(postAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('blogCreateErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore 
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var post = _.extend(postAttributes, {
            post_author_id: user._id,
            post_author: user.username,
            post_date: new Date(),
            post_update_author_id: user._id,
            post_update_author: user.username,
            post_update: new Date()
        });

        var blogId = BlogPosts.insert(post);
        return {
            _id: blogId
        };
    },
    blogEdit: function(postAttributes, _id){
        check(Meteor.userId(), String);
        check(_id, String);
        check(postAttributes, {
            post_title: String,
            post_slug: String,
            post_category: String,
            post_content: String
        });

        var errors = validatePost(postAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('blogEditErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore 
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var post = _.extend(postAttributes, {
            post_update_author_id: user._id,
            post_update_author: user.username,
            post_update: new Date()
        });

        BlogPosts.update(_id, { $set: post });
        
        return {
            _id: _id
        };
    },
    blogDelete: function(_id){
        check(_id, String);
        BlogPosts.remove(currentPostId);
    },
    blogCategoryCreate: function(categoryAttributes){
        check(Meteor.userId(), String);
        check(categoryAttributes, {
            category_name: String,
            category_slug: String,
        });

        var errors = validateCategory(categoryAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('blogCategoryCreateErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore 
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var category = _.extend(categoryAttributes, {
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var categoryId = BlogCategories.insert(category);
        return {
            _id: categoryId
        };
    },
    blogCategoryEdit: function(categoryAttributes, _id){
        check(Meteor.userId(), String);
        check(_id, String);
        check(categoryAttributes, {
            category_name: String,
            category_slug: String,
        });

        var errors = validateCategory(categoryAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('blogCategoryEditErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore 
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var category = _.extend(categoryAttributes, {
            update_by_user_id: user._id,
            update_at: new Date()
        });

        BlogCategories.update(_id, { $set: category });
        return {
            _id: _id
        };
    },
    blogCategoryDelete: function(_id){
        check(_id, String);
        BlogCategories.remove(currentPostId);
    },
});

validatePost = function(post){
    var errors = {};

    if(!post.post_title){
        errors.post_title = "กรอกชื่อหัวข้อ";
    }

    return errors;
}
validateCategory = function(category){
    var errors = {};

    if(!category.category_name){
        errors.category_name = "กรอกชื่อหมวดหมู่";
    }

    return errors;
}

BlogImages = new FS.Collection("blogimages", {
  //stores: [new FS.Store.FileSystem("images", {path: "/Applications/mamp/htdocs/meteorcat/public/uploads/"})]
  stores: [new FS.Store.FileSystem("images", {path: "~/public/uploads/blogs/"})]
});

BlogImages.allow({
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

findArrayData = function(arrays, match, key){
    var name = "";
    arrays.forEach( function(element, index) {
        if(element._id === match){
            name = element[key];
        }
    });
    return name;
}

findCategorySlug = function(post_category){
    return findArrayData(Template.instance().data.categories, post_category, 'category_slug');
}