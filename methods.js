Meteor.methods({
  discourse_sso: function(params) {
    var sso, sso_secret, user;
    check(params, Object);
    // user = User.first(this.userId);
    var user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(403, 'Not logged in.');
    }
    // if (!user.is_authorized_to_download_pro()) {
    //   throw new Meteor.Error(403, 'Unauthorized.');
    // }
    sso_secret = process.env.DISCOURSE_SSO_SECRET;
    sso = SingleSignOn.parse(params, sso_secret);
    sso.email = user.emails[0].address;
    if (user.profile && user.profile.first_name) {
      sso.name = user.profile.first_name + user.profile.last_name;
    }
    sso.external_id = user._id;
    sso.sso_secret = sso_secret;
    return sso.to_url(process.env.DISCOURSE_BACK_URL);
  }
});

    // "DISCOURSE_SSO_SECRET": "ZLBE8MbFoUzwW3d6",
    // "DISCOURSE_BACK_URL": "http://forum.motosurfnation.com/session/sso_login" 
