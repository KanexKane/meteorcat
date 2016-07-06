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


Meteor.publish('bannerDetail', function( id ) {
    return Banners.find({ _id: id });
});