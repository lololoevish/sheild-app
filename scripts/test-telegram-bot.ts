import { sendSecurityAlert, AlertTemplates } from '../src/lib/telegram-bot';

async function testBot() {
  try {
    // Тест текстового уведомления
    await sendSecurityAlert(
      AlertTemplates.unknownPerson(new Date().toLocaleString())
    );

    // Тест уведомления с фото (используем тестовое изображение)
    await sendSecurityAlert(
      AlertTemplates.healthAlert('Иван Иванов', ['температура', 'покраснение'], new Date().toLocaleString()),
      'https://example.com/test-image.jpg' // Замените на реальный URL
    );

    console.log('Тестовые уведомления отправлены');
  } catch (error) {
    console.error('Ошибка тестирования бота:', error);
  }
}

testBot();