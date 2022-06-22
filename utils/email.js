const nodemailer = require('nodemailer');
const pug = require('pug');
const htmltotext = require('html-to-text');

module.exports = class Email{
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Rahul Nishad <${process.env.EMAIL_FROM}>`;
  }

  newTransport(){
    if(process.env.NODE_ENV==='production'){
      // sendgrid
      return nodemailer.createTransport({
        service:'sendinblue',
        auth: {
          user: process.env.EMAILPROD_LOGIN,
          pass: process.env.EMAILPROD_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSSWORD,
      },
    });
  }

  // send the actual email
  async send(template,subject){
    // 1 render the html from the pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
      firstname:this.firstName,
      url:this.url,
      subject,
    })
    // 2 define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      text: htmltotext.fromString(html),
    };
    // 3 create the transporter and send email

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(){
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}

// const sendEmail = async (options) => {
//   // 1 create a transporter
 
//   // 2 define the email ooptins
//   const mailOptions = {
//     from: 'Rahul nishad <hello@jonas.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:
//   };
//   // 3 acttaully send the email

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
