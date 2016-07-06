Meteor.methods({
    deleteBlogImage: function ( id ) {
        check( id, String );
        BlogImages.remove({ _id: id });
        return true;
    }
});