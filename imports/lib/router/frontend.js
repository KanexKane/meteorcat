FrontEndController = RouteController.extend({
    layoutTemplate: 'Layout',
    onAfterAction: function () {
        
        if (!Meteor.isClient) {
            return;
        }
        var title = this.route.options.title ? this.route.options.title : "Home";

        SEO.set({
            title: title + ' | ' + SEO.config().title,
        });
        
    }
});
BlogController = FrontEndController.extend({
    perPage: function () {
        return this.route.options.perpage;
    },
    blogSkip: function () {
        let page = 0;
        if (this.params.query.page) {
            page = parseInt(this.params.query.page);
            if (page === 1) {
                page = 0;
            } else {
                page = page - 1;
            }
        }

        return page * this.perPage();
    },
    findOptions: function () {
        return {
            sort: {
                post_date: -1
            },
            skip: this.blogSkip(),
            limit: this.perPage()
        }
    },
    waitOn: function () {
         
        return [
            Meteor.subscribe('blogs'),
            Meteor.subscribe('categories'),
            Meteor.subscribe('allImageBlogs'),
            Meteor.subscribe('users')
        ];

        
    },
    data: function () {
        var posts = BlogPosts.find({}, this.findOptions());
        var categories = BlogCategories.find({});
        if( posts && categories ) {
            return {
                posts: posts,
                categories: categories,
                countPosts: BlogPosts.find().count()
            };
        }
    }
});
BlogCategoryController = FrontEndController.extend({
    perPage: function () {
        return this.route.options.perpage;
    },
    blogSkip: function () {
        let page = 0;
        if (this.params.query.page) {
            page = parseInt(this.params.query.page);

            if (page === 1) {
                page = 0;
            } else {
                page = page - 1;
            }
        }
        return page * this.perPage();
    },
    findOptions: function () {
        return {
            sort: {
                post_date: -1
            },
            skip: this.blogSkip(),
            limit: this.perPage()
        }
    },
    waitOn: function () {

            return [
                Meteor.subscribe('blogInCategory', this.params.category_slug),
                Meteor.subscribe('categories', this.params.category_slug),
                Meteor.subscribe('allImageBlogs')
            ];

    },
    data: function () {
        var posts = BlogPosts.find({}, this.findOptions());
        if ( posts ) {      
            return {
                posts: posts,
                categories: BlogCategories.find({}),
                countPosts: BlogPosts.find().count()
            };
        }
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }
        if (this.data() && this.data().categories.count() > 0) {
            var category = this.data().categories.fetch();
            var title = 'Blogs in Category ' + category[0].category_name;
            SEO.set({
                title: title + ' | ' + SEO.config().title,
            });
        }
    }
});
BlogDetailController = RouteController.extend({
    layoutTemplate: 'Layout',
    increment: 20,
    subscriptions: function() {

        this.postsSub = Meteor.subscribe('blogInCategoryByPostSlug', this.params.post_slug);
        this.categoriesSub = Meteor.subscribe('categories');
        this.imagesBlogSub = Meteor.subscribe('allImageBlogs');
        this.commentsSub = Meteor.subscribe('comments', this.params.post_slug ,this.findOptions());
        this.usersSub = Meteor.subscribe('users');
        this.userImagesSub = Meteor.subscribe('userimages');
    },
    title: function () {
        let post = BlogPosts.findOne({post_slug: this.params.post_slug});
        if ( post ) {
            return post.post_title;
        }
    },
    commentsLimit: function () {
        return parseInt(this.params.commentsLimit) || this.increment;
    },
    findOptions: function () {
        return { sort: { created_at: 1 }, limit: this.commentsLimit() };
    },
    postId: function() {
        var post = BlogPosts.findOne({ post_slug: this.params.post_slug });
        if ( post ) {
            return post._id ;
        }
    },
    comments: function () {
        var comments = BlogComments.find({ post_id: this.postId() }, this.findOptions());
        if ( comments ) {
            return comments;
        }
    },
    data: function () {
        var comments = this.comments();
        if ( comments ) {       
            var hasMore = comments.count() === this.commentsLimit();

            var nextComment = this.route.path({ 
                category_slug: this.params.category_slug,
                post_slug: this.params.post_slug,
                commentsLimit: this.commentsLimit() + this.increment 
            });
        }

        var posts = BlogPosts.findOne({ post_slug: this.params.post_slug});
        var categories = BlogCategories.find({});

        if ( posts && categories && comments ) {      
            return {
                post: BlogPosts.findOne({ post_slug: this.params.post_slug}),
                categories: BlogCategories.find({}),
                comments: comments,
                ready: this.commentsSub.ready,
                nextComment: hasMore ? nextComment : null
            };
        }

    },
    onAfterAction: function () {
        var post;
        if (!Meteor.isClient) {
            return;
        }
        if ( this.data() ) {
            post = this.data().post;
            if (post) {
                SEO.set({
                    title: post.post_title + ' | ' + SEO.config().title,
                    meta: {
                        'description': post.post_content
                    }
                });
            }
        }

    }
});
FarmController = RouteController.extend({
    layoutTemplate: 'LayoutFarm',
    waitOn: function () {
        return [
            Meteor.subscribe('farmInfoByUrl', this.params.farm_url),
            Meteor.subscribe('allCatsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('allCatBreedsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmCatsByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmImagesByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmCoversByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmLogosByFarmUrl', this.params.farm_url)
        ];
    },
    data: function () {
        return {
            farm: Farms.findOne({farm_url: this.params.farm_url})
        };
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }

        var farm = this.data().farm;
        var title = this.route.options.title ? this.route.options.title : "";   
        
        if ( farm ) {
            if( title == "" ) {
                SEO.set({
                    title: farm.farm_name,
                });
            } else {
                SEO.set({
                    title: title + ' | ' + farm.farm_name,
                });
            }
        }
    }
});


Router.route('/', {
    name: 'home',
    title: 'Home',
    onBeforeAction: function () {
        Router.go('/blogs');
    },
    waitOn: function() {
        return [
            Meteor.subscribe('recommendedCats'),
            Meteor.subscribe('allFarms'),
            Meteor.subscribe('allImageFarmCats'),
            Meteor.subscribe('farmInfoByUserId', Meteor.userId())
        ];
    },
    onAfterAction: function () {
        if (typeof this.data !== 'function' || !this.data().post) {
            if (!Meteor.isClient) {
                return;
            }
            var title = this.route.options.title ? this.route.options.title : "Home";

            SEO.set({
                title: title + ' | ' + SEO.config().title,
            });
        }
    }    
});

Router.route('/accessdenied', {
    name: 'AccessDenied',
    title: 'Access Denied',
    controller: FrontEndController
});

Router.route('/users/register/', {
    name: 'RegisterUser',
    title: 'สมัครสมาชิก',
    controller: FrontEndController
});
Router.route('/farms/register/', {
    name: 'RegisterFarm',
    title: 'สมัครเปิดฟาร์ม',
    onBeforeAction: function() {
        if ( !Meteor.userId() ) {
            Router.go('home');
        }

        this.next();
    },
    controller: FrontEndController,
    waitOn: function() {
        return Meteor.subscribe('allFarms');
    }
});

Router.route('/farms', {
    name: 'Farms',
    title: 'ฟาร์มทั้งหมด',
    parent: 'home',
    controller: FrontEndController,
    waitOn: function () {
        return [
            Meteor.subscribe('allFarms'),
            Meteor.subscribe('allImageFarmCats')
        ];
    },
    data: function () {
        return {
            farms: Farms.find()
        }
    }
});
Router.route('/aboutus', {
    name: 'AboutUs',
    controller: FrontEndController,
    waitOn: function () {
    return [    
            Meteor.subscribe('blogimages'),
            Meteor.subscribe('farmcatimages'),
            Meteor.subscribe('FileManagerGroups')
        ];
    }
});

Router.route('/blogs', {
    name: 'Blogs',
    title: 'Blogs',
    controller: BlogController,
    perpage: 12,

});
Router.route('/blogs/:category_slug', {
    name: 'BlogCategoryList',
    template: 'Blogs',
    parent: 'Blogs',
    controller: BlogCategoryController,
    perpage: 12,
    title: function () {
        let category = BlogCategories.findOne({category_slug: this.params.category_slug});
        if ( category ) {

            return category.category_name;
        }
    }
});
Router.route('/blogs/:category_slug/:post_slug/:commentsLimit?', {
    name: 'BlogDetail',
    parent: 'BlogCategoryList',
    controller: BlogDetailController
});

Router.route('/@:farm_url', {
    name: "FarmHome",
    controller: FarmController,
});
Router.route('/@:farm_url/cat/:breed_slug/', {
    name: 'FarmCatBreed',
    parent: 'FarmHome',
    layoutTemplate: 'LayoutFarm',
    waitOn: function () {
        return [
            Meteor.subscribe('farmInfoByUrl', this.params.farm_url),
            Meteor.subscribe('allCatsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('allCatBreedsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmCatsByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmImagesByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmCoversByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmLogosByFarmUrl', this.params.farm_url)
        ];
    },
    data: function () {
        return {
            farm: Farms.findOne({farm_url: this.params.farm_url})
        };
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }

        let farm = Farms.findOne({ farm_url: this.params.farm_url });
        let breed = CatBreeds.findOne({ breed_slug: this.params.breed_slug });
        if (breed) {
            var title = 'Cats in ' + breed.breed_name + ' | ' + farm.farm_name;

            SEO.set({
                title: title
            });
        }
        

    }
});

FarmCatDetailController = RouteController.extend({
    layoutTemplate: 'LayoutFarm',
    increment: 20,
    subscriptions: function() {
        if ( this.catData() ) {
            this.catCommentsSub = Meteor.subscribe('catComments', this.catData()._id, this.findOptions());    
        }
    },
    commentsLimit: function () {
        return parseInt(this.params.commentsLimit) || this.increment;
    },
    catData: function () {
        return Cats.findOne({ cat_slug: this.params.breed_slug + '/' + this.params.cat_slug });
    },
    findOptions: function () {
        return { sort: { created_at: 1 }, limit: this.commentsLimit() };
    },
    waitOn: function() {
        return [
            Meteor.subscribe('farmInfoByUrl', this.params.farm_url),
            Meteor.subscribe('allCatsInBreedSlugByFarmUrl', this.params.farm_url, this.params.breed_slug),
            Meteor.subscribe('allCatBreedsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('allCatColors'),
            Meteor.subscribe('imageFarmCatsByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmCoversByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmLogosByFarmUrl', this.params.farm_url),
            Meteor.subscribe('users'),
            Meteor.subscribe('userimages')
        ];
    },
    comments: function () {
        return CatComments.find({ cat_id: this.catData()._id }, this.findOptions());
    },
    data: function () {
        var cat = this.catData() ? Cats.findOne( this.catData()._id ) : null;
        if (cat) {
            var hasMore = this.comments().count() === this.commentsLimit();
            var nextComment = this.route.path({
                farm_url: this.params.farm_url,
                breed_slug: this.params.breed_slug,
                cat_slug: this.params.cat_slug,
                commentsLimit: this.commentsLimit() + this.increment 
            });

            var cat_breed = cat.cat_breed;
            var cat_color = cat.cat_color;
            var farm = Farms.findOne({farm_url: this.params.farm_url});

            if ( farm ) {

                return {
                    farm: farm,
                    cat: cat,
                    breed: CatBreeds.findOne(cat_breed),
                    color: CatColors.findOne(cat_color),
                    allcats: Cats.find(),
                    comments: this.comments(),
                    ready: this.catCommentsSub.ready,
                    nextComment: hasMore ? nextComment : null
                };
            }
        }
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }

        if ( !!this.data() ) {
            cat = this.data().cat;
            if( cat ) {        
                SEO.set({
                    title: cat.cat_name + ' | ' + SEO.config().title,
                    meta: {
                        'description': cat.cat_desc
                    }
                });
            }
            
        }

    }
});
Router.route('/@:farm_url/cat/:breed_slug/:cat_slug/:commentsLimit?', {
    name: "FarmCatDetail",
    parent: 'FarmCatBreed',
    controller: FarmCatDetailController
});
Router.route('/@:farm_url/promotion', {
    name: "FarmPromotion",
    title: "โปรโมชั่น",
    parent: 'FarmHome',
    controller: FarmController,
});
Router.route('/@:farm_url/contactus', {
    name: "FarmContactUs",
    title: "ติดต่อเรา",
    parent: 'FarmHome',
    controller: FarmController,
});