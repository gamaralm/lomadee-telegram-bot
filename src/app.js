import TelegramBot from 'node-telegram-bot-api';

import telegramConfig from './config/telegram';

class App {
  constructor() {
    this.bot = new TelegramBot(telegramConfig.token, telegramConfig.options);

    this.registerHandlers();
  }

  registerHandlers() {
    this.bot.onText(/\/ofertas/, message => {
      this.bot.sendMessage(message.chat.id, 'teste');
    });
  }
}

export default new App();
