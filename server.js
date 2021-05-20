const express = require('express');
const next = require('next');
const config = require('config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV === 'development'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.urlencoded({ extended: false }));
 
  server.use(bodyParser.json());

  server.use(express.static('storage'));

  mongoose.connect(config.get('mongoUri'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  server.use('/api/math', require('./routes/math.routes'));
  server.use('/api/auth', require('./routes/auth.routes'));
  server.use('/api/user', require('./routes/user.routes'));
  server.use('/api/mortgages', require('./routes/mortgage.routes'));

  server.all('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
