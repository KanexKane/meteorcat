Template.FarmContactUs.helpers({
    farmMapImage: ( imageId ) => {
        return farmImages.findOne( imageId ).url();
    },
    farmLogo: ( imageId ) => {
        return farmLogos.findOne( imageId ).url();
    }
});

Template.FarmContactUs.onRendered( () => {
    function initMap() {
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8
        });
    }
});