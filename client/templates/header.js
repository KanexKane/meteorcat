Template.header.helpers({
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
          return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    }
});

Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
    farmUrl: () => {
        if( Meteor.userId() ) {
            var farm = Farms.findOne({ farm_user_id: Meteor.userId() });

            if( !!farm && farm.length > 0 ) {
                return farm.farm_url;
            }
            
        } 
        
    },
    farmName: () => {
        if( Meteor.userId() ) {
            var farm = Farms.findOne({ farm_user_id: Meteor.userId() });

            if ( !!farm && farm.length > 0 ) {
                return farm.farm_name;
            }
            
        } 
    }
});