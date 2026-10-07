import dotenv from 'dotenv';
import Server from './server';

// Load environment variables
dotenv.config();

const server = new Server();
server.listen();
