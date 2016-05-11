/**
 * ==========================================================
 * SEO config
 * ==========================================================
 */
Meteor.startup(function() {
  if(Meteor.isClient){
    return SEO.config({
      title: 'Cat Land',
      meta: {
        'description': 'Cat Land อาณาจักรแห่งแมว ดินแดนสวรรค์ของบรรดาทาส'
      },
      // og: {
      //   'image': '' 
      // }
    });
  }
});


/**
 * ==========================================================
 * Router config
 * ==========================================================
 */

Router.configure({
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function(){ 
        return Meteor.subscribe('notifications');
    }
});

/**
 * ==========================================================
 * Cat Controller
 * ==========================================================
 */

CatController = RouteController.extend({
  layoutTemplate: 'layout',
  onAfterAction: function() {
    if(typeof this.data !== 'function' || !this.data().post){
      if (!Meteor.isClient) {
        return;
      }
      var title = this.route.options.title ? this.route.options.title : "Home";
      
      SEO.set({
        title: title + ' | ' +SEO.config().title,
      });
    }
  }
});
CatBlogController = CatController.extend({
  waitOn: function(){
    return [
      Meteor.subscribe('blogs'),
      Meteor.subscribe('categories'),
      Meteor.subscribe('blogimages'),
    ];
  },
  data: function(){
    return { 
        posts: BlogPosts.find({},{ sort: {post_date: -1 } }),
        categories: BlogCategories.find({})
    };
  }
});

/**
 * ==========================================================
 * Cat not in Controller
 * ==========================================================
 */

Router.route('/', {
  name: 'home',
  controller: CatController,
  onBeforeAction: function(){
    Router.go('/blogs');  
  }
});

/**
 * ==========================================================
 * Cat Blog
 * ==========================================================
 */
Router.route('/blogs', {
  name: 'Blogs',
  controller: CatBlogController,
  title: 'Blogs'
});
Router.route('/blogs/:category/:post_slug', {
  name: "BlogDetail",
  controller: CatController,
  waitOn: function(){
      return [
          Meteor.subscribe('blogDetailBySlug', this.params.post_slug),
          Meteor.subscribe('categories'),
          Meteor.subscribe('blogimages'),
      ];
  },
  data: function(){ 
    return { 
        post: BlogPosts.findOne({post_slug: this.params.post_slug}),
        categories: BlogCategories.find({})
    };
  },
  onAfterAction: function() {
    var post;
    // The SEO object is only available on the client.
    // Return if you define your routes on the server, too.
    if (!Meteor.isClient) {
      return;
    }
    post = this.data().post;
    if(post){
      SEO.set({
        title: post.post_title + ' | ' +SEO.config().title,
        meta: {
          'description': post.post_content
        }
      });
    }
  }
});

/**
 * ========================================================================
 *                        Router Cat Administrator                                      
 * ========================================================================
 */

var last_admin_title = " | Cat Admin";

/**
 * ==========================================================
 * Cat Admin Not in Controller
 * ==========================================================
 */
Router.route('/catadmin/login', {
  name: "CatAdminLogin",
  layoutTemplate: '',
  onBeforeAction: function(){
    if(Meteor.user()){
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

/**
 * ==========================================================
 * Cat Admin Controller
 * ==========================================================
 */

CatAdminController = RouteController.extend({
  layoutTemplate: 'LayoutAdmin',
  onBeforeAction: function(){
    if(!Meteor.user()){
      Router.go('CatAdminLogin');
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
        title: title + ' | ' +SEO.config().title,
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

/**
 * ==========================================================
 * Cat Admin Blog & Category
 * ==========================================================
 */
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

/**
 * ==========================================================
 * Another Config
 * ==========================================================
 */

Router.onBeforeAction('dataNotFound');