import nodemailer from "nodemailer";

//here we use nodemailer to send email easy and use ethereal.email web serive for testing

const sendEmailEthreal = async (req, res) => {
  const transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "elena.bogan46@ethereal.email",
      pass: "5qJempGjNjdgqCqsFP",
    },
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <amit@example.com>',
    to: "bar@example.com, ashu@example.com",
    subject: "Hello ✔",
    html: "<b>Hello amit how are you</b>",
  });
  res.send(info);
};

const sendEmail = (req, res) => {
  //use sendgrid mail web app
};

export { sendEmail };
