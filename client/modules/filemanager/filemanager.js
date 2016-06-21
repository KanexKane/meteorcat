Template.AdminFileManager.helpers({
    rowsData: function( ){
        var rows = [];
        _.each(this.assets.fetch(), function(data, i){
            var rowsNumber = Math.floor(i / 4);
            if(rows[rowsNumber] == null){
                rows[rowsNumber] = {rows:[]};
            }
            rows[rowsNumber].rows.push(data);
        });
        console.log(rows);
        return rows;
    },
});

Template.AdminFileManager.events({
    'click .copy-link': function (e) {
        var target = $(e.currentTarget).parents().parent().children('input');
        target.select();
        
        if (document.queryCommandSupported('copy')) {
            document.execCommand("copy");
        } else {
            Bert.alert( 'ไม่สามารถใช้ได้กรุณากด Ctrl+C (Windows) หรือ  Cmd+C (Mac) แทน', 'danger', 'fixed-top', 'fa-remove' );
        }
        
    },
    'click .delete-image': function (e) {
        if ( confirm('ต้องการลบไฟล์นี้?') ) {
            var target = $(e.currentTarget).parent().parent().parent();
            var id = target.attr('data-id');

            Meteor.call('deleteBlogImage', id, function(err, result) {
                if (err) {
                    Bert.alert( 'ไม่สามารถลบได้ กรุณาลองใหม่ภายหลัง', 'warning', 'fixed-top', 'fa-information' );
                } else {
                    Bert.alert( 'ลบไฟล์เรียบร้อยแล้ว', 'success', 'fixed-top', 'fa-check' );
                }
            });
        }

    }
});