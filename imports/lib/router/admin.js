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