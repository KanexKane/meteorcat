Template.FarmHome.helpers({
    rowCats: function () {
        var rows = [];
        var farm = this.farm;
        _.each( CatBreeds.find({}).fetch(), function ( breed, i ) {
            var rowsNumber = i;
            var isFirst = false;
            _.each( Cats.find({}).fetch(), function ( cat, i ) {
                if ( breed._id === cat.cat_breed ) {
                    // ไว้เช็คว่าเป็นตัวแรกของสายพันธุ์นั้นๆ
                    if ( !isFirst ) {
                        cat.isFirst = true;
                        isFirst = true;
                    }
                    cat.breed_name = breed.breed_name;
                    cat.breed_thai_name = breed.breed_thai_name;
                    cat.farm_url = farm.farm_url;
                    if ( rows[rowsNumber] == null ) {
                        rows[rowsNumber] = {cats:[]};
                    }
                    rows[rowsNumber].cats.push( cat );
                }
            } );
        } );

        return rows;
    },
    dayOfBirth: ( date ) => {
        return moment( date ).format('DD/MM/YYYY');
    },
    price: ( price ) => {
        return price === undefined ? 0 : price;
    },
    catFeaturedImage( imageId ) {
        if ( !!imageId ) {
            var image = farmCats.findOne( imageId );
            return image.url();
        } else {
            return 'images/no-cat-image.jpg';
        }
    },
    catFeaturedImageCover( imageId ) {
        if ( !!imageId ) {
            var image = farmCats.findOne( imageId );
            return image.url();
        } else {
            return 'images/no-cat-image-cover.jpg';
        }
    }
});