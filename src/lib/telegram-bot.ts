import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.TELEGRAM_CHAT_ID || '';

const bot = new TelegramBot(token);

export const AlertTemplates = {
  healthIssue: (symptoms: string[], confidence: string) => 
    `⚠️ Обнаружены признаки болезни:\n` +
    `- Симптомы: ${symptoms.join(', ')}\n` +
    `- Уверенность: ${confidence}%`,

  unknownPerson: (confidence: string) =>
    `🚨 Обнаружен незнакомец!\n` +
    `- Уверенность: ${confidence}%`
};

export async function sendSecurityAlert(message: string) {
  try {
    await bot.sendMessage(chatId, message);
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
  }
}