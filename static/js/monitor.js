    function message(obj) {
        $('#chat').append('<p><em>' + esc(obj) + '</em></p>');
    	}

    var conn = io.connect('http://localhost:8083');
    var sessionId;

    function send(){
        var val = document.getElementById('text').value;
        conn.send(val);
    }

    function setSessionID() {
        conn.emit('set nickname', 'blob');
    }

    function esc(msg){
        return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    conn.on('purchase', function (obj) {
        message('Served ' +  obj.drink + ' at '+ obj.stamp);
    });

    conn.on('status', function (obj) {
        message(obj);
    });

    conn.on('sessionId', function(obj){
        sessionId = obj;
        message('Got sessionId from server:' + sessionId);
    });

    conn.on('dataSeries', function(data){
        renderGraph(data);
    });


    //Rickshaw.js - Charting
    function renderGraph(data){
        var graph = new Rickshaw.Graph( {
                element: document.getElementById("chart"),
                //width: 580,
                height: 250,
                series: [ {
                        color: 'steelblue',
                        data: data
                }]
        } );

        var x_axis = new Rickshaw.Graph.Axis.Time( { graph: graph } );

         var y_axis = new Rickshaw.Graph.Axis.Y( {
            graph: graph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById("y_axis")
        } );

        graph.render(); 
    }

    // // add some data every so often
    // var tv = 1000;
    // graph.series.setTimeInterval(tv);

    // setInterval( function() {
    //     var data = { This: 3 };
    //     var randInt = Math.floor(Math.random()*100);
    //     if (randInt > 10) {
    //         data.That = randInt;
    //     }
    //     if (randInt > 15) {
    //         data.TheOtherThing = randInt;
    //     }

    //     graph.series.addData(data);
    //     graph.update();
    // }, tv );