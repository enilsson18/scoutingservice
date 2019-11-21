var socket = io();

socket.on("connect", function(){
   socket.emit("newConnection");
});