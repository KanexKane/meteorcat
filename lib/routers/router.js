//==========================================================
//                      SEO config
//==========================================================

Meteor.startup(function() {
  if(Meteor.isClient){
    SEO.config({
      title: 'Cat Land',
      meta: {
        'description': 'Cat Land อาณาจักรแห่งแมว ดินแดนสวรรค์ของบรรดาทาส'
      }
    });
    $('head').append("<meta property='fb:pages' content='238710326317325'>");
  }
});

//==========================================================
//                  สำหรับผู้ชม (Front End)
//==========================================================

FrontEndController = RouteController.extend({
    layoutTemplate: 'Layout',
    onAfterAction: function() {
        if(typeof this.data !== 'function' || !this.data().post) {
            if(!Meteor.isClient) {
                return;
            }
            var title = this.route.options.title ? this.route.options.title : "Home";

            SEO.set({
                title: title + ' | ' +SEO.config().title,
            });
        }
    }
});
BlogController = FrontEndController.extend({
    perPage: function() {
        return this.route.options.perpage;
    },
    blogSkip: function() {
        let page = 0;
        if( this.params.query.page ) {
            page = parseInt( this.params.query.page );
        }
        if( page === 1 ) {
            page = 0;
        }
        return page * this.perPage();
    },
    findOptions: function() {
        return {
            sort: {
                post_date: -1
            },
            skip: this.blogSkip(),
            limit: this.perPage()
        }
    },
    waitOn: function() {
        return [
            Meteor.subscribe('blogs'),
            Meteor.subscribe('categories')
        ];
    },
    data: function() {
        return {
            posts: BlogPosts.find({}, this.findOptions()),
            categories: BlogCategories.find({}),
            countPosts: BlogPosts.find().count()
        };
    }
});
FarmController = RouteController.extend({
  layoutTemplate: 'LayoutFarm',
  waitOn: function(){
    return [
      Meteor.subscribe('farmInfoByUrl', this.params.farm_url),
      Meteor.subscribe('allCatsInFarmByUrl', this.params.farm_url),
      Meteor.subscribe('allCatBreeds')
    ];
  },
  data: function(){
    return {
      farm: Farms.findOne({ farm_url: this.params.farm_url }),
      cats: Cats.find({}),
      catBreeds: CatBreeds.find({})
    };
  },
  onAfterAction: function() {
    if (!Meteor.isClient) {
      return;
    }
    var title = this.route.options.title ? this.route.options.title : "Home";

    SEO.set({
      title: title + '| Cat Land Farm',
    });
  }
});

Router.route('/', {
    name: 'home',
    controller: FrontEndController,
    onBeforeAction: function() {
        Router.go('/blogs');
    }
});

Router.route('/blogs', {
    name: 'Blogs',
    controller: BlogController,
    title: 'Blogs',
    perpage: 9,
});
Router.route('/blogs/:category/:post_slug', {
    name: 'BlogDetail',
    controller: FrontEndController,
    waitOn: function(){
        return [
            Meteor.subscribe('blogDetailBySlug', this.params.post_slug),
            Meteor.subscribe('categories')
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

Router.route('/@:farm_url', {
  name: "FarmHome",
  controller: FarmController,
});
Router.route('/@:farm_url/promotion', {
  name: "FarmPromotion",
  controller: FarmController,
});
Router.route('/@:farm_url/contactus', {
  name: "FarmContactUs",
  controller: FarmController,
});


//==========================================================
//                  สำหรับสมาชิก (Member)
//==========================================================

MemberFarmController = RouteController.extend({
  layoutTemplate: 'LayoutMemberFarm',
  waitOn: function(){
    return Meteor.subscribe('farmInfoByUserId', Meteor.userId());
  },
  data: function(){
    return Farms.findOne({ farm_user_id: Meteor.userId() });
  },
  onBeforeAction: function(){
    if(!Meteor.userId()) {
      Router.go('MemberLogin');
    }else{
      // ถ้า Login อยู่แล้วไม่ใช่ ไม่ได้เป็นเจ้าของฟาร์ม
      if(!Roles.userIsInRole(Meteor.userId(), 'farm', 'user-group')){
        Router.go('home');
      }
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) {
      return;
    }
    var title = this.route.options.title ? this.route.options.title : "Home";

    SEO.set({
      title: title + ' | Cat Land Farm',
    });
  }
});
MemberFarmCatController = RouteController.extend({
  layoutTemplate: 'LayoutMemberFarm',
   waitOn: function(){
    return [
      Meteor.subscribe('farmInfoByUserId', Meteor.userId()),
      Meteor.subscribe('allCatsInFarmByUserId', Meteor.userId()),
      Meteor.subscribe('allCatBreeds')
    ];
  },
  onBeforeAction: function(){
    if(!Meteor.userId()){
      Router.go('MemberLogin');
    }else{
      // ถ้า Login อยู่แล้วไม่ใช่ ไม่ได้เป็นเจ้าของฟาร์ม
      if(!Roles.userIsInRole(Meteor.userId(), 'farm', 'user-group')){
        Router.go('home');
      }
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) {
      return;
    }
    var title = this.route.options.title ? this.route.options.title : "Home";

    SEO.set({
      title: title + ' | Cat Land Farm',
    });
  }
});

Router.route('/login', {
  name: "MemberLogin",
  layoutTemplate: '',
  waitOn: function(){
    return Meteor.subscribe('allFarms');
  },
  onBeforeAction: function(){
    // ถ้า Login อยู่แล้วให้ไปที่
    if(Meteor.userId()){
      Router.go("CatMemberFarmHome");
    }
    this.next();
  },
  onAfterAction: function() {
    if (!Meteor.isClient) { return; }

    var title = 'Member Login';

    SEO.set({
      title: title + ' | Cat Land',
    });
  }
});

Router.route('/myfarm/', {
  name: "MemberFarmHome",
  controller: MemberFarmController
});
Router.route('/myfarm/settings/general', {
  name: "MemberFarmSettingGeneral",
  controller: MemberFarmController
});
Router.route('/myfarm/settings/contactus', {
  name: "MemberFarmSettingContactUs",
  controller: MemberFarmController
});
Router.route('/myfarm/settings/promotion', {
  name: "MemberFarmSettingPromotion",
  controller: MemberFarmController
});
Router.route('/myfarm/cats', {
  name: "MemberFarmCats",
  controller: MemberFarmCatController
});
Router.route('/myfarm/cats/create', {
  name: "MemberFarmCatCreate",
  controller: MemberFarmCatController,
  waitOn: function(){
    return [
      Meteor.subscribe('allCatsInFarmByUserId', Meteor.userId()),
      Meteor.subscribe('allCatColors')

    ];
  },
});
Router.route('/myfarm/cats/edit/:_id', {
  name: "MemberFarmCatEdit",
  controller: MemberFarmCatController,
  waitOn: function(){
    return [
      Meteor.subscribe('catDetailById', this.params._id),
      Meteor.subscribe('allCatColors')
    ];
  },
  data: function(){
    // ที่ใช้แค่นี้ไม่ต้องหาด้วย farm id อีก เพราะกรองมาตั้งแต่ขั้นตอน waitOn แล้ว
    return Cats.findOne({ _id: this.params._id});
  }
});

//==========================================================
//                  สำหรับผู้ดูแล (Back End)
//==========================================================
