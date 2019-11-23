var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 2000;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

app.get('/', function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get('/:File', function(req,res){
    res.sendFile(__dirname + "/" + req.params.File);
});

io.on("connection", function (socket){
    socket.on("newConnection", function(){
       console.log("New Connection");
    });

    socket.on("submit", function (data){
        appendData = data;
        console.log(data);
        authorize(creds,AppendData);
    });
});

http.listen(port, function(){
    console.log('listening on *:' + port);
});

//google sheets stuff
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'token.json';
var creds;
//read data holds the range of the data to be read by the ReadData function fill with 'A1:B2'
var readData = 'A1:B3';
var appendData = [[]];

//use this template to use functions "authorize(creds, functionUWant)"

//plese preset the data with appendData var
function AppendData(auth){
    const sheets = google.sheets({version: 'v4', auth});

    sheets.spreadsheets.values.append({
        spreadsheetId: '1kefhQkz-rkfXwMBTgZmBuqQWz7ENG1dnX_a0mJrT0wM',
        range: 'Sheet1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: appendData,
        },
        auth: auth
    }, (err, response) => {
        if (err) return console.error(err);
        else console.log("Data sent to Sheet");
    })
}

function ReadData(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        //spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
        spreadsheetId: '1kefhQkz-rkfXwMBTgZmBuqQWz7ENG1dnX_a0mJrT0wM',
        range: readData,
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[1]}`);
            });
        } else {
            console.log('No data found.');
        }
    });
}

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    creds = JSON.parse(content);
});

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}