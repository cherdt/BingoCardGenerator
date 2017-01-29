/*jslint
    browser
*/

var BINGO = {
    images: [],

    processDrop: function (event) {
        "use strict";
        var dt = event.dataTransfer;
        var files = dt.files;
        var count = files.length;
        var i;
        document.getElementById("imageDrop").textContent = "Received " + count + " images. " + (count + this.images.length) + " images received so far.";

        for (i = 0; i < files.length; i += 1) {
            this.loadImage(files[i], event.target.id);
        }
    },

    onebit: function (canvas) {
        "use strict";
        var imgData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
        var i, colorVal, red, green, blue;
        for (i = 0; i < imgData.data.length; i = i + 4) {
            if (((imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3) > 127) {
                colorVal = 255;
            } else {
                colorVal = 0;
            }
            red = i;
            green = i + 1;
            blue = i + 2;
            imgData.data[red] = colorVal;
            imgData.data[green] = colorVal;
            imgData.data[blue] = colorVal;
        }
        canvas.getContext("2d").putImageData(imgData, 0, 0);
    },


    loadImage: function (file) {
        "use strict";
        var self = this;
        Promise.all([
            createImageBitmap(file)
        ]).then(function (sprites) {
            var canvasElement = document.createElement("canvas");
            canvasElement.width = sprites[0].width;
            canvasElement.height = sprites[0].height;
            canvasElement.getContext('2d').drawImage(sprites[0], 0, 0);
            //self.onebit(canvasElement);
            // enqueue the image onto the queue of images
            self.images.push(canvasElement);
            // add the canvas element to the page
            document.getElementById("images").appendChild(canvasElement);
        });
    },

    shuffle: function () {
        "use strict";
        var counter = this.images.length;
        var temp, index;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter -= 1;

            // And swap the last element with it
            temp = this.images[counter];
            this.images[counter] = this.images[index];
            this.images[index] = temp;
        }

    },

    makeCard: function () {
        "use strict";
        var i, j, card, row, cell, image;
        this.shuffle();
        document.getElementById("bingo-header").textContent = document.getElementById("title").value;
        card = document.getElementsByTagName("tbody")[0];
        card.innerHTML = "";
        for (i = 0; i < 5; i += 1) {
            row = document.createElement("tr");
            for (j = 0; j < 5; j += 1) {
                image = this.images.pop();
                cell = document.createElement("td");
                cell.appendChild(image);
                row.appendChild(cell);
                this.images.unshift(image);
            }
            card.appendChild(row);
        }
    }
};