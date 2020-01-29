//init variables for the program
var socket = io();
var data = [];
var list;

//the socket call to connect to the server
socket.on("connect", function(){
    console.log("connected")
    socket.emit("newConnection");

    var i = 0;
    console.log(getCookie("0").split(','));
    while(!(getCookie(i) == "")){
        socket.emit("submit", [getCookie(i).split(",")]);
        console.log("submitted data from cookie");
        deleteCookie("" + i + "");
        i++;
    }
});

function init(){
    data = [];
    list = document.getElementById("questions").getElementsByTagName("li");

    for (var i = 0; i < list.length; i++){
        //text
        if (list[i].getElementsByTagName("input")[0] != undefined && list[i].getElementsByTagName("input")[0].type == "text"){
            data.push(new question("text"));
        }
        //dropdown menu
        else if (list[i].getElementsByTagName("select")[0] != undefined){
            var select = list[i].getElementsByTagName("select")[0];
            var options = [];

            for (var j = 0; j < select.options.length; j++){
                options.push(select.options[j].value);
            }
            data.push(new question("dropdown", options));
        }
        //input buttons
        else if(list[i].getElementsByTagName("input")[0] != undefined && list[i].getElementsByTagName("input")[0].type == "button" && list[i].getElementsByTagName("input")[0].value != "Submit"){
            data.push(new question("increment"));

            list[i].getElementsByTagName("input")[0].setAttribute("onclick", "updateQuestion(" + i + ",-1)");
            list[i].getElementsByTagName("input")[1].setAttribute("onclick", "updateQuestion(" + i + ", 1)");
        }
        //textarea
        else if(list[i].getElementsByTagName("textarea")[0] != undefined && list[i].getElementsByTagName("textarea")[0]){
            data.push(new question("textarea"));
        }
    }
}

//function to send the data to the connected server
function submit()
{
    tempList = [];
    for (var i = 0; i < data.length; i++){
        if (data[i].type == "text"){
            data[i].data = document.getElementById("" + i + "").getElementsByTagName("input")[0].value;
            if(data[0].data == ""){
                break;
            }

        }
        if (data[i].type == "dropdown"){
            var select = document.getElementById("" + i + "").getElementsByTagName("select")[0];
            data[i].data = select.options[select.selectedIndex].value;
        }

        tempList.push(data[i].data);
    }

    //socket.emit('submit', [tempList]);

    if (socket.connected){
        socket.emit('submit', [tempList]);
        console.log("submited succesfully");
    } else {
        tempList.join();
        var i = 0;
        while(!(document.cookie.indexOf("" + i + "") === -1 || getCookie(i) == "")) {
            i++;
        }
        createCookie("" + i + "",tempList);
        //console.log("made cookie at: " + i + " data: " + tempList);
        //console.log(getCookie("" + i + ""));
    }

}

//the function call to increment any value for buttons and such
function updateQuestion(num, change){

    if (data[num].type == "increment"){
        if(data[num].data + change >= 0){
            data[num].data += change;
        }
        document.getElementById("" + num + "").getElementsByTagName("h1")[0].innerText = data[num].data;
    }
    else if (data[num].type == "dropdown"){
        data[num].data = document.getElementById(num).value;
    }
    else if (data[num].type == "yesno"){
        data[num].data = change;
    }
    else if (data[num].type == "text"){
        data[num].data = change;
    }
}

//the functions that have to do with cookies in case users are offline
function createCookie(cookieName,cookieValue,daysToExpire=1)
{
    var date = new Date();
    date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
}

function getCookie(cookieName)
{
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for(var i=0; i<allCookieArray.length; i++)
    {
        var temp = allCookieArray[i].trim();
        if (temp.indexOf(name)==0)
            return temp.substring(name.length,temp.length);
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}