import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { Generate } from './generate.ts';
import { Retrieve } from './retrieve.ts';
import * as mongoose from 'mongoose';

// Create server
const server = new Elysia();
server.use(html());

server.use(Generate);
server.use(Retrieve);

// First endpoint, kept for nostalgic reasons
server.get('/', () => '<h1>SALUTATIONS!</h1>');

// Start server
server.listen(8080);

// Status message
console.log("Bun Bun listenening to port 8080!");

// Connect to database
const database = "Kitty";
mongoose.connect(`mongodb+srv://${Bun.env.MONGOOSE_USERNAME}:${Bun.env.MONGOOSE_PASSWORD}@logisticssystem.1yypplx.mongodb.net/${database}?retryWrites=true&w=majority`)
    .then(() => console.log("Connected"));