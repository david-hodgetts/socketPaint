var nodeStatic = require('node-static'),
    http = require('http'),
    socketIo = require('socket.io'),
    PORT = 8080,
    fileServer,
    httpServer,
    io;

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

  var sessionId = socket.id;

  socket.emit('welcome', {id: sessionId});

  socket.on('user_new_path', function(msg){
    socket.broadcast.emit('new_path', { point: msg.point, 
                                        id: sessionId });
  });


  socket.on('user_add_point_to_path', function(msg){
    socket.broadcast.emit('add_point_to_path',{ point: msg.point,
                                                id: sessionId });
  });

  socket.on('user_end_path', function(msg){
    socket.broadcast.emit('end_path', { point: msg.point,
                                        id: sessionId});
  });

  socket.on('disconnect', function(){
    socket.emit('user disconnected');
  });
});

console.log("http listening on " + PORT);
