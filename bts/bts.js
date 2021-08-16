// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/mwRub5_nW/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}


// run the webcam image through the image model
async function predict() {
    var image = document.getElementById("face-image");

    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(image, false);

    // sort
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));

    $(".result-message").html(prediction[0].className);

    var graphColorArr = [
    {"backgroundColor":"#FFECE2", "graphColor":"#E67701"}
    , {"backgroundColor":"#FFE9EC", "graphColor":"#D84C6F"}
    , {"backgroundColor":"#F1F0FF", "graphColor":"#794AEF"}
    , {"backgroundColor":"#D2E3FC", "graphColor":"#1967D2"}
    , {"backgroundColor":"#FFECE2", "graphColor":"#E67701"}
    , {"backgroundColor":"#FFE9EC", "graphColor":"#D84C6F"}
    , {"backgroundColor":"#F1F0FF", "graphColor":"#794AEF"}
    ]

    for (let i = 0; i < maxPredictions; i++) {
        var graphPercent = prediction[i].probability.toFixed(2) * 100 + "%";
        var cloneGraph = $("#clone-bar-graph").find(".bar-graph-div").clone();
        $(cloneGraph).find(".bar-graph-label").text(prediction[i].className);
        $(cloneGraph).find(".bar-graph-container").css("background-color", graphColorArr[i].backgroundColor);
        $(cloneGraph).find(".graph-body").css("background-color", graphColorArr[i].graphColor);
        $(cloneGraph).find(".graph-body").css("width", graphPercent);
        $(cloneGraph).find(".value-label").text(graphPercent);
        $("#label-container").append(cloneGraph);
    }

    $(".image-title-wrap").show();
    $(".retry-button").show();
    $(".image-analying-message").hide();
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('.image-upload-wrap').hide();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            $(".image-analying-message").show();
            $('.image-title').html(input.files[0].name);

            $("body").animate({
                scrollTop: $("#face-image").offset().top-60
            }, 500);
        };

        reader.readAsDataURL(input.files[0]);

        /* teachablemachine init*/
        init().then(function(){
            predict();
        });
    }
}

$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});

$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

function fn_start() {
    $("body").animate({
        scrollTop: $(".file-upload").offset().top-60
    }, 500);
}

function fn_retry() {
    window.location.reload();
}