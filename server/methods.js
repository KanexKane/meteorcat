//===================
// Methods for Roles
//===================

//Roles.addUsersToRoles(userid, [], 'default-group');
//Roles.setUserRoles(userid, [], 'default-group')

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
    catDelete: function(_id){
        check(_id, String);
        Cats.remove(_id);
    },
    catBreedCreate: function(breedAttributes){
        check(Meteor.userId(), String);
        check(breedAttributes, {
            breed_name: String,
            breed_thai_name: String
        });

        var errors = validateBreed(breedAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catBreedErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var breed = _.extend(breedAttributes, {
            breed_slug: breedAttributes.breed_name.replace(/\s+/g, '-').toLowerCase(),
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var breedId = CatBreeds.insert(breed);
        return {
            _id: breedId
        };
    },
    catBreedEdit: function(breedAttributes, _id) {
        check(Meteor.userId(), String);
        check(_id, String);
        check(breedAttributes, {
            breed_name: String,
            breed_thai_name: String
        });

        var errors = validateBreed(breedAttributes);
        if (!_.isEmpty(errors)) {
            return Session.set('catBreedErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var breed = _.extend(breedAttributes, {
            breed_slug: breedAttributes.breed_name.replace(/\s+/g, '-').toLowerCase(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        CatBreeds.update(_id, {$set: breed});
        return {
            _id: _id
        };
    },
    catBreedDelete: function(_id){
        check(_id, String);
        CatBreeds.remove(_id);
    },
    catColorCreate: function(colorAttributes){
        check(Meteor.userId(), String);
        check(colorAttributes, {
            color_name: String
        });

        var errors = validateColor(colorAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var color = _.extend(colorAttributes, {
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var colorId = CatColors.insert(color);
        return {
            _id: colorId
        };
    },
    catColorEdit: function(colorAttributes, _id){
        check(Meteor.userId(), String);
        check(_id, String);
        check(colorAttributes, {
            color_name: String
        });

        var errors = validateColor(colorAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var color = _.extend(colorAttributes, {
            update_by_user_id: user._id,
            update_at: new Date()
        });

        CatColors.update(_id, { $set: color });
        return {
            _id: _id
        };
    },
    catColorDelete: function(_id){
        check(_id, String);
        CatColors.remove(_id);
    },
    addUserToRoles: function( userId, roleName, groupName ) {
        Roles.addUsersToRoles(userId, roleName, groupName);
    }
});