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
        }
    }
});