    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const Chatkit = require('@pusher/chatkit-server');
    const app = express();

    const chatkit = new Chatkit.default({
      instanceLocator: "v1:us1:0132844b-4fab-4158-bc85-1fa1942034b2",
      key: "ed9eb934-5d6d-40ce-9570-c932a33dd56d:VFHrmbXkwsAiTQIMknIdOQJAGsg0C+bLidFDUhAE27w=",
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cors());

    app.post('/users', (req, res) => {
      const { username } = req.body;
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
// ========================= remove or modify this
    app.post('/roles', (req, res) => {
      const { username } = req.body;

      chatkit.createRoomRole({
        name: 'deletePrevilage',
        permissions: ['room:delete'],
      })
        .then(() => {
          console.log('Room role created successfully');
        }).catch((err) => {
          console.log(err);
        });

        chatkit.assignRoomRoleToUser({
          userId: username,
          name: 'deletePrevilage',
          roomId: '234',
        })
          .then(() => {
            console.log('Assigned room role successfully');
          }).catch((err) => {
            console.log(err);
          });
    });

// ===================================================
    const PORT = 3001;
    app.listen(PORT, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Running on port ${PORT}`);
      }
    });
