import axios from 'axios';
const stripe = Stripe(
  'pk_test_51LCirDSDuYJC9SQShxRtBmNwYw7ErlHiBYJ4yPTyDAxqogX4YtQkIgWNLf06ZKuZj7Az7ZM6BjkVTKfa29IGqWup00QccB7OJB'
);

export const bookTour = async (tourId) => {
  try {
    // 1 get checkout sessions from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);
    // 2 create checkut forn + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
