Template.notifications.helpers({
    notificationCount: function(){
        return this.notifications.count();
    }
});

Template.notificationItem.helpers({
    notificationPostPath: function(){
        return '';//Router.routes.postPage.path({ _id: this.postId });
    }
});

Template.notificationItem.events({
    'click a': function(){
        //Notifications.update(this._id, { $set: { read: true } });
    }
});