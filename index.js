const express = require('express');

const app = express();

app.use(express.json());


console.log('listening port: 8000');
app.listen(8000);