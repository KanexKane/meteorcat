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
    }
});