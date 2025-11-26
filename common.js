document.addEventListener("DOMContentLoaded", () => {
    const navLoginBtn = document.getElementById('nav-login');
    const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Якщо елемент навігації знайдено і користувач увійшов
    if (navLoginBtn && isUserLoggedIn) {
        
        // 1. Змінюємо текст кнопки
        navLoginBtn.innerHTML = '<h3>Вихід</h3>';
        
        // 2. Змінюємо посилання, щоб воно нікуди не вело
        navLoginBtn.href = '#';
        
        // 3. Додаємо логіку виходу при кліку
        navLoginBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Зупиняємо перехід за посиланням

            if (confirm('Ви дійсно бажаєте вийти з системи?')) {
                // Видаляємо ключ входу
                localStorage.removeItem('isLoggedIn');
                
                // Перенаправляємо на сторінку входу
                window.location.href = 'login.html';
            }
        });
    }
});