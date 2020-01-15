import TelegramBot from 'node-telegram-bot-api';

import api from './services/api';
import telegramConfig from './config/telegram';

class App {
  constructor() {
    this.bot = new TelegramBot(telegramConfig.token, telegramConfig.options);

    this.registerHandlers();
  }

  registerHandlers() {
    this.bot.onText(/\/ofertas/, async message => {});
  }
}

export default new App();
