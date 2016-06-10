Template.header.helpers({
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
          return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    },
    farmUrl: () => {
        var farm = Farms.findOne({ farm_user_id: Meteor.userId() });
        console.log(farm);
    }
});

Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
    farmUrl: () => {
        var farm = Farms.findOne({ farm_user_id: Meteor.userId() });
        return farm.farm_url;
    },
    farmName: () => {
        var farm = Farms.findOne({ farm_user_id: Meteor.userId() });
        return farm.farm_name;
    }
});