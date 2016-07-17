// ฟาร์มทั้งหมด
Meteor.publish('allFarms', function( searchKeyword ){
    if( searchKeyword )
    {
        return Farms.find( { 
            farm_name: {
                $regex: new RegExp(searchKeyword.toLowerCase(), "i")
            }
        } );
    }
    else 
    {
        return Farms.find({  });
    }  
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
                    $regex: new RegExp(searchKeyword.toLowerCase(), "i")
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
                    $regex: new RegExp(searchKeyword.toLowerCase(), "i")
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

Meteor.publish('allCatsInBreedSlugByFarmUrl', function( farm_url, slug ) { 
    var breed = CatBreeds.findOne({ breed_slug: slug });
    var farm = Farms.findOne({ farm_url: farm_url });

    return Cats.find({ cat_breed: breed._id, farm_id: farm._id });
});

Meteor.publish('recommendedCats', function() {
    return Cats.find({}, { 
        sort: { 
            views: -1 
        }, 
        limit: 6 
    });
});

Meteor.publish('catComments', function ( catId, findOptions ) {
    check( catId, String );
    check( findOptions, {
        sort: Object,
        limit: Number
    });


    return CatComments.find({ cat_id: catId }, findOptions);
});