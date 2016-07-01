Template.EditMemberProfile.onRendered( () => {
    Session.set('isUploading', false);
    Session.set('profileUpdateErrors', {});
});
Template.EditMemberProfile.helpers({
    errorMessage: function(field){
        return Session.get('profileUpdateErrors')[field];
    },
    errorClass: function(field){
        return !!Session.get('profileUpdateErrors')[field] ? 'has-error' : '';
    },
    profileImage: function( imageId ){

        var image = UserImages.findOne( imageId );

        if ( image ) {

            return image.url( { store: 'userimagethumbs'} );

        } else {

            return "/images/noimage.png";

        }
    },
    isUploading: () => {
        return Session.get('isUploading');
    }
});

Template.EditMemberProfile.events({
    'change #profile_image': (e) => {
        
        var file = $(e.currentTarget)[0].files[0];

        if(file){

            Session.set('isUploading', true);

            let fsFile = new FS.File(file);
            fsFile.metadata = { owner:Meteor.userId() };

            // progress bar
            var maxChunk = 2097152;
            FS.config.uploadChunkSize =( fsFile.original.size < 10*maxChunk ) ? fsFile.original.size/10 : maxChunk;


            UserImages.insert(fsFile, function(err, fileObj){
                
                Meteor.call('updateProfileImage', fileObj._id, function (error, result) {
                    Session.set('isUploading', false);
                    FS.config.uploadChunkSize = 0;
                });
            });
        }
    },
    'submit form': (e) => {
        e.preventDefault();

        var profile = {
            firstname: $(e.target).find('[name=firstname]').val(),
            lastname: $(e.target).find('[name=lastname]').val(),
        };
        var email = {
            emails: { address: $(e.target).find('[name=email]').val() }
        };

        Meteor.call('updateUserProfile', Meteor.userId(), profile, email, function(error, result){
                
                if(error){
                    return throwError(error.reason);
                }

                Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );

            });
    }
});