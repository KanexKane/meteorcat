Template.AdminCatBreedEdit.onCreated(function(){
    Session.set('catBreedErrors', {});
});

Template.AdminCatBreedEdit.helpers({
    errorMessage: function(field, text){
        if(_.isObject(text)){
            text = '';
        }
        return Session.get('catBreedErrors')[field] ? Session.get('catBreedErrors')[field] : text;
    },
    errorClass: function(field){
        return !!Session.get('catBreedErrors')[field] ? 'has-error' : '';
    }
});

Template.AdminCatBreedEdit.events({
    'submit form': function(e){
        e.preventDefault();

        var currentId = this._id;

        var breed = {
            breed_name: $(e.target).find('[name=breed_name]').val().trim(),
            breed_thai_name: $(e.target).find('[name=breed_thai_name]').val().trim()
        };

        var errors = validateBreed(breed);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('catBreedErrors', errors);
        }

        Meteor.call('catBreedEdit', breed, currentId, function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }

            Router.go('AdminCatBreedList');
        });
    },
    'click .cancel-process': function(){
        Router.go('AdminCatBreedList');
    }
});
