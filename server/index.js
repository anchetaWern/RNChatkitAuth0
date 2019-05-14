const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("@pusher/chatkit-server");

require("dotenv").config();

const app = express();
const INSTANCE_LOCATOR_ID = process.env.CHATKIT_INSTANCE_LOCATOR_ID;
const CHATKIT_SECRET = process.env.CHATKIT_SECRET_KEY;

const chatkit = new Chatkit.default({
  instanceLocator: `v1:us1:${INSTANCE_LOCATOR_ID}`,
  key: CHATKIT_SECRET
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("all green!");
});


app.post("/auth", (req, res) => {
  const { user_id } = req.query;
  const authData = chatkit.authenticate({
    userId: user_id
  });

  res.status(authData.status)
     .send(authData.body);
});


app.post("/create-user", async (req, res) => {
  const { sub: id, name, picture: avatarURL } = req.body; 

  try {
    let user = await chatkit.createUser({
      id,
      name,
      avatarURL
    });

    res.send('ok');
  } catch (err) {
    if (err.error === "services/chatkit/user_already_exists") {

      res.send('ok');
    } else {

      let statusCode = err.error.status;
      if (statusCode >= 100 && statusCode < 600) {
        res.status(statusCode);
      } else {
        res.status(500);
      }
    }
  }
});


const PORT = 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Running on ports ${PORT}`);
  }
});