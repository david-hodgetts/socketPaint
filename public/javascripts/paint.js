var socket = io.connect(), 
    id,
    server_path;

tool.minDistance = 10;
tool.maxDistance = 45;

var path;

var toPoint = function(nodePoint){
  return new Point(nodePoint.x, nodePoint.y);
}

socket.on('welcome', function(data){
  id = data.id;
  console.log('we are id ' + id);
});


socket.on('new_path', function(data){
  server_path = new Path();
  server_path.fillColor = new HSBColor(Math.random() * 360, 1, 1);
  server_path.add(data.point);
  
  console.log('new path ' + data.point.x);
});

socket.on('add_point_to_path', function(data){
  var point = toPoint(data.point),
      secondPoint = point + 20;
  server_path.add(point);
  server_path.insert(0, secondPoint);
  server_path.smooth();
  console.log('add point to path');
});

socket.on('end_path', function(data){
  server_path.add(data.point);
  server_path.closed = true;
  server_path.smooth();

  console.log('end path');
});


function onFrame(event){
// unused 
// hack to force sync redraw
}

function onMouseDown(event) {
  path = new Path();
  path.fillColor = new HSBColor(Math.random() * 360, 1, 1);

  path.add(event.point);

  console.log(event);

  socket.emit('user_new_path', {point: event.point});
}

function onMouseDrag(event) {
  var step = event.delta / 2;
  step.angle += 90;
  
  var top = event.middlePoint + step;
  var bottom = event.middlePoint - step;
  
  path.add(top);
  path.insert(0, bottom);
  path.smooth();

  socket.emit('user_add_point_to_path', {point: event.point});
}

function onMouseUp(event) {
  path.add(event.point);
  path.closed = true;
  path.smooth();

  socket.emit('user_end_path', {point: event.point});
}
