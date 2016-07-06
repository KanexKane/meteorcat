FrontEndController = RouteController.extend({
    layoutTemplate: 'Layout',
    waitOn() {
        if (Meteor.userId()) {
            return Meteor.subscribe('farmInfoByUserId', Meteor.userId());
        }
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
            Meteor.subscribe('allImageBlogs')
        ];
    },
    data: function () {
        return {
            posts: BlogPosts.find({}, this.findOptions()),
            categories: BlogCategories.find({}),
            countPosts: BlogPosts.find().count()
        };
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

        if (Meteor.userId()) {

            return [
                Meteor.subscribe('farmInfoByUserId', Meteor.userId()),
                Meteor.subscribe('blogInCategory', this.params.category_slug),
                Meteor.subscribe('categories', this.params.category_slug),
                Meteor.subscribe('allImageBlogs')
            ];

        } else {

            return [
                Meteor.subscribe('blogInCategory', this.params.category_slug),
                Meteor.subscribe('categories', this.params.category_slug),
                Meteor.subscribe('allImageBlogs')
            ];

        }


    },
    data: function () {
        return {
            posts: BlogPosts.find({}, this.findOptions()),
            categories: BlogCategories.find({}),
            countPosts: BlogPosts.find().count()
        };
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }
        if (this.data().categories.count() > 0) {
            var category = this.data().categories.fetch();
            var title = 'Blogs in Category ' + category[0].category_name;
            SEO.set({
                title: title + ' | ' + SEO.config().title,
            });
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
    // onBeforeAction: function () {
    //     Router.go('/blogs');
    // },
    
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
    waitOn() {
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
    parent: 'Blogs',
    controller: BlogCategoryController,
    perpage: 12,
    title: function () {
        let category = BlogCategories.findOne({category_slug: this.params.category_slug});
        return category.category_name;
    }
});
Router.route('/blogs/:category_slug/:post_slug', {
    name: 'BlogDetail',
    title: function () {
        let post = BlogPosts.findOne({post_slug: this.params.post_slug});
        return post.post_title;
    },
    parent: 'BlogCategoryList',
    controller: FrontEndController,
    waitOn: function () {
        return [
            //Meteor.subscribe('blogDetailBySlug', this.params.post_slug),
            Meteor.subscribe('blogInCategoryByPostSlug', this.params.post_slug),
            Meteor.subscribe('categories'),
            Meteor.subscribe('allImageBlogs')
        ];
    },
    data: function () {
        return {
            post: BlogPosts.findOne({ post_slug: this.params.post_slug}),
            categories: BlogCategories.find({})
        };
    },
    onAfterAction: function () {
        var post;
        if (!Meteor.isClient) {
            return;
        }
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
Router.route('/@:farm_url/cat/:breed_slug/:cat_slug', {
    name: "FarmCatDetail",
    parent: 'FarmCatBreed',
    layoutTemplate: 'LayoutFarm',
    waitOn: function () {
        return [
            Meteor.subscribe('farmInfoByUrl', this.params.farm_url),
            Meteor.subscribe('allCatsInBreedSlugByFarmUrl', this.params.farm_url, this.params.breed_slug),
            Meteor.subscribe('allCatBreedsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('allCatColors'),
            Meteor.subscribe('imageFarmCatsByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmCoversByFarmUrl', this.params.farm_url),
            Meteor.subscribe('imageFarmLogosByFarmUrl', this.params.farm_url)
        ];
    },
    data: function () {
        var catSlug = this.params.breed_slug + '/' + this.params.cat_slug;
        var cat = Cats.findOne({ cat_slug: catSlug });
        if (cat) {
            var cat_breed = cat.cat_breed;
            var cat_color = cat.cat_color;
            return {
                farm: Farms.findOne({farm_url: this.params.farm_url}),
                cat: cat,
                breed: CatBreeds.findOne(cat_breed),
                color: CatColors.findOne(cat_color),
                allcats: Cats.find()
            };
        }

    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }
        cat = this.data().cat;
        if (cat) {
            SEO.set({
                title: cat.cat_name + ' | ' + SEO.config().title,
                meta: {
                    'description': cat.cat_desc
                }
            });
        }
    }
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