bingoGenerator = require('../bingo_generator.js').bingoGenerator;

QUnit.test("RemoveEmptyElements", function(assert) {
    "use strict";
    var testInput = ",,,A,,B,,,C,";
    var testArray = testInput.split(",");
    var cleanedArray = bingoGenerator.removeEmptyElements(testArray);
    assert.equal(cleanedArray.length, 3, "Array has 3 elements");
    assert.equal(cleanedArray[0], "A", "First element is A");
    assert.equal(cleanedArray[1], "B", "Second element is B");
    assert.equal(cleanedArray[2], "C", "Third element is C");
});
