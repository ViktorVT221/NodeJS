const assert = require('assert');
const factorial = require('../functions');

describe('Factorial Function', function() {
    it('should return 120 for factorial(5)', function() {
        assert.strictEqual(factorial(5), 120);
    });

    it('should return 720 for factorial(6)', function() {
        assert.strictEqual(factorial(6), 720);
    });

    it('should return 1 for factorial(0)', function() {
        assert.strictEqual(factorial(0), 1);
    });

    it('should return null for factorial(-5)', function() {
        assert.strictEqual(factorial(-5), null);
    });

    it('should return null for factorial(-6)', function() {
        assert.strictEqual(factorial(-6), null);
    });
});
