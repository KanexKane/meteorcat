Template.FarmContactUs.helpers({
    farmMapImage: ( imageId ) => {
        return farmImages.findOne( imageId ).url();
    },
    farmLogo: ( imageId ) => {
        return farmLogos.findOne( imageId ).url();
    }
});

Template.FarmContactUs.onRendered( () => {
    // <script src="https://maps.googleapis.com/maps/api/js" async defer></script>

    // $.getScript("//maps.googleapis.com/maps/api/js", function() {
    //     var data = Template.instance().
    //     var mapDiv = document.getElementById('map');

    //     var ads, adsbygoogle;
    //     ads = '<ins class="adsbygoogle" style="display:block;" data-ad-client="ca-pub-2681012140605765" data-ad-slot="9591021875" data-ad-format="auto"></ins>';
    //     $('#googleAdsHeader').html(ads);
    //     return (adsbygoogle = window.adsbygoogle || []).push({});
    // });
    function initMap() {
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8
        });
    }
});