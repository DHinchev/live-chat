    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const Chatkit = require('@pusher/chatkit-server');
    const app = express();

    const chatkit = new Chatkit.default({
      instanceLocator: 'v1:us1:08ecfd23-3e02-411e-8f36-93b076a82d4e',
      key: 'a3bf21cf-b25c-458c-a2f6-e7e4247815a4:+nGBZhegXySG9prnXR9fnLNHToQ/K+YPxV5nzkDS5iA=',
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    app.post('/users', (req, res) => {
      const { username } = req.body;
      console.log();
      chatkit
        .createUser({ 
        id: username, 
        name: username 
         })
        .then(() => res.sendStatus(201))
        .catch(error => {
          if (error.error_type === 'services/chatkit/user_already_exists') {
            res.sendStatus(200);
          } else {
            res.status(error.status).json(error);
          }
        });
    });
    const PORT = 3001;
    app.listen(PORT, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Running on port ${PORT}`);
      }
    })