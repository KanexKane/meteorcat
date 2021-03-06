import '/imports/client/register-helpers-farm.js';

Template.FarmHome.helpers({
    rowCats: function () {
        var rows = [];
        var farm = this.farm;
        _.each( CatBreeds.find({}).fetch(), function ( breed, i ) {
            var rowsNumber = i;
            var isFirst = false;
            _.each( Cats.find({ cat_breed: breed._id }).fetch(), function ( cat, i, list ) {

                    // ไว้เช็คว่าเป็นตัวแรกของสายพันธุ์นั้นๆ
                    if ( !isFirst ) {
                        cat.isFirst = true;
                        isFirst = true;
                    }
                    
                    // ถ้าตัวต่อไปไม่ใช่ breed id เดียวกันแล้วให้ถือว่าอันนี้เป็นอันสุดท้าย
                    if ( list.length - 1 === i ) {
                        cat.isLast = true;
                    }

                    cat.breed_name = breed.breed_name;
                    cat.breed_thai_name = breed.breed_thai_name;
                    cat.breed_slug = breed.breed_slug;
                    cat.farm_url = farm.farm_url;
                    if ( rows[rowsNumber] == null ) {
                        rows[rowsNumber] = {cats:[]};
                    }
                    rows[rowsNumber].cats.push( cat );
            } );
        } );

        return rows;
    }
});