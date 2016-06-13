Template.FarmHeader.helpers({
    farmLogo: ( imageId ) => {
        return farmLogos.findOne( imageId ).url();
    },
    farmCover: ( imageId ) => {
        return farmCovers.findOne( imageId ).url();
    }
});