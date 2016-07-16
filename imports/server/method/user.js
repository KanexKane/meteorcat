//===================
// Methods for Roles
//===================

//Roles.addUsersToRoles(userid, [], 'default-group');
//Roles.setUserRoles(userid, [], 'default-group')

Meteor.methods({
    manualCreateUser: function ( data ) {

        var newUser = Accounts.createUser( { username: data.username, password : data.password } );

        Meteor.users.update(newUser, { $set: { emails: { address: data.email } } });

        return newUser;        
    },
    updateUserProfile: ( userId, profile, email ) => {


        Meteor.users.update( userId, {
            $set: {
               "profile.firstname": profile.firstname,
               "profile.lastname": profile.lastname,
               "emails.address": email.emails.address,
            }
        });
        return true;
    },
    updateProfileImage: (imageId) => {
        Meteor.users.update(Meteor.user(), { 
            $set: {  
                "profile.image": imageId    
            } 
        });
        return true;
    },
    addUserToRoles: function( userId, roleName, groupName ) {
        Roles.addUsersToRoles(userId, roleName, groupName);
    }
});