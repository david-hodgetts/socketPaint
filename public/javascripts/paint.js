var socket = io.connect(), 
    id,
    server_path,
    hash_of_paths = {};

tool.minDistance = 10;
tool.maxDistance = 45;

////////////////////////////////
// util functions

var toPoint = function(nodePoint){
  return new Point(nodePoint.x, nodePoint.y);
}


var getPath = function(remoteId){

  if (! hash_of_paths.hasOwnProperty(remoteId)){
    throw new Error("key not found in hash_of_paths");
  }

  return hash_of_paths[remoteId];
}


var newPath = function(remoteId) {
  if (hash_of_paths.hasOwnProperty(remoteId)){
    throw new Error("can't create new path -> key already exists");
  }

  hash_of_paths[remoteId] = new Path();

  return hash_of_paths[remoteId];
}

//////////////////////
// remote callbacks

socket.on('welcome', function(data){
  id = data.id;
  console.log('we are id ' + id);
});


// NEW_PATH from remote

socket.on('new_path', function(data){

  server_path = newPath(data.id);

  server_path.fillColor = new HSBColor(Math.random() * 360, 1, 1);
  server_path.add(data.point);
  
  console.log('new path ' + data.point.x);
});



// ADD_POINT_TO_PATH from remote

socket.on('add_point_to_path', function(data){
    
  server_path = getPath(data.id); 

  var point = toPoint(data.point),
      secondPoint = point + 20;
  server_path.add(point);
  server_path.insert(0, secondPoint);
  server_path.smooth();
  console.log('add point to path');
});



// END_PATH from remote

socket.on('end_path', function(data){

  server_path = getPath(data.id); 

  server_path.add(data.point);
  server_path.closed = true;
  server_path.smooth();


  // remove path
  delete hash_of_paths[data.id];

  console.log('end path');
});


///////////////////////
// local drawing

var localPath;

function onFrame(event){
// unused 
// hack to force sync redraw
}

function onMouseDown(event) {
  localPath = new Path();
  localPath.fillColor = new HSBColor(Math.random() * 360, 1, 1);

  localPath.add(event.point);

  console.log(event);

  socket.emit('user_new_path', {point: event.point});
}

function onMouseDrag(event) {
  var step = event.delta / 2;
  step.angle += 90;
  
  var top = event.middlePoint + step;
  var bottom = event.middlePoint - step;
  
  localPath.add(top);
  localPath.insert(0, bottom);
  localPath.smooth();

  socket.emit('user_add_point_to_path', {point: event.point});
}

function onMouseUp(event) {
  localPath.add(event.point);
  localPath.closed = true;
  localPath.smooth();

  socket.emit('user_end_path', {point: event.point});
}
