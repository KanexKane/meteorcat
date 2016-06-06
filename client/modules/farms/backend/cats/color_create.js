Template.AdminCatColorCreate.onCreated(function(){
    Session.set('catColorErrors', {});
});

Template.AdminCatColorCreate.helpers({
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

Template.AdminCatColorCreate.events({
    'submit form': function(e){
        e.preventDefault();

        var color = {
            color_name: $(e.target).find('[name=color_name]').val().trim()
        };

        var errors = validateColor(color);
        // use package underscore to check is empty
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }
    
        Meteor.call('catColorCreate', color, function(error, result){
            //display the error to the user and abort
            if(error){
                return throwError(error.reason);
            }

            Bert.alert( 'บันทึกเรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
            $(e.target).find('[name=color_name]').val('');
            Router.go('AdminCatColorCreate');
        });
    },
    'click .cancel-process': function(){
        Router.go('AdminCatColorList');
    }
});
