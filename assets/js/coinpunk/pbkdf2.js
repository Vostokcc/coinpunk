coinpunk.PBKDF2 = function() {
  this.version = 1;
  this.iterations = 200;
  this.keySizeBits = 256;

  this.hmacSHA512 = function(key) {
    var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha512);
    this.encrypt = function() {
      return hasher.encrypt.apply(hasher, arguments);
    };

  };

  this.hex = sjcl.codec.hex, count = 2048;

  this.create = function(plaintextPassword) {
    var hexGeneratedSalt = this.hex.fromBits(sjcl.random.randomWords('10','0'));
    var hashedPassword   = this._compute(plaintextPassword, hexGeneratedSalt);

    return this.formatOutput(hashedPassword, hexGeneratedSalt);
  };

  this.getHash = function(plaintextPassword, hexSalt) {
    var hashedPassword = this._compute(plaintextPassword, hexSalt);
    return this.formatOutput(hashedPassword, hexSalt);
  };

  this._compute = function(plaintextPassword, hexSalt) {
    var bitArraySalt = this.hex.toBits(hexSalt);
    var hashedPasswordBitArray = sjcl.misc.pbkdf2(plaintextPassword, bitArraySalt, this.iterations, this.keySizeBits, this.hmacSHA512);
    return this.hex.fromBits(hashedPasswordBitArray);
  }

  this.formatOutput = function(hashedPassword, salt) {
    return {"hashedPassword": hashedPassword, "salt": salt, version: this.version}
  }
}