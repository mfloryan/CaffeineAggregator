var app = require('express')();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var es = require('./es/es.api');

var publisher = {
    publish: function(){}
};

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
});

app.post('/publish', function(req, res){
    res.send({result:'Published'});
    publisher.publish({
        sessionId: 1,
        foo: new Date()});

    pushEventIntoStore(req);
});

app.get('/pos', function(req, res){
    res.render('pos', { title: "POS"});
});

io.sockets.on('connection', function (connection) {

    publisher.publish = function (msg) {
        console.log(msg);
        //connection.send(msg.data.toString());
        io.sockets.in(msg.sessionId).send(msg.foo);
    };

//    socket.get('sessionId', function (err, name) {
//        console.log('message for ', name);
//    });

    // connection.on('set nickname', function (name) {
    var sessionId = generateUUID(); //connection.handshake.sessionID;
//    connection.set('sessionId', sessionId, function () {
    console.log('Setting sessionId: ' + sessionId);
    connection.emit('sessionId', sessionId);
    connection.send('ready');
//    });

    connection.join(sessionId);

    // });

});

app.get('/monitor', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var port = 8083;
server.listen(port);
console.log("Listening on port " + port);

function generateUUID() {
    return 1;
}

function pushEventIntoStore(event) {
    console.log("pushingEventIntoStore");
    
    var data = {
        sender: event.ip,
        time: new Date()
    };

    es.postEvent({
        data: data,
        stream: "caffine-drinks",
        eventType: "DrinkPurchased",
        success: function () {
            publisher.publish({
                sessionId: "IHavePublishedAnEvent",
                foo: new Date()
            });
        },
        error: function(error, eventId, correlationId, expectedVersion){
                publisher.publish({
                    sessionId: "IHaveNotPublishedAnEvent",
                    foo: error + " " + eventId + " " + correlationId + " " +expectedVersion
                });
        }
    });
}
