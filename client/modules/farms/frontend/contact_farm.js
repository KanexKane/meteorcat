Template.FarmContactUs.helpers({
    farmMapImage: ( imageId ) => {
        return farmImages.findOne( imageId ).url();
    },
    farmLogo: ( imageId ) => {
        return farmLogos.findOne( imageId ).url();
    }
});