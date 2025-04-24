import TelegramBot from 'node-telegram-bot-api';
import { supabase } from './supabase';

// Инициализация бота
const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, {polling: false});

// Отправка уведомления охране
export async function sendSecurityAlert(
  message: string, 
  photoUrl?: string
) {
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  
  try {
    if (photoUrl) {
      await bot.sendPhoto(chatId, photoUrl, {caption: message});
    } else {
      await bot.sendMessage(chatId, message);
    }
    
    // Логируем уведомление в Supabase
    await supabase
      .from('health_events')
      .insert({notification_sent: true});
      
  } catch (error) {
    console.error('Ошибка отправки уведомления:', error);
  }
}

// Шаблоны уведомлений
export const AlertTemplates = {
  unknownPerson: (timestamp: string) => 
    `⚠ Неизвестный человек обнаружен ${timestamp}`,
    
  healthAlert: (name: string, symptoms: string[], timestamp: string) =>
    `🚨 Возможное заболевание: ${name}\n` +
    `Симптомы: ${symptoms.join(', ')}\n` +
    `Время: ${timestamp}`
};