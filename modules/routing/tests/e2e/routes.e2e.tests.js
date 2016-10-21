'use strict';

describe('Routes E2E Tests:', function () {
  describe('Test routes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/routes');
      expect(element.all(by.repeater('route in routes')).count()).toEqual(0);
    });
  });
});
