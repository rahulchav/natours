const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const hpp = require('hpp');
const xss = require('xss-clean');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControler');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingsRouter = require('./routes/bookingsRoutes');
const bookingController = require('./controllers/bookingsController');

// MIDDLEWARE

const app = express();

// Data sanitization against XSS
// app.use(xss());

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// 1) GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
// api.natours.com, front-end natours.com
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
      'script-src': ["'self'", 'https://js.stripe.com/v3/'],
    },
  })
);

// https://cdnjs.cloudflare.com/ajax/libs/axios/1.0.0-alpha.1/axios.min.js

// const headers = new Headers();
// 2 limit request from api

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try after an hour',
});

app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

// 3 development  middlewware

app.use(morgan('dev')); //1

// 4 body parser
app.use(express.json({ limit: '10kb' })); //2
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// cookies
app.use(cookieParser());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

// app.use((req, res, next) => {
//   console.log('hello from the middleware ✅');
//   next();
// }); //3

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
}); //4

// PARSING TOURS

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// FUNCTION FOR METHIODS (ROUTE HANDLERS)
// shifted to the routes folder

// CHAINING METHODS
// const userRouter = express.Router();
// const tourRouter = express.Router();

// app.get('/', (req, res, next) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Rahul',
//   });
// });

// routers
// Mounting

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //  tourRouter is the middlewae
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingsRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   staus: 'fail',
  //   message: `cant find the ${req.originalUrl} on the server`,
  // });

  next(new AppError(`cant find the ${req.originalUrl} on the server`, 404));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
