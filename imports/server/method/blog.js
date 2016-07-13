Meteor.methods({

    duplicatePostSlugStateCreate: function( postSlug ) {
        var counter = BlogPosts.find( { post_slug: postSlug } ).count();
        return counter > 0;
    },
    duplicatePostSlugStateEdit: function( id, postSlug ) {
        var counter = BlogPosts.find( 
                                    { 
                                        _id: {
                                            $ne: id
                                        },
                                        post_slug: postSlug 
                                    }
                                    ).count();
        return counter > 0;
    },
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
            post_content: String,
            post_featured_image: String
        });

        // ถ้าไม่มีฟิลด์ post_featured_image ให้เอาฟิลด์นี้ออกจาก object
        if(postAttributes.post_featured_image === ''){
            postAttributes = _.omit(postAttributes, 'post_featured_image');
        }

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
        BlogPosts.remove(_id);
    },
    duplicateCategorySlugStateCreate: function( categorySlug ) {
        var counter = BlogCategories.find( { category_slug: categorySlug } ).count();
        return counter > 0;
    },
    duplicateCategorySlugStateEdit: function( id, categorySlug ) {
        var counter = BlogCategories.find( 
                                    { 
                                        _id: {
                                            $ne: id
                                        },
                                        category_slug: categorySlug 
                                    }
                                    ).count();
        return counter > 0;
    },
    blogCategoryCreate: function(categoryAttributes){
        check(Meteor.userId(), String);
        check(categoryAttributes, {
            category_name: String,
            category_slug: String
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
            category_slug: String
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
        BlogCategories.remove(_id);
    },
    updateViewBlog: function ( id ) {
        check( id, String );
        BlogPosts.update( { _id: id }, { $inc: { views: 1 } } );
    },
    commentInsert: function(commentAttributes) {
        check(commentAttributes, {
          post_id: String,
          body: String,
          author: String,
        });

        var post = BlogPosts.findOne(commentAttributes.post_id);
        
        var clientIp = this.connection.clientAddress;

        var comment = {
            post_id: commentAttributes.post_id,
            created_at: new Date(),
            ip: clientIp,
            comment_message: commentAttributes.body,
            comment_author: commentAttributes.author,

        };

        if (!post)
          throw new Meteor.Error('invalid-comment', 'You must comment on a post');

        if ( !Meteor.user() ) {
            comment = _.extend(comment, {
                comment_author_id: 'not register user',
            });
        } else {
            comment = _.extend(comment, {
                comment_author_id: Meteor.userId(),
            });
        }

        // create the comment, save the id
        comment._id = BlogComments.insert(comment);

        // update the post with the number of comments
        // หรือก็คือ commentsCount++
        BlogPosts.update(comment.post_id, { $inc: { commentsCount: 1 } });

        // now create a notification, informing the user that there's been a comment
        //createCommentNotification(comment);

        return comment._id;
    },

});