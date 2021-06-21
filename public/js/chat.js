const socket = io();

const $messageForm = document.querySelector("#message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocation=document.querySelector("#send-location")
const $messages=document.querySelector('#messages')


const messageTemplate=document.querySelector("#message-template").innerHTML
const locmessageTemplate = document.querySelector("#location-template").innerHTML;
socket.on("message", message => {
	console.log(message);
	const html=Mustache.render(messageTemplate,{
		message:message.text,
		createdAt:moment(message.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend',html)
});

socket.on("LocationMsg",(message)=>{
	
	const html = Mustache.render(locmessageTemplate, {
		url:message.url,
		createdAt: moment(message.createdAt).format("h:mm a")
	});
	$messages.insertAdjacentHTML("beforeend", html);
})

$messageForm.addEventListener("submit", e => {
	e.preventDefault();
	$messageFormButton.setAttribute("disabled", "disabled");
	const message = document.querySelector("input").value;

	socket.emit("sendMessage", message, error => {
		$messageFormButton.removeAttribute('disabled')
		$messageFormInput.value=""
		$messageFormInput.focus()
		if (error) {
			return console.log(error);
		}
		console.log("Message Delivered");
	});
});

$sendLocation.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("Geolocation is not supported by your browser!");
	}

	$sendLocation.setAttribute("disabled","disabled")
	navigator.geolocation.getCurrentPosition(position => {
		socket.emit("sendLocation", {
			lat: position.coords.latitude,
			long: position.coords.longitude
		});
		$sendLocation.removeAttribute("disabled");
		console.log("Location shared");
	});
});
