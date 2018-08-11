var BINGO = {
    card: [],
    createCard: function (guesses, items) {
        "use strict";
        var i;
        this.card = [];
        for (i = 0; i < items; i = i + 1) {
            if (i < guesses) {
                this.card.push(1);
            } else {
                this.card.push(0);
            }
        }
    },
    shuffleCard: function () {
        "use strict";
        var counter = this.card.length;
        var temp, index;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter -= 1;

            // And swap the last element with it
            temp = this.card[counter];
            this.card[counter] = this.card[index];
            this.card[index] = temp;
        }
    },

    testSquares: function (s1, s2, s3, s4, s5) {
        "use strict";
        if (this.card[s1] + this.card[s2] + this.card[s3] + this.card[s4] + this.card[s5] === 5) {
            return 1;
        }
        return 0;
    },

    testCard: function () {
        "use strict";
        this.shuffleCard();
        // test horizontal
        if (this.testSquares(0, 1, 2, 3, 4)) {
            return 1;
        }
        if (this.testSquares(5, 6, 7, 8, 9)) {
            return 1;
        }
        if (this.testSquares(10, 11, 12, 13, 14)) {
            return 1;
        }
        if (this.testSquares(15, 16, 17, 18, 19)) {
            return 1;
        }
        if (this.testSquares(20, 21, 22, 23, 24)) {
            return 1;
        }

        // test vertical
        if (this.testSquares(0, 5, 10, 15, 20)) {
            return 1;
        }
        if (this.testSquares(1, 6, 11, 16, 21)) {
            return 1;
        }
        if (this.testSquares(2, 7, 12, 17, 22)) {
            return 1;
        }
        if (this.testSquares(3, 8, 13, 18, 23)) {
            return 1;
        }
        if (this.testSquares(4, 9, 14, 19, 24)) {
            return 1;
        }

        // test diagonal
        if (this.testSquares(0, 6, 12, 18, 24)) {
            return 1;
        }
        if (this.testSquares(4, 8, 12, 16, 20)) {
            return 1;
        }

        return 0;
    },
    testCards: function (numberOfCards) {
        "use strict";
        var i, wins = 0;
        for (i = 0; i < numberOfCards; i = i + 1) {
            wins = wins + this.testCard();
        }
        return wins;
    },
    createOutputRow: function (calls, meanWins, percentChance, cumulativePercent) {
        "use strict";
        var row, cell1, cell2, cell3, cell4;
        row = document.createElement("tr");

        cell1 = document.createElement("td");
        cell1.textContent = (calls);
        row.appendChild(cell1);

        cell2 = document.createElement("td");
        cell2.textContent = meanWins;
        row.appendChild(cell2);

        cell3 = document.createElement("td");
        cell3.textContent = (Math.round(percentChance * 1000) / 10 + "%");
        row.appendChild(cell3);

        cell4 = document.createElement("td");
        cell4.textContent = (Math.round(cumulativePercent * 1000) / 10 + "%");
        row.appendChild(cell4);

        return row;
    },
    runSimulation: function (n) {
        "use strict";
        var results = document.getElementById("simulationResults");
        var items = parseInt(document.getElementById("items").value, 10);
        var cards = parseInt(document.getElementById("cards").value, 10);
        var winners = 0;
        var winnerInRound;
        var numberOfCalls;
        var i;
        var j;
        var w;
        var priorp = 0;
        var priorpPrime = 1 - priorp;
        var cumulativeProbability = 0;
        document.getElementById("numberOfItems").textContent = items;
        document.getElementById("numberOfCards").textContent = cards;
        results.innerHTML = "";
        for (i = 0; i < items; i = i + 1) {
            numberOfCalls = i + 1;
            w = 0;
            winners = 0;
            winnerInRound = 0;
            this.createCard(numberOfCalls, items);
            for (j = 0; j < n; j = j + 1) {
                w = this.testCards(cards, i);
                if (w > 0) {
                    winners += w;
                    winnerInRound += 1;
                }
            }

            cumulativeProbability = cumulativeProbability + priorpPrime * (winnerInRound / n);
            if (cumulativeProbability > 1) {
                cumulativeProbability = 1;
            }
            results.appendChild(this.createOutputRow(numberOfCalls, winners / n, winnerInRound / n, cumulativeProbability));
            priorpPrime = 1 - winnerInRound / n;
        }
    }
};