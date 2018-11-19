describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
  });
});

describe('User', function() {
  describe('#get()', function() {
    it('should get without error', function(done) {
      var user = new User();
      user.get('Benjamin')
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
  });
});
