$(document).ready(function() {
    $("#generator-form").submit(function(event) {
        event.preventDefault();
        $("#layer").removeClass("d-none");
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
            $("#layer").addClass("d-none");
            $("#result").html(res.answer);
        })
        .catch(e => {
            console.log(e);
            $("#layer").addClass("d-none");
            $("#result").html("<p class='text-danger'>An error occurred. Please try again.</p>");
        })
    });
});

// some vanilla js
window.addEventListener('load', () => {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }
    document.body.style.opacity = '1';
});

document.getElementById('darkModeToggle').addEventListener('change', function (e) {
    document.body.classList.toggle('dark-mode', e.target.checked);
    localStorage.setItem('dark-mode', e.target.checked);
});