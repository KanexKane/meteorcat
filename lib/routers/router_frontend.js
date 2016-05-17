CatController = RouteController.extend({
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
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
      // Meteor.subscribe('blogimages'),
    ];
  },
  data: function(){
    return { 
        posts: BlogPosts.find({},{ sort: {post_date: -1 } }),
        categories: BlogCategories.find({})
    };
  }
});

Router.route('/', {
  name: 'home',
  controller: CatController,
  onBeforeAction: function(){
    Router.go('/blogs');  
  }
});

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
          // Meteor.subscribe('blogimages'),
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