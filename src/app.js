import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api';

import api from './services/api';
import telegramConfig from './config/telegram';
import { formatOfferMessage } from './util/format';

class App {
  constructor() {
    this.server = express();
    this.bot = new TelegramBot(telegramConfig.token, telegramConfig.options);

    this.categories = [
      { id: 7074, name: 'Acessórios para Informática' },
      { id: 77, name: 'Celular e Smartphone' },
      { id: 93, name: 'Câmera Digital' },
      { id: 110, name: 'Filmadora' },
      { id: 9901, name: 'Filme Digital' },
      { id: 2376, name: 'Games' },
      { id: 2, name: 'Informática' },
      { id: 3482, name: 'Livros' },
      { id: 7606, name: 'Música Digital' },
      { id: 22, name: 'PC' },
      { id: 9574, name: 'Planos para Telefonia Fixa' },
      { id: 3643, name: 'Home Theater' },
      { id: 2852, name: 'TV' },
    ];

    this.middlewares();
    this.registerHandlers();
  }

  middlewares() {
    this.server.use(bodyParser.json());
  }

  registerHandlers() {
    this.server.get(`/bot${telegramConfig.token}`, (req, res) => {
      this.bot.processUpdate(req.body);
      res.sendStatus(200);
    });

    this.bot.onText(/\/start/, msg => this.welcome(msg));
    this.bot.onText(/\/help/, msg => this.help(msg));
    this.bot.onText(/\/categorias/, msg => this.getCategories(msg));
    this.bot.onText(/\/\d+ (.+)/, (msg, match) => this.getOffers(msg, match));
    this.bot.on('text', msg => this.default(msg));

    this.bot.on('polling_error', msg => this.error(msg));
  }

  default(msg) {
    const checkIsCommand = msg.text.charAt(0) === '/';

    if (checkIsCommand) {
      return;
    }

    const text =
      'Comando não localizado, digite _/help_ para ver os comandos disponíveis!';

    this.bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
    });
  }

  welcome(msg) {
    const text =
      "E aí, meu caro! Seja bem-vindo ao Bot *Nerd's Mix*! " +
      'Aqui farei uma busca dos melhores preços para você! ' +
      'Para começar, digite _/categorias_ para ver as categorias disponíveis!';

    this.bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
    });
  }

  help(msg) {
    const text =
      '*Comandos Disponíveis*' +
      '\n\n/categorias - Exibe as categorias disponíveis' +
      '\n/help - Exibe os comandos disponíveis' +
      '\n/{categoria} {produto} - Exibe os produtos em oferta (Ex.: /2376 God of War 4)';

    this.bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
    });
  }

  error(msg) {
    const errorMessage =
      'Opa, tive um probleminha aqui! Meu servidor pode estar fora do ar ' +
      'ou há alguma falha no meu sistema! Por favor, tente novamente ' +
      'mais tarde!';

    this.bot.sendMessage(msg.chat.id, errorMessage);
  }

  getCategories(msg) {
    let text = '*Categorias Disponíveis*\n';

    this.categories.forEach(category => {
      text += `\n/${category.id} ${category.name}`;
    });

    text +=
      '\n\nPara pesquisar as ofertas, digite o número da categoria seguido ' +
      'do produto desejado. Exemplo: _/2376 God of War PS4_';

    this.bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
    });
  }

  getOffers(msg, match) {
    const [command, keyword] = match;
    const categoryId = command.split(' ')[0].slice(1);

    const checkCategoryExists = this.categories.filter(category => {
      return category.id === parseInt(categoryId, 10);
    });

    if (checkCategoryExists.length === 0) {
      const notExistsMessage =
        'Não localizei esta categoria, ela pode não estar disponível para ' +
        'busca ou houve um erro de digitação! 😔';

      this.bot.sendMessage(msg.chat.id, notExistsMessage);
      return;
    }

    this.bot
      .sendChatAction(msg.chat.id, 'typing')
      .then(async () => {
        const res = await api.get('/offer/_search', {
          params: { keyword, categoryId },
        });

        if (res.data.offers) {
          await this.bot.sendMessage(msg.chat.id, '*Ofertas encontradas*', {
            parse_mode: 'Markdown',
          });

          res.data.offers.forEach(offer => {
            this.bot.sendMessage(msg.chat.id, formatOfferMessage(offer));
          });
        } else {
          const notFoundMessage =
            'Infelizmente não encontrei esta informação no momento! Mas não ' +
            'se preocupe, meu caro! Tente novamente em outro momento ou ' +
            'refine sua busca.';

          this.bot.sendMessage(msg.chat.id, notFoundMessage);
        }
      })
      .catch(() => this.error(msg));
  }
}

export default new App().server;
