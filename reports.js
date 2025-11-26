const reportsList = document.getElementById('reports-list');
const clearBtn = document.getElementById('clear-reports-btn');
const modal = document.getElementById('report-modal');
const modalContent = document.getElementById('full-report-content');
const closeModal = document.querySelector('.close-modal');

function renderReports() {
    const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    reportsList.innerHTML = '';

    if (reports.length === 0) {
        reportsList.innerHTML = '<p style="text-align:center; color:#666; margin: 30px 0;">Архів пустий.</p>';
        clearBtn.style.display = 'none';
        return;
    }
    clearBtn.style.display = 'block';

    reports.reverse().forEach(report => {
        const card = document.createElement('div');
        card.className = 'saved-report-card';
        card.innerHTML = `
            <div class="report-top">
                <h3>${report.teacher}</h3>
                <span class="report-date">${report.date}</span>
            </div>
            <div class="report-details">
                <span class="status-badge ${report.statusClass}">${report.status}</span>
                <button class="open-report-btn" onclick="openReport(${report.id})">Відкрити повний звіт</button>
            </div>
        `;
        reportsList.appendChild(card);
    });
}

window.openReport = function(id) {
    const reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    const report = reports.find(r => r.id === id);

    if (report) {
        const analysisText = generateAnalysisText(report);

        modalContent.innerHTML = `
            <div class="doc-header">
                <div class="doc-title">ЗВІТ</div>
                <div class="doc-subtitle">ПРО ПЕДАГОГІЧНЕ НАВАНТАЖЕННЯ ВИКЛАДАЧА</div>
                <div style="margin-top:10px; font-size:12pt;">Національний університет "Львівська політехніка"</div>
            </div>

            <div class="doc-section">
                <p><strong>Викладач:</strong> ${report.teacher}</p>
                <p><strong>Кафедра:</strong> ${report.department || "Не вказано"}</p>
                <p><strong>Дата формування:</strong> ${report.date}</p>
            </div>

            <div class="doc-section">
                <div class="doc-h3">1. Статистичні показники</div>
                <table class="doc-table">
                    <tr>
                        <th>Загальна к-сть пар</th>
                        <th>Академічні години</th>
                        <th>Найважчий день</th>
                    </tr>
                    <tr>
                        <td>${report.pairs}</td>
                        <td>${report.hours} год.</td>
                        <td>${report.busiestDay}</td>
                    </tr>
                </table>
            </div>

            <div class="doc-section">
                <div class="doc-h3">2. Структура навантаження</div>
                <ul>
                    <li>Лекційні заняття: <strong>${report.stats.lec}</strong> (${report.stats.perLec}%)</li>
                    <li>Практичні заняття: <strong>${report.stats.prac}</strong> (${report.stats.perPrac}%)</li>
                    <li>Лабораторні роботи: <strong>${report.stats.lab}</strong> (${report.stats.perLab}%)</li>
                </ul>
            </div>

            <div class="doc-section">
                <div class="doc-h3">3. Аналіз та аргументація</div>
                <p style="text-align: justify; text-indent: 1.5cm;">
                    ${analysisText}
                </p>
                <p style="text-align: justify; text-indent: 1.5cm; margin-top: 10px;">
                    Відповідно до розрахункових норм, поточний рівень навантаження класифікується як 
                    <strong>"${report.status.toUpperCase()}"</strong>.
                </p>
            </div>

            <div class="doc-footer">
                <div>Завідувач кафедри ___________</div>
                <div>Викладач ___________</div>
            </div>
        `;
        
        modal.style.display = "block";
    }
};

function generateAnalysisText(data) {
    let text = `Проведений аналіз тижневого розкладу викладача (${data.teacher}) засвідчує, що загальний обсяг аудиторного навантаження складає ${data.hours} академічних годин. `;

    if (data.stats.perLec > 50) {
        text += `У структурі навантаження домінують лекційні заняття (${data.stats.perLec}%), що свідчить про високу теоретичну спрямованість роботи. `;
    } else if (data.stats.perLab > 40) {
        text += `Значну частину часу займають лабораторні роботи (${data.stats.perLab}%), що є характерним для технічних дисциплін. `;
    } 

    if (data.hours < 6) {
        text += `Фактичне навантаження є нижчим за мінімально рекомендовані норми. Рекомендується розглянути можливість залучення викладача до додаткових видів робіт або збільшення академічних годин у наступному семестрі. `;
    } else if (data.hours > 16) {
        text += `УВАГА: Виявлено перевищення рекомендованих норм навантаження! Така інтенсивність може негативно вплинути на якість викладання. Рекомендується перерозподілити частину годин (${(data.hours - 16).toFixed(1)} год) на інших співробітників кафедри. `;
    } else {
        text += `Показники знаходяться в межах оптимальної норми, що сприяє ефективній організації навчального процесу. `;
    }

    text += `Пікове навантаження припадає на ${data.busiestDay.toLowerCase()}, що потребує раціонального планування часу підготовки.`;

    return text;
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
clearBtn.addEventListener('click', () => {
    if(confirm('Очистити архів?')) {
        localStorage.removeItem('savedReports');
        renderReports();
    }
});

renderReports();