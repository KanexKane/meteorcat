Template.Messages.helpers({
    message: function() {
        Meteor.setTimeout(function(){
            Session.set('ALERTMESSAGE', '');
        }, 10000);
        return Session.get('ALERTMESSAGE');
    }
})