coinpunk.Wallet = function(cipherText, cipherPasswordInput) {
  var store = {};
  var cipherPassBase64 = null;

  if(cipherText && cipherPassword) {
    var cipherPassword = cipherPassword;
    store = sjcl.decrypt(cipherPassword, cipherText);
  }

  this.encrypt = function() {
    console.log(cipherPassBase64);
    return sjcl.encrypt(cipherPassBase64, JSON.stringify(store));
  };

  this.createNewAddress = function() {
    if(!store.privateKeys)
      store.privateKeys = [];
    
    var eckey = new Bitcoin.ECKey();
    store.privateKeys.push(eckey.getExportedPrivateKey());
    return eckey.getBitcoinAddress();
  };

  this.cipherPass = function(plaintext) {
    if(!salt)
      var salt = sjcl.random.randomWords(2, 0);

    cipherPassBase64 = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(plaintext, salt));
    cipherPassSalt = salt;
    
    return {cipherPass: cipherPassBase64, cipherPassSalt: cipherPassSalt};
  };

  this.verification = function(salt) {
    if(!salt)
      var salt = sjcl.random.randomWords(2, 0);

    var cipherBase64 = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(cipherPassword, salt));

    return {verificationKey: cipherBase64, salt: salt};
  };
}