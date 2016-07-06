Meteor.methods({
    bannerDelete: function( _id ){
        check(_id, String);
        Banners.remove(_id);
    }
});