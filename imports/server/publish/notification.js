Meteor.publish('notifications', function(){
    return Notifications.find({ user_id: this.userId, read: false});
});