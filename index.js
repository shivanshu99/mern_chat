import path from "path";
import { fileURLToPath } from "url";
import * as io from "socket.io";
import express from "express";
import { createServer } from "http";
import Filter from "bad-words"
import generateMessage from './src/messages.js'
import generateLocMessage from './src/messages.js'
const app = express();
const server = createServer(app);
const socketio = new io.Server(server);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port=process.env.PORT || 3000

const publicDirePath=path.join(__dirname,'./public')
app.use(express.static(publicDirePath));

socketio.on('connection',(socket)=>{
	console.log("New connections")
	socket.emit('message',generateMessage("Welcome"))
	socket.broadcast.emit('message',generateMessage('A new user has joined'))

	socket.on("sendMessage",(message,callback)=>{
		const filter=new Filter()

		if (filter.isProfane(message)){
			return callback("Profanity is not allowed")
		}
		socketio.emit('message',generateMessage(message))
		callback()
	}),

	socket.on('sendLocation',(coords,callback)=>{
		socketio.emit("LocationMsg",generateLocMessage(`https://google.com/maps?q=${coords.lat},${coords.long}`))
	})
  
	socket.on("disconnect", () => {
		socketio.emit("message", generateMessage("A user has left"));
	})
})

server.listen(port,()=>{
	console.log(`server is up on port ${port}`)
})