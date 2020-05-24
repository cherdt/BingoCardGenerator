bingoGenerator = require('../bingo_generator.js').bingoGenerator;

QUnit.module("wordList");

QUnit.test("it removes empty elements", function(assert) {
  "use strict";
  var wordListString = ",,,A,,B,,,C,";

  var wordList = bingoGenerator.wordList(wordListString);

  assert.equal(wordList.length, 3, "Array has 3 elements");
  assert.equal(wordList[0], "A", "First element is A");
  assert.equal(wordList[1], "B", "Second element is B");
  assert.equal(wordList[2], "C", "Third element is C");
});

QUnit.test("it escapes angle brackets", function(assert) {
  "use strict";
  var wordListString = "<tag>";

  var wordList = bingoGenerator.wordList(wordListString);

  assert.equal(wordList.length, 1, "Array has 1 element");
  assert.equal(wordList[0], "&lt;tag&gt;", "Tag is escaped");
});

QUnit.test("it replaces internal newlines with break tags", function(assert) {
  "use strict";
  var wordListString = "A\nB,C\n\nD";

  var wordList = bingoGenerator.wordList(wordListString);

  assert.equal(wordList.length, 2, "Array has 2 elements");
  assert.equal(wordList[0], "A<br>B", "First element is AB with an internal break");
  assert.equal(wordList[1], "C<br><br>D", "Second element is CD with an internal break");
});

QUnit.test("it ignores leading newlines", function(assert) {
    "use strict";
    var wordListString = "A,\nB,\n\nC";

    var wordList = bingoGenerator.wordList(wordListString);

    assert.equal(wordList.length, 3, "Array has 3 elements");
    assert.equal(wordList[0], "A", "First element is A");
    assert.equal(wordList[1], "B", "Second element is B");
    assert.equal(wordList[2], "C", "Third element is C");
});

QUnit.test("it ignores trailing newlines", function(assert) {
    "use strict";
    var wordListString = "A\n,B\n\n,C";

    var wordList = bingoGenerator.wordList(wordListString);

    assert.equal(wordList.length, 3, "Array has 3 elements");
    assert.equal(wordList[0], "A", "First element is A");
    assert.equal(wordList[1], "B", "Second element is B");
    assert.equal(wordList[2], "C", "Third element is C");
});

QUnit.test("it ignores start-of-file newlines", function(assert) {
  "use strict";
  var wordListString = "\nA";

  var wordList = bingoGenerator.wordList(wordListString);

  assert.equal(wordList.length, 1, "Array has 1 element");
  assert.equal(wordList[0], "A", "First element is A");
});

QUnit.test("it ignores end-of-file newlines", function(assert) {
    "use strict";
    var wordListString = "A\n";

    var wordList = bingoGenerator.wordList(wordListString);

    assert.equal(wordList.length, 1, "Array has 1 element");
    assert.equal(wordList[0], "A", "First element is A");
});
