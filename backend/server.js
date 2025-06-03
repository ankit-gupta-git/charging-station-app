const http = require('http');
const app = require('./app'); // Import the Express app
const PORT = process.env.PORT || 3000; // Set the port to listen on, defaulting to 3000 if not specified in environment variables


const server = http.createServer(app); // Create an HTTP server using the Express app


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
});