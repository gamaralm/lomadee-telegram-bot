import 'dotenv/config';

export default {
  token: process.env.TELEGRAM_TOKEN,
  options: {
    polling: true,
  },
};
