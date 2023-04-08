var sendButton = document.querySelector(".input-group-append")
var input = document.querySelector(".myInput")
var messagesBlock = document.querySelector(".mainMessagesBlock")

const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

document.querySelector(".msg_time").innerText = new Date().toLocaleDateString("ru",timeOptions).split(", ")[1]


sendButton.addEventListener("click", () => {
    putMessage(input.value, "me")
    sendMessage(input.value)
})

input.addEventListener("keyup", function(event) {
    if (event.keyCode !== 13) return
    putMessage(input.value, "me")
    sendMessage(input.value)
});

function putMessage(msg, owner){
    if(owner !== "me"){
        messagesBlock.innerHTML +=
`
<div class="d-flex justify-content-start mb-4">
    <div class="img_cont_msg">
    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
    </div>
    <div class="msg_cotainer">
        <pre class="msgBody"></pre>
        <span class="msg_time">${new Date().toLocaleDateString("ru",timeOptions).split(", ")[1]}</span>
    </div>
</div>
`
    } else {
        messagesBlock.innerHTML +=
`
    <div class="d-flex justify-content-end mb-4">
    <div class="msg_cotainer_send">
        <pre class="msgBody"></pre>
        <span class="msg_time_send">${new Date().toLocaleDateString("ru",timeOptions).split(", ")[1]}</span>
    </div>
</div>
        `
    }
    var textBlock = document.querySelectorAll(".msgBody")
    textBlock[textBlock.length-1].innerText = msg
    messagesBlock.scrollTop = messagesBlock.scrollHeight;
}

function sendMessage(text){
    fetch(window.location.href+"makeRequest", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        question: text
      })
    })
    .then(response => {
      return response.json()
    })
    .then(res => {
        putMessage(res.answer, "bot")
        input.value = ""
    })
    .catch(err => {
        putMessage("ERROR happened, maybe your request is not correct....", "bot")
        input.value = ""
    })
}