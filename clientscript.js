var socket = io();

socket.on("connect", function(){
   console.log("connected")
   socket.emit("newConnection");
});

function init(){
   inc = 0;
}

function upButton(){
   inc += 1;
   document.getElementById("incdata").innerHTML = inc;
}

function downButton(){
   if (inc > 0) {
      inc -= 1;
   }
   document.getElementById("incdata").innerHTML = inc;
}