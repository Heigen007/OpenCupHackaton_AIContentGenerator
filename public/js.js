$(document).ready(function() {
    $("#generator-form").submit(function(event) {
        event.preventDefault();
        $("#loading-message").removeClass("d-none");
        $("#result").empty();
        
        const textType = $("#text-type").val();
        const pictureType = $("#picture-type").val();
        const about = $("#about").val() || "How pyramids are build";
        const selectedNumber = $("#number-select").val();

        fetch("https://open-cup-hackaton-ai-content-generator.vercel.app/"+ 'makeRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                textType,
                pictureType,
                about,
                selectedNumber
            })
        })
        .then(response => {
            return response.json()
        })
        .then(res => {
            $("#loading-message").addClass("d-none");
            $("#result").html(res.answer);
        })
        .catch(e => {
            console.log(e);
            $("#loading-message").addClass("d-none");
            $("#result").html("<p class='text-danger'>An error occurred. Please try again.</p>");
        })
    });
});