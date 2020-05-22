removeEmptyElements = function (arr) {
    "use strict";
    var newArray = [], i = 0;
    for (i = 0; i < arr.length; i += 1) {
        if (arr[i]) {
            newArray.push(arr[i]);
        }
    }
    return newArray;
};

QUnit.test("RemoveEmptyElements", function(assert) {
    "use strict";
    var testInput = ",,,A,,B,,,C,";
    var testArray = testInput.split(",");
    var cleanedArray = removeEmptyElements(testArray);
    assert.equal(cleanedArray.length, 3, "Array has 3 elements");
    assert.equal(cleanedArray[0], "A", "First element is A");
    assert.equal(cleanedArray[1], "B", "Second element is B");
    assert.equal(cleanedArray[2], "C", "Third element is C");
});
