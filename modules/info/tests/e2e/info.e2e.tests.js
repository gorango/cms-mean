'use strict';

describe('Info E2E Tests:', function () {
  describe('Test info page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/info');
      expect(element.all(by.repeater('info in info')).count()).toEqual(0);
    });
  });
});
