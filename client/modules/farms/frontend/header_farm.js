Template.FarmHeader.helpers({
    farmLogo: ( imageId ) => {
        var logo = farmLogos.findOne( imageId );
        if( !!logo ) {
            return logo.url();
        }
    },
    farmCover: ( imageId ) => {
        var cover = farmCovers.findOne( imageId );

        if( !!cover ) {
            return cover.url();
        } else {
            return '/images/no-farm-cover.png' ;
        }
    },
    activeRouteClass: function(/* route names */) {
        var args = Array.prototype.slice.call(arguments, 0);
        args.pop();

        var active = _.any(args, function(name) {
            return Router.current() && Router.current().route.getName() === name
        });

        return active && 'active';
    }
});