export const chatController = (socket) => {
    socket.use(([event, ...args],next)=>{  //middleware for socket
        console.log(`Event: ${event}`, args);
        next();
    });  
    socket.on("error", (err) => {
    if (err && err.message === "unauthorized event") {
      socket.disconnect();
    }
  });
    console.log("A user connected to chat namespace:", socket.id);  

  console.log(socket.handshake.headers.extra);
    socket.on("message", (data) => {
        console.log("Chat message received:", data);
        const newData=data.toUpperCase(); // Example processing
        socket.emit("fromServer", newData);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected from chat namespace:", socket.id);
    })
}