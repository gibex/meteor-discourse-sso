Router.map(function() {
  return this.route('discourse_sso', {
    path: 'discourse/sso',
    onBeforeAction: function() {
      return Session.set('discourse_sso_error', null);
    },
    data: function() {
      return {
        params: {
          sso: this.params.sso,
          sig: this.params.sig
        }
      };
    }
  });
});
