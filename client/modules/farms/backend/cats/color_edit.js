Template.AdminCatColorEdit.onCreated(function(){
    Session.set('catColorErrors', {});
});

Template.AdminCatColorEdit.helpers({
    errorMessage: function(field, text){
        if(_.isObject(text)){
            text = '';
        }
        return Session.get('catColorErrors')[field] ? Session.get('catColorErrors')[field] : text;
    },
    errorClass: function(field){
        return !!Session.get('catColorErrors')[field] ? 'has-error' : '';
    }
});

Template.AdminCatColorEdit.events({
    'submit form': function(e){
        e.preventDefault();

        var currentId = this._id;

        var color = {
            color_name: $(e.target).find('[name=color_name]').val().trim()
        };

        var errors = validateColor(color);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        Meteor.call('catColorEdit', color, currentId, function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }

            Router.go('AdminCatColorList');
        });
    },
    'click .cancel-process': function(){
        Router.go('AdminCatColorList');
    }
});
