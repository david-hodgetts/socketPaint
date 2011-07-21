var static = require('node-static'),
    PORT = 8080;

//
// Create a node-static server instance to serve the './public' folder
//

var fileServer = new static.Server('./public');

require('http').createServer(function(request, response){

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

}).listen(PORT);

console.log("listening on " + PORT);
