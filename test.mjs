import { spawn } from 'child_process';
import fetch from 'node-fetch'; // Requires node version > 18 for built-in, else need to install. Wait, node 18+ has fetch. 

const server = spawn('node', ['src/index.js'], { stdio: 'inherit' });

setTimeout(async () => {
    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', password: 'password', role: 'ADMIN' })
        });
        const data = await res.json();
        console.log("Server test result: ", data);
        server.kill();
        process.exit(0);
    } catch (e) {
        console.error("Test failed: ", e);
        server.kill();
        process.exit(1);
    }
}, 3000);
