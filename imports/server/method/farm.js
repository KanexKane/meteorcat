Meteor.methods({
    catDelete: function(_id){
        check(_id, String);
        Cats.remove(_id);
    },
    catBreedCreate: function(breedAttributes){
        check(Meteor.userId(), String);
        check(breedAttributes, {
            breed_name: String,
            breed_thai_name: String
        });

        var errors = validateBreed(breedAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catBreedErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var breed = _.extend(breedAttributes, {
            breed_slug: breedAttributes.breed_name.replace(/\s+/g, '-').toLowerCase(),
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var breedId = CatBreeds.insert(breed);
        return {
            _id: breedId
        };
    },
    catBreedEdit: function(breedAttributes, _id) {
        check(Meteor.userId(), String);
        check(_id, String);
        check(breedAttributes, {
            breed_name: String,
            breed_thai_name: String
        });

        var errors = validateBreed(breedAttributes);
        if (!_.isEmpty(errors)) {
            return Session.set('catBreedErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var breed = _.extend(breedAttributes, {
            breed_slug: breedAttributes.breed_name.replace(/\s+/g, '-').toLowerCase(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        CatBreeds.update(_id, {$set: breed});
        return {
            _id: _id
        };
    },
    catBreedDelete: function(_id){
        check(_id, String);
        CatBreeds.remove(_id);
    },
    catColorCreate: function(colorAttributes){
        check(Meteor.userId(), String);
        check(colorAttributes, {
            color_name: String
        });

        var errors = validateColor(colorAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var color = _.extend(colorAttributes, {
            create_by_user_id: user._id,
            create_at: new Date(),
            update_by_user_id: user._id,
            update_at: new Date()
        });

        var colorId = CatColors.insert(color);
        return {
            _id: colorId
        };
    },
    catColorEdit: function(colorAttributes, _id){
        check(Meteor.userId(), String);
        check(_id, String);
        check(colorAttributes, {
            color_name: String
        });

        var errors = validateColor(colorAttributes);
        if(!_.isEmpty(errors)){
            return Session.set('catColorErrors', errors);
        }

        var user = Meteor.user();
        // _extend() เป็นส่วนหนึ่งของไลบรารี่ Underscore
        // และช่วยให้คุณ “extend” อ็อบเจกต์ตัวนึงด้วยคุณสมบัติของอีกตัวได้
        var color = _.extend(colorAttributes, {
            update_by_user_id: user._id,
            update_at: new Date()
        });

        CatColors.update(_id, { $set: color });
        return {
            _id: _id
        };
    },
    catColorDelete: function(_id){
        check(_id, String);
        CatColors.remove(_id);
    },
    checkExistsFarmUrl( url ) {
        check(url, String);

        var userId = Meteor.userId();

        var farm = Farms.find( { farm_user_id: { $ne: userId }, farm_url: url } );

        if( farm.count() > 0 ) {
            return true;
        } else {
            return false;
        }
    },
    updateViewCat: function ( id ) {
        check( id, String );

        var cat = Cats.findOne( id );
        cat.views = cat.views + 1;

        Cats.update( { _id: id }, { $set: cat } );
    },
    updateViewFarm: function ( id ) {
        check( id, String );

        var farm = Farms.findOne( id );

        if ( !farm.views ) {
            farm.views = 1;
        } else {
            farm.views = farm.views + 1;
        }

        farm.updated_at = new Date();

        Farms.update( { _id: id }, { $set: farm } );
    },
    updateVisitorFarm: function ( id ) {
        check( id, String );

        var farm = Farms.findOne( id );
        if ( !farm.visitors ) {
            farm.visitors = 1;
        } else {

            farm.visitors = farm.visitors + 1;
        }

        farm.updated_at = new Date();

        Farms.update( { _id: id }, { $set: farm } );
    },
    catCommentInsert: function(commentAttributes) {
        check(commentAttributes, {
          cat_id: String,
          body: String,
          author: String,
        });

        var cat = Cats.findOne(commentAttributes.cat_id);
        
        var clientIp = this.connection.clientAddress;

        var comment = {
            cat_id: commentAttributes.cat_id,
            created_at: new Date(),
            ip: clientIp,
            comment_message: commentAttributes.body,
            comment_author: commentAttributes.author,

        };

        if (!cat)
          throw new Meteor.Error('invalid-comment', 'You must comment on a post');

        if ( !Meteor.user() ) {
            comment = _.extend(comment, {
                comment_author_id: 'not register user',
            });
        } 

        // create the comment, save the id
        comment._id = CatComments.insert(comment);

        // update the post with the number of comments
        if ( cat.commentsCount ) {
            cat.commentsCount = cat.commentsCount + 1;    
        } else {
            cat.commentsCount = 1;
        }
        
        
        Cats.update(comment.cat_id, { $set: cat });

        // now create a notification, informing the user that there's been a comment
        //createCommentNotification(comment);

        return comment._id;
    },
})