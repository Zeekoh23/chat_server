/*let clientSocketIds: any = [];

const getSocketByUserId = (userid: any) => {
  let socket = '';
  for(let i = 0; i < clientSocketIds.length; i++){
    if(clientSocketIds[i].userid == userid){
      socket = clientSocketIds[i].socket;
      break;
    }
  }
  return socket;
}

io.on('connection', (socket: any) => {
  console.log('connected');

  socket.on('disconnect', ()=> {
    console.log('disconnected');
    connectedUsers = connectedUsers.filter((item: any) => item.socketid != socket.id);
    io.emit('updateUserList', connectedUsers);
  });

  socket.on('login', function(user: any){
    clientSocketIds.push({socket: socket, userid: user.number});
    connectedUsers = connectedUsers.filter((item: any) => item.number != user.number);
    connectedUsers.push({...user, socketid: socket.id});
    io.emit('updateUserList', connectedUsers);
  });

  socket.on('create', function(data: any){
    console.log('create room');
    socket.join(data.room);
    let withSocket: any = getSocketByUserId(data.withUserId);
    socket.broadcast.to(withSocket.id).emit('invite', {room: data});

  });

  socket.on('joinroom', function(data: any){
    socket.join(data.room.room);
  });

  socket.on('message', function(data: any){
    socket.broadcast.to(data.room).emit('message', data);
  });

});*/

//const connectedUser = new Set();

/*io.on("connection", (socket: any) => {
  /* let userId = socket.handshake.query.userId;
  if (!clients[userId]) clients[userId] = [];
  clients[userId].push(socket.id);
  io.emit("online", userId);

  console.log("connected");
  console.log(socket.id, "has joined");

  connectedUser.add(socket.id);
  io.emit("connected-user", connectedUser.size);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    delete clients[socket.id];
    connectedUser.delete(socket.id);
    io.emit("connected-user", connectedUser.size);
  });

  socket.on("typing", (type: any) => {
    console.log(type);
    io.emit("typing", type);
    //let targetId = type.targetId;
    //if (clients[targetId]) clients[targetId].emit("typing", type);
  });
  socket.on("location", (loc: any) => {
    console.log(loc);
    io.emit("location", loc);
  });

  /*socket.on("signin", (id: any) => {
    console.log(id);
    id = socket;
    //clients[id] = socket;
    //clients[socket.id] = id;
    console.log(clients);
  });
  //socket.io@2.4.1
  socket.on("message", (msg: any) => {
    console.log(msg);
    socket.broadcast.emit("message-receive", msg);
  });
  /*socket.on("message", (msg: any) => {
    console.log(msg);
     let targetId = msg.targetId;
     if(targetId) targetId.broadcast.emit("message-receive", msg);
    //if (clients[targetId]) clients[targetId].emit("message", msg);
  });
});*/
