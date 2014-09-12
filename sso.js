var crypto, querystring,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { 
        for (var key in parent) { 
          if (__hasProp.call(parent, key)) child[key] = parent[key]; 
        } 
        function ctor() { this.constructor = child; } 
        ctor.prototype = parent.prototype; 
        child.prototype = new ctor(); 
        child.__super__ = parent.prototype; 
        return child; 
};

crypto = Npm.require('crypto');

querystring = Npm.require('querystring');

this.SingleSignOn = (function(_super) {
  var ACCESSORS;

  __extends(SingleSignOn, _super);

  function SingleSignOn() {
    return SingleSignOn.__super__.constructor.apply(this, arguments);
  }

  ACCESSORS = ['nonce', 'name', 'email', 'external_id'];

  SingleSignOn.parse = function(params, sso_secret) {
    var decoded, decoded_hash, sso;
    sso = this.init();
    sso.sso_secret = sso_secret;
    if (sso.sign(params.sso) !== params.sig) {
      throw new Error("Bad signature for payload");
    }
    decoded = (new Buffer(params.sso, 'base64')).toString();
    decoded_hash = querystring.parse(decoded);
    _.each(ACCESSORS, function(k) {
      return sso[k] = decoded_hash[k];
    });
    return sso;
  };

  SingleSignOn.prototype.sign = function(payload) {
    return crypto.createHmac('sha256', this.sso_secret).update(payload).digest('hex');
  };

  SingleSignOn.prototype.to_url = function(base_url) {
    return "" + base_url + (base_url.match(/\?/) ? '&' : '?') + (this.payload());
  };

  SingleSignOn.prototype.payload = function() {
    var payload;
    payload = new Buffer(this.unsigned_payload()).toString('base64');
    return "sso=" + (encodeURIComponent(payload)) + "&sig=" + (this.sign(payload));
  };

  SingleSignOn.prototype.unsigned_payload = function() {
    var unsigned_payload;
    unsigned_payload = {};
    _.each(ACCESSORS, function(k) {
      var val;
      if (val = this[k]) {
        return unsigned_payload[k] = val;
      }
    }, this);
    return querystring.stringify(unsigned_payload);
  };

  return SingleSignOn;

})(Minimongoid);
