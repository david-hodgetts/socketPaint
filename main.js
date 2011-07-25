var nodeStatic = require('node-static'),
    http = require('http'),
    socketIo = require('socket.io'),
    PORT = 8080,
    fileServer,
    httpServer,
    io;

//
// Create a node-static server instance to serve the './public' folder
//

fileServer = new nodeStatic.Server('./public');

httpServer = http.createServer(function(request, response){

  request.addListener('end', function(){
    fileServer.serve(request, response, function(e, res){

      if (e && e.status === 404){
        //file wasn't found
        response.writeHead(404);
        response.write('<h1>404 file not found</h1>');
        response.end();
      }

    });
  });

});

httpServer.listen(PORT);

// socket init
io = socketIo.listen(httpServer);

io.sockets.on('connection', function(socket){
  socket.on('user_message', function(msg){
    console.log("we got msg" + msg["my"]);
  });

});

console.log("http listening on " + PORT);
