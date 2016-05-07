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

Router.route('/', {name: 'home'});

Router.route('/blogs', {name: 'blogs'});

Router.route('/blogs/create', {name: 'blogCreate'});

var requireLogin = function(){
    if(! Meteor.user()){
        if(Meteor.loggingIn()){
            this.render(this.loadingTemplate);
        }else{
            this.render('accessDenied');
        }
    }else{
        this.next();
    }
}

Router.onBeforeAction('dataNotFound');
Router.onBeforeAction(requireLogin, {where: 'blogCreate'});