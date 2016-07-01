//==========================================================
//                      SEO config
//==========================================================

Meteor.startup(function () {
    if (Meteor.isClient) {
        SEO.config({
            title: 'Cat Land',
            meta: {
                'description': 'Cat Land อาณาจักรแห่งแมว ดินแดนสวรรค์ของบรรดาทาส'
            }
        });
        $('head').append("<meta property='fb:pages' content='238710326317325'>");
    }
});

Router.configure({
    defaultBreadcrumbTitle: 'Home',
    defaultBreadcrumbLastLink: true,
    loadingTemplate: 'loading',
});


//==========================================================
//                  สำหรับผู้ชม (Front End)
//==========================================================

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
        var title = this.route.options.title ? this.route.options.title : "Home";

        SEO.set({
            title: title + '| Cat Land Farm',
        });
    }
});

Router.route('/', {
    name: 'home',
    title: 'Home',
    controller: FrontEndController,
    onBeforeAction: function () {
        Router.go('/blogs');
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
    waitOn() {
        return Meteor.subscribe('allFarms');
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
Router.route('/@:farm_url/cat/:breed_slug/:cat_slug', {
    name: "FarmCatDetail",
    layoutTemplate: 'LayoutFarm',
    waitOn: function () {
        return [
            Meteor.subscribe('farmInfoByUrl', this.params.farm_url),
            Meteor.subscribe('catDetailBySlug', this.params.farm_url, this.params.breed_slug, this.params.cat_slug),
            Meteor.subscribe('allCatBreedsInFarmByUrl', this.params.farm_url),
            Meteor.subscribe('allCatColors'),
            Meteor.subscribe('imageFarmCatsByFarmUrl', this.params.farm_url)
        ];
    },
    data: function () {
        var cat = Cats.find({}).fetch();
        if (cat.length > 0) {
            var cat_breed = cat[0].cat_breed;
            var cat_color = cat[0].cat_color;
            return {
                farm: Farms.findOne({farm_url: this.params.farm_url}),
                cat: cat[0],
                breed: CatBreeds.findOne(cat_breed),
                color: CatColors.findOne(cat_color)
            };
        }

    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }
        var title = this.route.options.title ? this.route.options.title : "Home";

        SEO.set({
            title: title + '| Cat Land Farm',
        });
    }
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
    waitOn: function () {
        return Meteor.subscribe('farmInfoByUserId', Meteor.userId());
    },
    data: function () {
        return Farms.findOne({farm_user_id: Meteor.userId()});
    },
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('MemberLogin');
        } else {
            if (!Roles.userIsInRole(Meteor.userId(), 'user', 'user-group')) {
                Router.go('home');
            }
        }
        this.next();
    },
    onAfterAction: function () {
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
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('MemberLogin');
        } else {
            // ถ้า Login อยู่แล้วไม่ใช่ ไม่ได้เป็นเจ้าของฟาร์ม
            if (!Roles.userIsInRole(Meteor.userId(), 'farm', 'user-group')) {
                Router.go('home');
            }
        }
        this.next();
    },
    perPage: function () {
        return this.route.options.perpage;
    },
    skip: function () {
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
                created_at: -1
            },
            skip: this.skip(),
            limit: this.perPage()
        }
    },
    waitOn: function () {
        return [
            Meteor.subscribe('farmInfoByUserId', Meteor.userId())
        ];
    },
    
    onAfterAction: function () {
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
    waitOn: function () {
        return Meteor.subscribe('allFarms');
    },
    onBeforeAction: function () {
        // ถ้า Login อยู่แล้วให้ไปที่
        if (Meteor.userId()) {
            Router.go("MemberFarmHome");
        }
        this.next();
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }

        var title = 'Member Login';

        SEO.set({
            title: title + ' | Cat Land',
        });
    }
});
Router.route('/user/editprofile', {
    name: 'EditMemberProfile',
    controller: MemberFarmController,
    waitOn: () => {
        return Meteor.subscribe('userimages');
    },
    data: () => {
        return {
            user: Meteor.user()
        }
    }
 
})

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

Router.route('/myfarm/cats/create', {
    name: "MemberFarmCatCreate",
    controller: MemberFarmCatController,
    waitOn: function () {
        return [
            Meteor.subscribe('allCatsInFarmByUserId', Meteor.userId()),
            Meteor.subscribe('allCatColors'),
            Meteor.subscribe('allCatBreeds')
        ];
    },
});
Router.route('/myfarm/cats/edit/:_id', {
    name: "MemberFarmCatEdit",
    controller: MemberFarmCatController,
    waitOn: function () {
        return [
            Meteor.subscribe('catDetailById', this.params._id),
            Meteor.subscribe('allCatColors'),
            Meteor.subscribe('allCatBreeds')
        ];
    },
    data: function () {
        // ที่ใช้แค่นี้ไม่ต้องหาด้วย farm id อีก เพราะกรองมาตั้งแต่ขั้นตอน waitOn แล้ว
        return Cats.findOne({_id: this.params._id});
    }
});
Router.route('/myfarm/cats/:id?', {
    name: "MemberFarmCats",
    controller: MemberFarmCatController,
    perpage: 50,
    waitOn: function () {
        return [
            Meteor.subscribe('allCatsInFarmByUserId', Meteor.userId(), this.params.id, this.params.query.search),
            Meteor.subscribe('allCatBreedsInFarmByUserId', Meteor.userId())
        ];
    },
    data: function () {
        if (Cats.find({}, this.findOptions()).count() > 0) {
            return {
                cats: Cats.find({}, this.findOptions()),
                catbreeds: CatBreeds.find()
            }
        }
    }
});

//==========================================================
//                  สำหรับผู้ดูแล (Administrator)
//==========================================================

Router.route('/catadmin/login', {
    name: "CatAdminLogin",
    layoutTemplate: '',
    onBeforeAction: function () {
        if (Meteor.userId()) {
            Router.go("AdminHome");
        }
        this.next();
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }

        var title = 'Administrator Login';

        SEO.set({
            title: title + " | Cat Admin",
        });
    }
});

AdminController = RouteController.extend({

    notFoundTemplate: 'notFound',
    layoutTemplate: 'LayoutAdmin',
    waitOn() {
        if (Meteor.userId()) {
            return Meteor.subscribe('farmInfoByUserId', Meteor.userId());
        }
    },
    onBeforeAction: function () {
        if (!Meteor.userId()) {
            Router.go('CatAdminLogin');
        }
        else {
            // ถ้า Login อยู่แล้วไม่ใช่ Admin
            if (!Roles.userIsInRole(Meteor.userId(), 'admin', 'admin-group')) {
                Router.go('home');
            }
        }

        this.next();
    },
    onAfterAction: function () {
        if (typeof this.data !== 'function' || !this.data().post) {
            if (!Meteor.isClient) {
                return;
            }
            var title = this.route.options.title ? this.route.options.title : "Home";

            SEO.set({
                title: title + " | Cat Admin",
            });
        }
    }
});
AdminBlogController = AdminController.extend({
    waitOn: function () {
        return [
            Meteor.subscribe('categories'),
            Meteor.subscribe('blogimages')
        ];
    }
});
AdminBlogCategoryController = AdminController.extend({
    waitOn: function () {
        return [
            Meteor.subscribe('categories')
        ];
    },
    data: function () {
        return {
            categories: BlogCategories.find({})
        }
    }
});


Router.route('/catadmin/', {
    name: "AdminHome",
    controller: AdminController
});

Router.route('/catadmin/blogs/create', {
    name: 'AdminBlogCreate',
    controller: AdminBlogController,
    title: 'Create Blog'
});
Router.route('/catadmin/blogs/edit/:_id', {
    name: 'AdminBlogEdit',
    title: 'Edit Blog',
    controller: AdminBlogController,
    waitOn: function () {
        return [
            Meteor.subscribe('blogDetail', this.params._id)
        ];
    },
    data: function () {
        return {
            post: BlogPosts.findOne(this.params._id),
            categories: BlogCategories.find({})
        };
    }
});
Router.route('/catadmin/blogs/list/', {
    name: 'AdminBlogList',
    controller: AdminBlogController,
    title: 'Blogs',
    waitOn: function () {
        return [
            Meteor.subscribe('blogs')
        ];
    },
    data: function () {
        return {
            posts: BlogPosts.find({}, {sort: {post_date: -1}}),
            categories: BlogCategories.find({})
        };
    }
});

Router.route('/catadmin/blogs/categories/list', {
    name: 'AdminBlogCategoryList',
    controller: AdminBlogCategoryController,
    title: 'Categories'
});
Router.route('/catadmin/blogs/categories/create', {
    name: 'AdminBlogCategoryCreate',
    controller: AdminBlogCategoryController,
    title: 'Create Category'
});
Router.route('/catadmin/blogs/categories/edit/:_id', {
    name: 'AdminBlogCategoryEdit',
    controller: AdminBlogCategoryController,
    title: 'Edit Category',
    data: function () {
        return BlogCategories.findOne(this.params._id);
    }
});

Router.route('/catadmin/cats/breeds/list', {
    name: 'AdminCatBreedList',
    title: 'รายการสายพันธุ์แมว',
    controller: AdminController,
    waitOn: function () {
        return [
            Meteor.subscribe('allCatBreeds')
        ];
    },
    data: function () {
        return CatBreeds.find({});
    }
});
Router.route('/catadmin/cats/breeds/create', {
    name: 'AdminCatBreedCreate',
    title: 'เพิ่มสายพันธุ์แมว',
    controller: AdminController
});
Router.route('/catadmin/cats/breeds/edit/:_id', {
    name: 'AdminCatBreedEdit',
    title: 'แก้ไขสายพันธุ์แมว',
    controller: AdminController,
    waitOn: function () {
        return [
            Meteor.subscribe('detailCatBreedById', this.params._id)
        ];
    },
    data: function () {
        return CatBreeds.findOne(this.params._id);
    }
});

Router.route('/catadmin/cats/colors/list', {
    name: 'AdminCatColorList',
    title: 'รายการสีแมว',
    controller: AdminController,
    waitOn: function () {
        return [
            Meteor.subscribe('allCatColors')
        ];
    },
    data: function () {
        return CatColors.find({});
    }
});
Router.route('/catadmin/cats/colors/create', {
    name: 'AdminCatColorCreate',
    title: 'เพิ่มสีแมว',
    controller: AdminController
});
Router.route('/catadmin/cats/colors/edit/:_id', {
    name: 'AdminCatColorEdit',
    title: 'แก้ไขสีแมว',
    controller: AdminController,
    waitOn: function () {
        return [
            Meteor.subscribe('detailCatColorById', this.params._id)
        ];
    },
    data: function () {
        return CatColors.findOne(this.params._id);
    }
});

Router.route('/catadmin/banners/list', {
    name: "AdminBannersList",
    title: "รายการโฆษณา",
    controller: AdminController,
    perpage: 50,
    waitOn: function() {
        var searchKeyword = this.params.query.search;
        var bannerPosition = this.params.query.position;
        return [
            Meteor.subscribe('allBanners', bannerPosition, searchKeyword),
            Meteor.subscribe('allBannerPositions'),
            Meteor.subscribe('allImageBanners')
        ];
    },
    data: function() {
        // calc page
        let page = 0;
        if (this.params.query.page) {
            page = parseInt(this.params.query.page);
            if (page === 1) {
                page = 0;
            } else {
                page = page - 1;
            }
        }

        page =  page * this.route.options.perpage;
        
        return {
            banners: Banners.find({}, {
                sort: {
                    position: 1,
                    updated_at: -1
                },
                skip: page,
                limit: this.route.options.perpage
            }),
            positions: BannerPositions.find({})
        }
    }
});
Router.route('/catadmin/banners/create', {
    name: "AdminBannerCreate",
    title: "เพิ่มโฆษณา",
    controller: AdminController,
    waitOn: function() {
        return [
            Meteor.subscribe('allBannerPositions'),
            Meteor.subscribe('allImageBanners')
        ];
    }
});
Router.route('/catadmin/banners/edit/:id', {
    name: "AdminBannerEdit",
    title: "แก้ไขโฆษณาโฆษณา",
    controller: AdminController,
    waitOn: function() {
        return [
            Meteor.subscribe('bannerDetail', this.params.id),
            Meteor.subscribe('allBannerPositions'),
            Meteor.subscribe('allImageBanners')
        ];
    },
    data: function() {
        return Banners.findOne(this.params.id)
    }
});

Router.route('/catadmin/filemanager', {
    name: "AdminFileManager",
    title: "จัดการไฟล์",
    controller: AdminController,
    waitOn: function () {
        return Meteor.subscribe('allAssetImage');
    },
    data: function () {
        return {
            assets: BlogImages.find()
        }
    }
})