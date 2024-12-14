import { createServer } from 'net'; // @ts-ignore

const port = process.argv[2] ? parseInt(process.argv[2]) : 23; // @ts-ignore

const server = createServer((socket: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  console.log(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);
  
  let byteCount = 0;

  socket.on('data', (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    byteCount += data.length;
    console.log(`Received ${byteCount} bytes total`);
    
    // Echo the data back to the client
    socket.write(data);
  });

  socket.on('end', () => {
    console.log(`Connection closed from ${socket.remoteAddress}:${socket.remotePort}`);
  });

  socket.on('error', (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error(`Socket error: ${err.message}`);
  });
});

server.listen(port, () => {
  console.log(`Echo server listening on port ${port}`);
});

server.on('error', (err: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  console.error(`Server error: ${err.message}`);
});
