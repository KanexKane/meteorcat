import '/imports/client/register-helpers-farm';

Template.Farms.helpers({
    rowFarm: function() {
        var rows = [];
        var chunkSize = 3;
        var farms = this.farms.fetch();
        for (var i = 0; i < farms.length; i+= chunkSize) {
          rows.push(farms.slice(i, i + chunkSize));
        }

        return rows;
    },
    searchKeyword: function() {
        var searchKeyword = Router.current().params.query.search;
        if ( searchKeyword ) {
            return searchKeyword;
        }
    }
});

Template.Farms.events({
    'submit form': function(event) {
        event.preventDefault();

        var searchKeyword = $(event.target).find('[name=inputSearch]').val(); 

        Router.go('Farms', {}, { query: 'search=' + searchKeyword });
    }
});