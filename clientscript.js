var socket = io();
var inc;

socket.on("connect", function(){
   console.log("connected")
   socket.emit("newConnection");
});

function submit()
{
   var teamnum = document.getElementById('teamnum').value;
   socket.emit('submit', [[teamnum,inc]]);
}

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