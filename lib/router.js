//บอกตัวจัดการเส้นทางให้ใช้เทมเพลทชื่อ layout 
//ที่เราเพิ่งสร้างเป็นเทมเพลทพื้นฐานของทุกๆ เส้นทาง
Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function(){ 
        return Meteor.subscribe('notifications');
    }
});

//Router.route('/', {name: 'home'});
Router.route('/', {name: 'home'}, function(){
  this.redirect('/blogs');
});

Router.route('/blogs', {
  name: 'Blogs',
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







// show blog detail
Router.route('/blogs/:category/:post_slug', {
  name: "BlogDetail",
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
  }
});

// Router Administrator

Router.route('/catadmin/', {
  name: "CatAdminHome",
  layoutTemplate: 'LayoutAdmin',
}, function(){
  if(!Meteor.user()){
    Router.go('CatAdminLogin');
  }
});
Router.route('/catadmin/login', {
  name: "CatAdminLogin",
  layoutTemplate: '',
});
// create blog
Router.route('/catadmin/blogs/create', {
  name: 'CatAdminBlogCreate',
  layoutTemplate: 'LayoutAdmin',
  waitOn: function(){
    return [
      Meteor.subscribe('categories'),
      Meteor.subscribe('blogimages'),
    ];
  }
});
// edit blog
Router.route('/catadmin/blogs/edit/:_id', {
  name: 'CatAdminBlogEdit',
  layoutTemplate: 'LayoutAdmin',
  waitOn: function(){
    return [
      Meteor.subscribe('blogDetail', this.params._id),
      Meteor.subscribe('categories'),
      Meteor.subscribe('blogimages'),
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
  layoutTemplate: 'LayoutAdmin',
  waitOn: function(){
    return [
      Meteor.subscribe('blogs'),
      Meteor.subscribe('categories'),
      Meteor.subscribe('blogimages'),
      Meteor.subscribe('notifications')
    ];
  },
  data: function(){
    return { 
        posts: BlogPosts.find({},{ sort: {post_date: -1 } }),
        categories: BlogCategories.find({}),
        notifications: Notifications.find({})
    };
  }
});
Router.route('/catadmin/blogs/categories/list', {
  name: 'CatAdminBlogCategoryList',
  layoutTemplate: 'LayoutAdmin',
  waitOn: function(){
    return Meteor.subscribe('categories');
  },
  data: function(){
    return {
      categories: BlogCategories.find({})
    }
  }
});
// create blog category
Router.route('/catadmin/blogs/categories/create', {
  name: 'CatAdminBlogCategoryCreate',
  layoutTemplate: 'LayoutAdmin',
  waitOn: function(){
    return Meteor.subscribe('categories');
  }
});
// edit blog category
Router.route('/catadmin/blogs/categories/edit/:_id', {
  name: 'CatAdminBlogCategoryEdit',
  layoutTemplate: 'LayoutAdmin',
  waitOn: function(){
    return Meteor.subscribe('blogCategoryDetail', this.params._id);
  },
  data: function(){
    return BlogCategories.findOne(this.params._id);
  }
});




var requireLogin = function(){
    if(! Meteor.user()){
        Router.go('CatAdminLogin');
        // if(Meteor.loggingIn()){
        //     this.render(this.loadingTemplate);
            
        // }else{
        //     this.render('accessDenied');
        // }
    }else{
        this.next();
    }
}

Router.onBeforeAction('dataNotFound');
Router.onBeforeAction(requireLogin, {
  only: [
          'CatAdminBlogList',
          'CatAdminBlogCreate', 
          'CatAdminBlogEdit', 
          'CatAdminBlogCategoryList', 
          'CatAdminBlogCategoryCreate', 
          'CatAdminBlogCategoryEdit',
          'CatAdminHome'
        ]
});