Meteor.publish(null, function (){
  return Meteor.roles.find({})
});

Meteor.publish('notifications', function(){
    return Notifications.find({ user_id: this.userId, read: false});
});

Meteor.publish('blogs', function(findOptions){
    return BlogPosts.find({}, findOptions);
});
Meteor.publish('blogDetail', function(_id){
    check(_id, String);
    return BlogPosts.find({_id: _id});
});
Meteor.publish('blogCategoryDetail', function(_id){
    check(_id, String);
    return BlogCategories.find({_id: _id});
});
Meteor.publish('blogDetailBySlug', function(post_slug){
    check(post_slug, String);
    return BlogPosts.find({post_slug: post_slug});
});
Meteor.publish('blogInCategory', function(category_slug){
    var category_id = BlogCategories.findOne({ category_slug: category_slug})._id;
    return BlogPosts.find({ post_category: category_id });
});
Meteor.publish('categories', function(category_slug){
    if(category_slug){
        return BlogCategories.find({ category_slug: category_slug });
    } else {
        return BlogCategories.find({});
    }
});

Meteor.publish('blogimages', function(){
    return BlogImages.find({});
});

//==================================================
// Farm
//==================================================

// ฟาร์มทั้งหมด
Meteor.publish('allFarms', function(){
    return Farms.find({ });
});
// รายละเอียดฟาร์ม หาโดยใช้ userId
Meteor.publish('farmInfoByUserId', function(userId){
    return Farms.find({ farm_user_id: userId });
});
// รายละเอียดฟาร์ม หาโดยใช้ farm_url
Meteor.publish('farmInfoByUrl', function(farm_url){
    return Farms.find({ farm_url: farm_url });
});
// แมวทั้งหมดในฟาร์ม หาโดยใช้ farm_url
Meteor.publish('allCatsInFarmByUrl', function(farm_url){
    var farm;
    if(farm_url !== undefined){
        farm = Farms.findOne({ farm_url: farm_url });
    }else{
        farm = Farms.findOne({ farm_user_id: this.userId });
    }
    return Cats.find({ farm_id: farm._id });
});
// แมวทั้งหมดในฟาร์ม หาโดยใช้ farm_id
Meteor.publish('allCatsInFarmById', function(farm_id){
    return Cats.find({ farm_id: farm._id });
});
// แมวทั้งหมดในฟาร์ม หาโดยใช้ user_id
Meteor.publish('allCatsInFarmByUserId', function(userId, breedId, searchKeyword){
    var farms = Farms.findOne({ farm_user_id: userId });
    if( breedId )
    {
        if( searchKeyword )
        {
            return Cats.find( { 
                farm_id: farms._id, 
                cat_breed: breedId,
                cat_name: {
                    $regex: searchKeyword
                }
            } );
        }
        else 
        {
            return Cats.find( { farm_id: farms._id, cat_breed: breedId } );
        }   
    } 
    else 
    {
        if( searchKeyword )
        {
            return Cats.find( { 
                farm_id: farms._id, 
                cat_name: {
                    $regex: searchKeyword
                }
            } );
        }
        else 
        {
            return Cats.find({farm_id: farms._id });
        }
    }
    
});
// รายละเอียดแมว หาโดยใช้ slug
Meteor.publish('catDetailBySlug', function(farm_url, breed_slug, cat_slug){
    var farm = Farms.findOne({ farm_url: farm_url });
    var slug = breed_slug+'/'+cat_slug;
    return Cats.find({ cat_slug: slug, farm_id: farm._id });
});
// รายละเอียดแมว หาโดยใช้ id
Meteor.publish('catDetailById', function(id){
    return Cats.find({ _id: id });
});
// สีของแมวทั้งหมด
Meteor.publish('allCatColors', function(){
    return CatColors.find({});
});
// รายละเอียดสีแมว
Meteor.publish('detailCatColorById', function(id){
    return CatColors.find({ _id: id });
});
// สายพันธุ์ของแมวทั้งหมด
Meteor.publish('allCatBreeds', function(){
    return CatBreeds.find({}, {sort: {breed_name: 1}});
});
// สายพันธุ์แมวทั้งหมดในฟาร์ม หาโดยใช้ farm_url
Meteor.publish('allCatBreedsInFarmByUrl', function(farm_url){
    var farm = Farms.findOne({ farm_url: farm_url });
    var catUniqueBreed = Cats.find( 
                                { 
                                    farm_id: farm._id 
                                }, 
                                { fields: 
                                    { 
                                        'cat_breed': 1,
                                        '_id': 0
                                    } 
                                } 
                                ).fetch();

    // แต่รูปแบบมันยังใช้ไม่ได้เพราะมันจะเป็น catUniqueBreed[0].cat_breed
    // เลยต้องเอามาแปลงให้เป็น Array แบบชั้นเดียวถึงจะนำไปใช้ในขั้นตอนต่อไปได้
    var catBreeds = [];
    _.each( catUniqueBreed, function(cat, i){
        catBreeds.push( cat.cat_breed );
    });
    // เอา Array ที่ได้ไปหาที่ CatBreeds where ด้วย _id in catBreeds
    return CatBreeds.find({ _id: { $in: catBreeds } }, {sort: {breed_name: 1}});
});
// สายพันธุ์แมวทั้งหมดในฟาร์ม หาโดยใช้ farm_id
Meteor.publish('allCatBreedsInFarmByUserId', function(userId){
    var farms = Farms.findOne({ farm_user_id: userId });
    // ไปหาว่าในฟาร์มเรามีสายพันธุ์อะไรถูกเพิ่มเข้าไปบ้าง โดยเอาค่ามาแค่ cat_breed
    var catUniqueBreed = Cats.find( 
                                { 
                                    farm_id: farms._id 
                                }, 
                                { fields: 
                                    { 
                                        'cat_breed': 1,
                                        '_id': 0
                                    } 
                                } 
                                ).fetch();
    // แต่รูปแบบมันยังใช้ไม่ได้เพราะมันจะเป็น catUniqueBreed[0].cat_breed
    // เลยต้องเอามาแปลงให้เป็น Array แบบชั้นเดียวถึงจะนำไปใช้ในขั้นตอนต่อไปได้
    var catBreeds = [];
    _.each( catUniqueBreed, function(cat, i){
        catBreeds.push( cat.cat_breed );
    });
    // เอา Array ที่ได้ไปหาที่ CatBreeds where ด้วย _id in catBreeds
    return CatBreeds.find( { _id: { $in: catBreeds } }, { sort: { breed_name: 1 } } );
});
// รายละเอียดสายพันธุ์แมว
Meteor.publish('detailCatBreedById', function(id){
    return CatBreeds.find({ _id: id.toString() });
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

Meteor.publish('allImageBlogs', () => {
    return BlogImages.find({});
});

Meteor.publish('allBanners', function( position, searchKeyword ) {

    if( searchKeyword && position ) {
        return Banners.find( { 
            position: position ,
            $or: [ 
                    { 
                        name: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        rent_name: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        rent_phone: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        rent_email: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        price: {
                            $regex: searchKeyword
                        }
                    },
                ]
            
        } );

    } else if ( searchKeyword && !position ) {

        return Banners.find( {
             
                $or: [ 
                    { 
                        name: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        rent_name: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        rent_phone: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        rent_email: {
                            $regex: searchKeyword
                        }
                    },
                    { 
                        price: {
                            $regex: searchKeyword
                        }
                    },
                ]
        } );

    } else if ( !searchKeyword && position ) {
        
        return Banners.find( { position: position } );

    } else {

        return Banners.find( {} );

    }
});

Meteor.publish('allBannerPositions', function() {
    return BannerPositions.find({});
});

Meteor.publish('allImageBanners', function() {
    return BannerImages.find({});
});

Meteor.publish('bannerDetail', function( id ) {
    return Banners.find({ _id: id });
});