BlogPosts = new Mongo.Collection('blog_posts');
BlogCategories = new Mongo.Collection('blog_categories');

//===============================================
// Tabular Tables
//===============================================

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.AdminBlogCategories = new Tabular.Table({
    name: "AdminBlogCategories",
    collection: BlogCategories,
    columns: [
        {data: 'category_name', title: 'Category Name'},
        {data: 'category_slug',title: 'Category Slug'},
        {data: "editDelete()", title: ''}
    ]
});
BlogCategories.helpers({
    editDelete: function () {
        var pathEdit = Router.routes.CatAdminBlogCategoryEdit.path({_id: this._id});
        var text = '<a href="' + pathEdit + '" class="edit-category btn btn-success"><i class="fa fa-edit"></i></a>';
        text += ' <a href="#" data-id="' + this._id + '" class="delete-category btn btn-danger"><i class="fa fa-remove"></i></a>';
        return text;
    }
});

TabularTables.AdminBlogs = new Tabular.Table({
    name: "AdminBlogs",
    collection: BlogPosts,
    order: [[2, "desc"]],
    columns: [
        {data: 'post_title', title: 'Blog Name'},
        {data: 'post_slug', title: 'Blog Slug'},
        {
            data: 'post_date',
            title: 'สร้างเมื่อ',
            render: function(val, type, doc) {
                if (val instanceof Date) {
                  return moment(val).add('543', 'years').format('DD/MM/YYYY');
                } else {
                  return "Never";
                }
            }
        },
        {data: "editDelete()", title: ''}
    ]
});
BlogPosts.helpers({
    editDelete: function () {
        var pathEdit = Router.routes.CatAdminBlogEdit.path({_id: this._id});
        var text = '<a href="' + pathEdit + '" class="edit-blog btn btn-success"><i class="fa fa-edit"></i></a>';
        text += ' <a href="#" data-id="' + this._id + '" class="delete-blog btn btn-danger"><i class="fa fa-remove"></i></a>';
        return text;
    }
});

//===============================================
// Allow & Deny
//===============================================

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

//===============================================
// Methods
//===============================================

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
        BlogCategories.remove(_id);
    },
});

//===============================================
// Functions
//===============================================

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

//===============================================
// Collection FS
//===============================================

this.BlogImages = new FS.Collection("blogimages", {
  stores: [
    new FS.Store.GridFS("blogimages", {
      transformWrite: function(fileObj, readStream, writeStream) {
        // if (gm.isAvailable) {
        //   if (fileObj.original.type.substr(0, 5) === 'image') {
        //     return gm(readStream, fileObj.name()).autoOrient().stream().pipe(writeStream);
        //   } else {
        //     return readStream.pipe(writeStream);
        //   }
        // } else {
          return readStream.pipe(writeStream);
        // }
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
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
