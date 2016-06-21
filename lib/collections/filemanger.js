FileManager.includedCollections = [ BlogImages, farmCats ];

if ( Meteor.isServer ) {
    FileManagerGroups.allow({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    });
}