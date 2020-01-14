const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const agentRouter = require('./agent');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/apiagent', agentRouter);

app.listen(5000, () => {
  console.log('listen on  port 5000');
});