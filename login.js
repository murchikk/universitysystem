// Отримуємо елементи
const loginBtn = document.getElementById('login-btn');
const userInput = document.getElementById('login-user');
const passInput = document.getElementById('login-pass');
const messageBox = document.getElementById('message-box');

// Функція входу
loginBtn.addEventListener('click', () => {
    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    // Очищаємо попередні повідомлення
    messageBox.className = '';
    messageBox.innerText = '';

    // 1. Перевірка на пусті поля
    if (user === '' || pass === '') {
        showMessage('Будь ласка, заповніть всі поля', 'error-msg');
        return;
    }

    // 2. Імітація перевірки (можна змінити на свої значення)
    // Наприклад: Логін "admin", Пароль "12345"
    if (user === 'admin' && pass === '12345') {
        showMessage('Вхід успішний! Завантаження...', 'success-msg');

        localStorage.setItem('isLoggedIn', 'true');
        
        // Перехід на головну сторінку або розклад через 1.5 секунди
        setTimeout(() => {
            window.location.href = 'personal.html';
        }, 1500);

    } else {
        showMessage('Невірне ім\'я користувача або пароль', 'error-msg');
    }
});

// Допоміжна функція для виводу повідомлень
function showMessage(text, className) {
    messageBox.innerText = text;
    messageBox.classList.add(className);
}

// Щоб працював Enter у полях вводу
const inputs = [userInput, passInput];
inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
});