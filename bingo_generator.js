/* jslint browser: true, devel: true */
/* global $ */

var dauber = {
    // If the target bingo card square has a daub, remove it. Otherwise, add a daub
    toggle: function (e) {
        "use strict";
        var i;
        var target = e.currentTarget;
        if (target.classList.contains("daub")) {
            for (i = 1; i <= 5; i = i + 1) {
                target.classList.remove("daubImg" + i);
                target.classList.remove("daubPos" + i);
            }
            target.classList.remove("daub");
        } else {
            target.classList.add("daub");
            target.classList.add("daubPos" + Math.ceil(Math.random() * 5));
            target.classList.add("daubImg" + Math.ceil(Math.random() * 5));
        }
    },

    // Iterate over any bingo cards on the page and attach mouse/touch events to each square
    init: function () {
        "use strict";
        var bingoSquare;
        var bingoSquares = document.getElementById("results").getElementsByTagName("td");
        for (bingoSquare of bingoSquares) {
            bingoSquare.addEventListener("mousedown", this.toggle);
        }
    }
};

var bingoGenerator = {
    pageBreaks: 'on', // automatically inserts a page break after every 2 cards

    // Given an array, return the array minus any empty elements
    removeEmptyElements: function (arr) {
        "use strict";
        var newArray = [], i = 0;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i]) {
                newArray.push(arr[i]);
            }
        }
        return newArray;
    },

    formatFreespace: function (str, subheading) {
        "use strict";
        return '<strong>' + str + '<div class="freespace">' + subheading + '</div></strong>';
    },

    bingoCard: function (title, width, height, freespace, freespaceValue, freespaceSubheadingValue, freespaceRandom, list) {
        "use strict";
        var possibleSpaces, enoughSpaces, spaces, centerSquare, i, j, output;
        list = bingoGenerator.escapeHTML(list);
        list = bingoGenerator.newlineToBR(list);
        possibleSpaces = bingoGenerator.removeEmptyElements(list.split(","));

        // Two options for including random Free Space:
        // Option 1: We don't have enough. Include in random placement.
        // Option 2:- We have enough. Overwrite other option.
        enoughSpaces = true;
        if (possibleSpaces.length < width * height) {
            enoughSpaces = false;
        }

        // Option 1
        if (freespace === "true" && freespaceRandom === "true" && !enoughSpaces) {
            possibleSpaces.push(bingoGenerator.formatFreespace(freespaceValue, freespaceSubheadingValue));
        }

        // Create a random selection of the possible values
        spaces = [];

        // This works for squares with odd dimensions,, e.g. 3x3 or 5x5, but not for even squares or rectangles
        // var centerSquare = Math.floor(width*height/2);
        // We'll say center is the center row of the center column
        centerSquare = Math.floor(height / 2) * width + Math.floor(width / 2);

        for (i = 0; i <= width * height; i += 1) {
            if (i === centerSquare && freespace === "true" && freespaceRandom === "false") {
                spaces.push(bingoGenerator.formatFreespace(freespaceValue, freespaceSubheadingValue));
            } else {
                spaces.push(possibleSpaces.splice(Math.floor(Math.random() * possibleSpaces.length), 1)[0]);
            }
        }

        // Option 2
        if (freespace === "true" && freespaceRandom === "true" && enoughSpaces) {
            spaces[Math.floor(Math.random() * spaces.length)] = bingoGenerator.formatFreespace(freespaceValue, freespaceSubheadingValue);
        }

        // Output
        output = '<table><thead><tr><th colspan="' + width + '">' + title + '</th></tr></thead>';
        output += '<tbody>';
        for (i = 0; i < height; i += 1) {
            output += '<tr>';
            for (j = 0; j < width; j += 1) {
                output += '<td>' + spaces.shift() + '</td>';
            }
            output += '</tr>';
        }
        output += "</tbody></table>";
        $("#results").append(output);
    },

    // Generate Bingo Cards
    generate: function () {
        "use strict";
        var colsFilled, rowsFilled, spaces, i;

        // Check to make sure enough options are provided to fill the bingo card spaces
        spaces = bingoGenerator.removeEmptyElements($("#words").val().split(",")).length;
        if ($("#freespace").val()) {
            spaces += 1;
        }
        if (spaces < $("#width").val() * $("#height").val()) {
            alert("Warning: you do not have enough possible board options for the size of the board you selected!");
        }

        // Clear any previous results
        $("#results").html("");

        // Try to make nice printable pages -- we can fit about 10 pieces across and 6 down
        colsFilled = 0;
        rowsFilled = 1;

        // Loop over number of cards requested
        for (i = 0; i < document.getElementById("number").value; i += 1) {

            colsFilled += 1;
            if (bingoGenerator.pageBreaks === 'on' && colsFilled * $("#width").val() > 10) {
                rowsFilled += 1;
                if (rowsFilled * $("#height").val() > 6) {
                    $("#results").append('<div class="break">&nbsp;</div>');
                    rowsFilled = 1;
                } else {
                    $("#results").append('<div class="clear"></div>');
                }
                colsFilled = 1;
            }

            // Create bingo card
            bingoGenerator.bingoCard(
                $("#title").val(),
                $("#width").val(),
                $("#height").val(),
                $("#freespace").val(),
                $("#freespaceValue").val(),
                $("#freespaceSubheadingValue").val(),
                $("#freespaceRandom").val(),
                $("#words").val()
            );
        }

        // Jump to results
        location.href = '#results';

    },

    // Replace + with spaces, <> with entities, and URL-decode &/,:;+=?%$
    urlUnencode: function (str) {
        "use strict";
        return decodeURI(str).replace(/</g, "&lt;").replace(/\+/g, " ").replace(/%24/g, "$").replace(/%25/g, "%").replace(/%26/g, "&").replace(/%2B/g, "+").replace(/%2C/g, ",").replace(/%2F/g, "/").replace(/%3A/g, ":").replace(/%3B/g, ";").replace(/%3C/g, "&lt;").replace(/%3D/g, "=").replace(/%3F/g, "?");
    },

    escapeHTML: function (str) {
        "use strict";
        return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },

    newlineToBR: function (str) {
        "use strict";
        return str.replace(/\n/g, "<br>");
    },

    parseQS: function () {
        "use strict";
        var qsArray, json, i, kv, key, val;
        // Remove leading question mark ("?") and split into array of key/value pairs
        qsArray = location.search.slice(1).split("&");
        // Initialize object to store key/value pairs
        json = {};
        // Loop through key/value pairs and separate into keys and values
        for (i = 0; i < qsArray.length; i += 1) {
            kv = qsArray[i].split("=");
            key = kv[0];
            if (kv.length === 1) {
                val = key;
            } else {
                // A key may be present without a value, so set a placeholder value
                val = kv[1];
            }
            json[key] = val;
        }
        return json;
    },

    checkQS: function () {
        "use strict";
        var qs = bingoGenerator.parseQS();
        if (!(qs.title === undefined) || !(qs.words === undefined)) {
            $("#intro").hide();
            if (!(qs.title === undefined)) {
                $("#title").val(bingoGenerator.urlUnencode(qs.title));
            }
            if (!(qs.words === undefined)) {
                $("#words").val(bingoGenerator.urlUnencode(qs.words));
            }
            if (!(qs.freespace === undefined || qs.freespace === "false")) {
                document.getElementById("freespace").selectedIndex = 0;
                $("#freespaceValue").val(bingoGenerator.urlUnencode(qs.freespaceValue));
                if (!(qs.freespaceSubheadingValue === undefined)) {
                    $("#freespaceSubheadingValue").val(bingoGenerator.urlUnencode(qs.freespaceSubheadingValue));
                } else {
                    $("#freespaceSubheadingValue").val("Free Space");
                }
                if (!(qs.freespaceRandom === undefined) && qs.freespaceRandom === "true") {
                    document.getElementById("freespaceRandom").selectedIndex = 0;
                }
            } else {
                document.getElementById("freespace").selectedIndex = 1;
                $("#freespaceValue").val("");
            }
            if (!(qs.width === undefined)) {
                $("#width").val(qs.width);
            }
            if (!(qs.height === undefined)) {
                $("#height").val(qs.height);
            }
            if (!(qs.number === undefined)) {
                $("#number").val(qs.number);
            }
        }
        if (!(qs.pageBreaks === undefined)) {
            bingoGenerator.pageBreaks = qs.pageBreaks;
        }
        if (!(qs.title === undefined) && !(qs.words === undefined)) {
            bingoGenerator.generate();
            dauber.init();
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    exports.bingoGenerator = bingoGenerator;
}
