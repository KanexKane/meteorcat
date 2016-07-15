Meteor.publish('blogimages', function(){
    return BlogImages.find({});
});
Meteor.publish('allImageBlogs', () => {
    return BlogImages.find({});
});


// รูปภาพของฟาร์มทั้งหมด หาโดยใช้ farm_url
Meteor.publish('imageFarmCatsByFarmUrl', (farm_url) => {
    var farm = Farms.findOne({ farm_url: farm_url });
    var userId = farm.farm_user_id;

    return farmCats.find({ 
        $query: {
            'metadata.owner': userId
        } 
    });
});

Meteor.publish('imageFarmImagesByFarmUrl', (farm_url) => {
    var farm = Farms.findOne({ farm_url: farm_url });
    var userId = farm.farm_user_id;

    return farmImages.find({ 
        $query: {
            'metadata.owner': userId
        } 
    });
});

Meteor.publish('imageFarmCoversByFarmUrl', (farm_url) => {
    var farm = Farms.findOne({ farm_url: farm_url });
    var userId = farm.farm_user_id;

    return farmCovers.find({ 
        $query: {
            'metadata.owner': userId
        } 
    });
});

Meteor.publish('imageFarmLogosByFarmUrl', (farm_url) => {
    var farm = Farms.findOne({ farm_url: farm_url });
    var userId = farm.farm_user_id;

    return farmLogos.find({ 
        $query: {
            'metadata.owner': userId
        } 
    });
});

Meteor.publish('allImageBanners', function() {
    return BannerImages.find({});
});

Meteor.publish('farmcatimages', function () {
    return farmImages.find({ 
        $query: {
            'metadata.owner': this.userId
        } 
    });
});

Meteor.publish('allAssetImage', function () {
    return BlogImages.find()
});

Meteor.publish('allImageFarmCats', function () {
    return farmCats.find();
});
Meteor.publish('allImageFarmLogos', function() {
    return farmLogos.find({});
});
Meteor.publish('allImageFarmCovers', function() {
    return farmCovers.find({});
});

Meteor.publish('userimages', () => {
    var userImages = UserImages.find();
    if (userImages.count() == 0) {
        return this.ready();
    } else {
        return userImages;
    }
});