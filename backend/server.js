const http = require('http');
const app = require('./app'); // Import the Express app
const PORT = process.env.PORT || 4000; // Set the port to listen on, defaulting to 4000 if not specified in environment variables


const server = http.createServer(app); // Create an HTTP server using the Express app


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});