// MODULES //
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
// CONFIGS //
import ENV from "../config.js";

// https://ethereal.email/create
let transporter = nodemailer.createTransport(ENV.ETHEREAL_CONFIG);

// Configure mailgen by setting a theme and your product info
var mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Mailgen",
    link: "https://mailgen.js/",
    // Optional product logo
    // logo: 'https://mailgen.js/img/logo.png'
  },
});

export const mailSender = (req, res) => {
  const { username, email, text, subject } = req.body;

  // body of the email
  var content = {
    body: {
      name: username,
      intro: text,
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help. Thank you!",
    },
  };
  // generate content to html body
  var mailBody = mailGenerator.generate(content);

  let message = {
    from: ENV.EMAIL,
    to: email,
    subject: subject,
    html: mailBody,
  };

  // send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ message: "You should receive an email from us." });
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Something went wrong.",
        data: error,
      });
    });
};
