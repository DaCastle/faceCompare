var img1url = document.getElementById('img1url');
var img2url = document.getElementById('img2url');
var img1 = document.getElementById('img1');
var img2 = document.getElementById('img2');
var person1 = document.getElementById('person1Data');
var person2 = document.getElementById('person2Data');
var q90458gnwjre0f = "0f9041e2c4e7449aa458d6f01a2e74d3";


img1url.addEventListener('input', function (event) {
    if (this.value) {
        img1.src = this.value;
        processImage(img1.src, person1);
    }
});

img2url.addEventListener('input', function (event) {
    if (this.value) {
        img2.src = this.value;
        processImage(img2.src, person2);
    }  
});

function processImage(imageSrc, person) {

    var uriBase = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect";

    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes":
            "age,gender,headPose,smile,facialHair,glasses,emotion," +
            "hair,makeup,occlusion,accessories,blur,exposure,noise"
    };

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", q90458gnwjre0f);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + imageSrc + '"}',
    })

        .done(function (data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            $(person).val(JSON.stringify(data[0], null, 2));
            person.data = data[0].faceId;
            $(img1url).val('');
            $(img2url).val('');
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
};

function verify() {

    var uriBase = "https://eastus.api.cognitive.microsoft.com/face/v1.0/verify";

    // Perform the REST API call.
    $.ajax({
        url: uriBase,

        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", q90458gnwjre0f);
        },

        type: "POST",

        // Request body.
        data: '{"faceId1": ' + '"' + person1.data + '", "faceId2": ' + '"' + person2.data + '"' + '}',
    })

        .done(function (data) {
            $("#results").empty();
            if (data.isIdentical) {
                $("#results").text('Those are the same person!');
            }
            else {
                $("#results").text('Not the same person!');
            }
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ?
                "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ?
                "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
};

processImage(img1.src, person1);
processImage(img2.src, person2);
