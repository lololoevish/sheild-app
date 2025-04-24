// Указываем путь к скомпилированной версии модуля
const { sendSecurityAlert, AlertTemplates } = require('../dist/lib/telegram-bot');

async function testBot() {
  try {
    // Тест текстового уведомления
    await sendSecurityAlert(
      AlertTemplates.unknownPerson(new Date().toLocaleString())
    );

    console.log('Тестовое уведомление отправлено');
  } catch (error) {
    console.error('Ошибка тестирования бота:', error);
  }
}

testBot();