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