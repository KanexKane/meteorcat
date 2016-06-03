Notifications = new Mongo.Collection('notifications');

Notifications.allow({
    update: function(userId, doc, fieldNames){
        return ownsDocument(userId, doc) && fieldNames.length === 1 && fieldNames[0] === 'read';
    }
});