var last_admin_title = " | Cat Admin";

Router.route('/catadmin/login', {
  name: "CatAdminLogin",
  layoutTemplate: '',
  onBeforeAction: function(){
    // ถ้า Login อยู่แล้วให้ไปที่
    if(Meteor.userId()){
      Router.go("CatAdminHome");
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) { return; }

    var title = 'Administrator Login';
    
    SEO.set({
      title: title + last_admin_title,
    });
  }
});

CatAdminController = RouteController.extend({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  layoutTemplate: 'LayoutAdmin',
  onBeforeAction: function(){
    if(!Meteor.userId()){
      Router.go('CatAdminLogin');
    }else{
      // ถ้า Login อยู่แล้วไม่ใช่ Admin
      if(!Roles.userIsInRole(Meteor.userId(), 'admin', 'admin-group')){
        Router.go('home');
      }
    }

    this.next();
  },
  onAfterAction: function() {
    if(typeof this.data !== 'function' || !this.data().post){
      if (!Meteor.isClient) {
        return;
      }
      var title = this.route.options.title ? this.route.options.title : "Home";
      
      SEO.set({
        title: title + last_admin_title,
      });
    }
  }
});
CatAdminBlogController = CatAdminController.extend({
  waitOn: function(){
    return [
      Meteor.subscribe('categories'),
      Meteor.subscribe('blogimages')
    ];
  }
});
CatAdminBlogCategoryController = CatAdminController.extend({
  waitOn: function(){
    return [
      Meteor.subscribe('categories')
    ];
  },
  data: function(){
    return {
      categories: BlogCategories.find({})
    }
  }
});

Router.route('/catadmin/', {  
  name: "CatAdminHome",
  controller: CatAdminController
});

Router.route('/catadmin/blogs/create', {
  name: 'CatAdminBlogCreate',
  controller: CatAdminBlogController,
  title: 'Create Blog'
});
Router.route('/catadmin/blogs/edit/:_id', {
  name: 'CatAdminBlogEdit',
  title: 'Edit Blog',
  controller: CatAdminBlogController,
  waitOn: function(){
    return [
      Meteor.subscribe('blogDetail', this.params._id)
    ];
  },
  data: function(){
    return { 
        post: BlogPosts.findOne(this.params._id),
        categories: BlogCategories.find({})
    };
  }
});
Router.route('/catadmin/blogs/list/', {
  name: 'CatAdminBlogList',
  controller: CatAdminBlogController,
  title: 'Blogs',
  waitOn: function(){
    return [
      Meteor.subscribe('blogs')
    ];
  },
  data: function(){
    return { 
        posts: BlogPosts.find({},{ sort: {post_date: -1 } }),
        categories: BlogCategories.find({})
    };
  }
});

Router.route('/catadmin/blogs/categories/list', {
  name: 'CatAdminBlogCategoryList',
  controller: CatAdminBlogCategoryController,
  title: 'Categories'
});
Router.route('/catadmin/blogs/categories/create', {
  name: 'CatAdminBlogCategoryCreate',
  controller: CatAdminBlogCategoryController,
  title: 'Create Category'
});
Router.route('/catadmin/blogs/categories/edit/:_id', {
  name: 'CatAdminBlogCategoryEdit',
  controller: CatAdminBlogCategoryController,
  title: 'Edit Category',
  data: function(){
    return BlogCategories.findOne(this.params._id);
  }
});