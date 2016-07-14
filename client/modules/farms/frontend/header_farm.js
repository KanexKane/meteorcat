import '/imports/client/register-helpers-common.js';

Template.FarmHeader.onRendered( function () {
    
    if ( !!Session.get('visitor_already_date') ) {
        // มีการเก็บ date ไว้ด้วยว่า Session นี้เป็นของวันไหน เอาแค่ส่วนของวันไม่เอาเวลาเพราะต้องการดูว่ามันข้ามวันหรือยัง ถ้าข้ามแล้วจะทำการ Reset Session นี้
        // เอามา diff กัน 
        var date1 = new Date( Session.get('visitor_already_date') );
        var date2 = new Date();

        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = timeDiff / (1000 * 3600 * 24);

        if ( diffDays >= 1 ) {
            Session.clear('visitor_already_count');
            Session.clear('visitor_already_date');
        }
    }


    this.autorun(function (c) {
        if ( Template.currentData() && Template.currentData().farm ) {
            var farm = Template.currentData().farm;

            // update views
            Meteor.call('updateViewFarm', farm._id , function (error, result) {});
            
            // update visitor
            if ( !!!Session.get('visitor_already_count') ) {
                
                Meteor.call('updateVisitorFarm', farm._id , function (error, result) {});
                Session.setPersistent('visitor_already_count', [farm._id] );

                // เก็บวันเวลาเพื่อเช็คว่าข้ามวันหรือยัง ถ้าข้ามวันตอนเริ่ม function จะทำการลบ Session
                // เก็บแต่วันไม่เอาเวลาเพื่อเวลาเช็คจะได้ง่ายขึ้น
                var nowDate = moment(new Date()).format('MM/DD/YYYY');
                Session.setPersistent( 'visitor_already_date', nowDate );
                c.stop();
            } else {

                var visitorAlreadyCount = Session.get('visitor_already_count');
                if ( _.indexOf( visitorAlreadyCount, farm._id ) == -1 ) {
                    // if not have
                    visitorAlreadyCount.push(farm._id);
                    // update count visitor

                    Meteor.call('updateVisitorFarm', farm._id , function (error, result) {});
                    // set Session
                    Session.setPersistent('visitor_already_count', visitorAlreadyCount );
                } 

                c.stop();
            }

            c.stop();
        }
        
    });
});

Template.FarmHeader.helpers({
    farmLogo: ( imageId ) => {
        var logo = farmLogos.findOne( imageId );
        if ( !!logo )        
            return logo.url();
        
    },
    farmCover: ( imageId ) => {
        var cover = farmCovers.findOne( imageId );

        if( !!cover ) {
            return cover.url();
        } else {
            return '/images/no-farm-cover.png' ;
        }
    }
});