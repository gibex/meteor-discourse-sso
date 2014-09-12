Meteor.methods({
  discourse_sso: function(params) {
    var sso, sso_secret, user;
    check(params, Object);
    user = User.first(this.userId);
    if (!user) {
      throw new Meteor.Error(403, 'Not logged in.');
    }
    if (!user.is_authorized_to_download_pro()) {
      throw new Meteor.Error(403, 'Unauthorized.');
    }
    sso_secret = process.env.DISCOURSE_SSO_SECRET;
    sso = SingleSignOn.parse(params, sso_secret);
    sso.email = user.email();
    if (user.profile && user.profile.name) {
      sso.name = user.profile.name;
    }
    sso.external_id = user._id;
    sso.sso_secret = sso_secret;
    return sso.to_url("http://privatebeta.spritebuilder.com/session/sso_login");
  }
});
