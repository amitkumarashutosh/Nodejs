import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send('<h1>Send Email</h1><a href="/send">Send Email</a>');
});

import { sendEmail } from "./sendEmail.controller.js";

app.use("/send", sendEmail);

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
