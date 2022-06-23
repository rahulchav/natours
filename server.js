const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

// console.log(process.env.NODE_ENV);

const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB conneted sucessfully');
  })
  .catch((err) => {
    console.log(err);
  });

const app = require('./app');
const port = process.env.PORT||8000

// console.log(process.env.PORT);    //we can use it in the Code

const server = app.listen(port, () => {
  console.log(`listening on port ${process.env.PORT}...`);
});

// module.exports = Tour;

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM',()=>{
  console.log('SIGTERM RECIEVED, Shutting down gracefully...');
  server.close(()=>{
    console.log('Process terminated !!');
  })
})