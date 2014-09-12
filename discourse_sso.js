Template.discourse_sso.helpers({
  user_logged_in: function() {
    return Meteor.user();
  },
  error: function() {
    return Session.get('discourse_sso_error');
  }
});

Template.discourse_sso_error.helpers({
  error_message: function() {
    return Session.get('discourse_sso_error').message;
  }
});

Template.discourse_sso_forum_login.rendered = function() {
  return Meteor.call('discourse_sso', this.data.params, function(error, result) {
    if (error) {
      return Session.set('discourse_sso_error', error);
    } else {
      return window.location.href = result;
    }
  });
};
