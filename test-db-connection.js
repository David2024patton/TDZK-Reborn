const net = require('net');

const HOST = 'data.itak.live';
const PORT = 5432;

console.log(`Testing connection to ${HOST}:${PORT}...`);

const socket = new net.Socket();

socket.setTimeout(5000); // 5 second timeout

socket.on('connect', () => {
    console.log('SUCCESS: Connected to database host!');
    socket.end();
    process.exit(0);
});

socket.on('timeout', () => {
    console.error('ERROR: Connection timed out.');
    socket.destroy();
    process.exit(1);
});

socket.on('error', (err) => {
    console.error(`ERROR: Connection failed - ${err.message}`);
    process.exit(1);
});

socket.connect(PORT, HOST);
