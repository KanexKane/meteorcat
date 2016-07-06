import '../imports/server/publish/blog';
import '../imports/server/publish/farm';
import '../imports/server/publish/image';
import '../imports/server/publish/notification';
import '../imports/server/publish/banner';

Meteor.publish(null, function (){
  return Meteor.roles.find({})
});