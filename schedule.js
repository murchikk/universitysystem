const WORKLOAD_NORMS = { min: 6, max: 20 };

const teachersDB = [
    {
        fullName: "Кашуба Андрій Іванович", 
        department: "Кафедра Загальної фізики",
        schedule: {
            "Вівторок": [
                { time: "11:40 - 13:00", subject: "Фізика", type: "лекція", group: "МБ-11сп", room: "ГК-139" },
                { time: "13:15 - 14:35", subject: "Фізика", type: "практична", group: "МБ-11сп", room: "VI-111" }
            ],
            "Середа": [
                { time: "11:40 - 13:00", subject: "Фізика", type: "лабораторна", group: "ПП-12", room: "ГК-опт.1лаб." },
                { time: "13:15 - 14:35", subject: "Фізика", type: "лабораторна", group: "АЕ-11", room: "ГК-опт.1лаб." }
            ],
            "Четвер": [
                { time: "08:30 - 09:50", subject: "Фізика", type: "лабораторна", group: "КБ-110", room: "ГК-опт.2лаб." },
                { time: "10:05 - 11:25", subject: "Фізика", type: "лабораторна", group: "ІР-12", room: "ГК-опт.4лаб." },
                { time: "11:40 - 13:00", subject: "Фізика", type: "лабораторна", group: "ПП-11", room: "ГК-опт.1лаб." },
                { time: "14:50 - 16:10", subject: "Фізика", type: "лабораторна", group: "БД-109", room: "ГК-опт.3лаб." }
            ]
        }
    },
    {
        fullName: "Хапко Оксана Богданівна",
        department: "Кафедра Вищої математики",
        schedule: {
            "Понеділок": [
                { time: "10:05 - 11:25", subject: "Теорія ймовірностей і математична статистика", type: "практична", group: "ФЛ-25", room: "I-406" },
                { time: "11:40 - 13:00", subject: "Вища математика, частина 1", type: "практична", group: "МЗ-11", room: "XIV-059" }
            ],
            "Вівторок": [
                { time: "10:05 - 11:25", subject: "Математика для економістів", type: "практична", group: "МК-14", room: "IV-421" },
                { time: "11:40 - 13:00", subject: "Алгебра та аналіз", type: "практична", group: "ФЛ-12", room: "I-407" },
                { time: "13:15 - 14:35", subject: "Вища математика, частина 1", type: "практична", group: "ІХ-11", room: "XI-108" }
            ],
            "Середа": [
                { time: "08:30 - 09:50", subject: "Математика для економістів, частина 1", type: "практична", group: "МЕ-102", room: "IV-102" },
                { time: "11:40 - 13:00", subject: "Математика для економістів, частина 1", type: "практична", group: "МЕ-104", room: "IV-201" },
                { time: "13:15 - 14:35", subject: "Вища математика", type: "практична", group: "ЕЕ-11сп", room: "IV-312" }
            ],
            "Четвер": [
                { time: "08:30 - 09:50", subject: "Вища математика, частина 1", type: "практична", group: "ІХ-11", room: "III-331" },
                { time: "10:05 - 11:25", subject: "Вища математика, частина 1", type: "практична", group: "БТ-12", room: "ГК-225" },
                { time: "13:15 - 14:35", subject: "Вища математика", type: "практична", group: "ЕЕ-11сп", room: "II-407" }
            ],
            "П'ятниця": [
                { time: "11:40 - 13:00", subject: "Алгебра та аналіз", type: "практична", group: "ФЛ-12", room: "II-406" }
            ]
        }
    },
    {
        fullName: "Милянич Андрій Остапович",
        department: "Кафедра Вищої математики",
        schedule: {
            "Понеділок": [
                { time: "13:15 - 14:35", subject: "Моделювання, проєктування і обладнання хіміко-фармацевтичних підприємств в системі GMP", type: "лекція", group: "ФРМ-11", room: "ГК-216" }
            ],
            "Вівторок": [
                { time: "10:05 - 11:25", subject: "Устаткування та проєктування фармацевтичних виробництв", type: "лабораторна", group: "ФР-41", room: "VIII-139" },
                { time: "11:40 - 13:00", subject: "Устаткування та проєктування фармацевтичних виробництв", type: "лабораторна", group: "ФР-41", room: "VIII-145" }
            ],
            "Середа": [
                { time: "13:15 - 14:35", subject: "Устаткування та проєктування фармацевтичних виробництв", type: "лекція", group: "ФР-41", room: "ГК-225" },
                { time: "14:50 - 16:10", subject: "Устаткування та проєктування фармацевтичних виробництв", type: "лекція", group: "ФР-41", room: "ГК-225" }
            ]
        }
    }
];

const input = document.getElementById('teacher-input');
const btn = document.getElementById('search-btn');
const resultDiv = document.getElementById('schedule-result');

function normalizeString(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

btn.addEventListener('click', () => {
    const query = normalizeString(input.value);
    resultDiv.innerHTML = '';

    if (!query) {
        resultDiv.innerHTML = '<p class="error-msg">Будь ласка, введіть ПІБ.</p>';
        return;
    }

    const foundTeacher = teachersDB.find(t => normalizeString(t.fullName) === query);

    if (foundTeacher) {
        let weekHtml = '';
        
        let totalPairs = 0;
        let countLec = 0;
        let countPrac = 0;
        let countLab = 0;
        
        let maxPairsInDay = 0;
        let busiestDayName = "-";

        const daysOrder = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];

        daysOrder.forEach(day => {
            const lessons = foundTeacher.schedule[day];
            if (lessons && lessons.length > 0) {
            
                const pairsToday = lessons.length;
                totalPairs += pairsToday;

                if (pairsToday > maxPairsInDay) {
                    maxPairsInDay = pairsToday;
                    busiestDayName = day;
                }

                lessons.forEach(lesson => {
                    const type = lesson.type ? lesson.type.toLowerCase() : "";
                    if (type.includes('лекція')) countLec++;
                    else if (type.includes('практична')) countPrac++;
                    else if (type.includes('лабораторна')) countLab++;
                });

                const lessonsList = lessons.map(item => `
                    <li>
                        <span class="schedule-time">${item.time}</span>
                        <div class="schedule-info">
                            <strong>${item.subject}</strong>
                            <div class="lesson-meta">
                                ${item.type ? `<span class="tag type">${item.type}</span>` : ''}
                                ${item.group ? `<span class="tag group">Гр: ${item.group}</span>` : ''}
                            </div>
                            <small>Аудиторія: ${item.room}</small>
                        </div>
                    </li>
                `).join('');

                weekHtml += `<div class="day-block"><h5 class="day-title">${day}</h5><ul class="schedule-list">${lessonsList}</ul></div>`;
            }
        });

        if (weekHtml === '') weekHtml = '<p style="padding:15px">Пар немає.</p>';

        const totalHours = totalPairs * 2;
        
        const getPercent = (count) => totalPairs > 0 ? Math.round((count / totalPairs) * 100) : 0;
        
        const perLec = getPercent(countLec);
        const perPrac = getPercent(countPrac);
        const perLab = getPercent(countLab);

        let statusClass = '', statusText = '', conclusion = '';
        if (totalHours < WORKLOAD_NORMS.min) {
            statusClass = 'status-warning'; statusText = 'Недовантаження';
            conclusion = `Навантаження ${totalHours} год. Менше норми.`;
        } else if (totalHours > WORKLOAD_NORMS.max) {
            statusClass = 'status-error'; statusText = 'Перевантаження';
            conclusion = `Навантаження ${totalHours} год. Більше норми.`;
        } else {
            statusClass = 'status-ok'; statusText = 'Норма';
            conclusion = `Навантаження ${totalHours} год. В межах норми.`;
        }

        resultDiv.innerHTML = `
            <div class="schedule-header" style="margin-bottom: 20px; border:none; background:none; padding:0;">
                 <h2 style="font-family:'Rubik', sans-serif;">${foundTeacher.fullName}</h2>
                 <p style="color:#666;">${foundTeacher.department}</p>
            </div>

            <div class="schedule-wrapper">
                <div class="schedule-main">
                    ${weekHtml}
                </div>

                <div class="schedule-sidebar">
                    <div class="report-header">Аналіз</div>
                    
                    <div style="text-align:center; margin-bottom:20px;">
                        <div style="font-size: 2.5rem; font-weight:bold; color:#2a2a2a;">${totalHours}</div>
                        <small style="color:#888;">годин на тиждень</small>
                    </div>

                    <div class="report-conclusion ${statusClass}" style="text-align:center; margin-bottom:20px;">
                        <strong>${statusText}</strong>
                    </div>

                    <div class="stat-item">
                        <div class="stat-label"><span>Лекції</span> <span>${countLec} (${perLec}%)</span></div>
                        <div class="progress-bg"><div class="progress-fill fill-lecture" style="width: ${perLec}%"></div></div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-label"><span>Практичні</span> <span>${countPrac} (${perPrac}%)</span></div>
                        <div class="progress-bg"><div class="progress-fill fill-practice" style="width: ${perPrac}%"></div></div>
                    </div>

                    <div class="stat-item">
                        <div class="stat-label"><span>Лабораторні</span> <span>${countLab} (${perLab}%)</span></div>
                        <div class="progress-bg"><div class="progress-fill fill-lab" style="width: ${perLab}%"></div></div>
                    </div>

                    <div class="busiest-day">
                        Найважчий день: <span>${busiestDayName}</span> <br>
                        <small style="color:#888;">(Максимум пар: ${maxPairsInDay})</small>
                    </div>

                    <button id="save-report-btn" class="save-btn" style="margin-top:20px;">Завантажити</button>
                </div>
            </div>
        `;

        const saveBtn = document.getElementById('save-report-btn');
        saveBtn.addEventListener('click', function() {
            const reportData = {
                id: Date.now(),
                teacher: foundTeacher.fullName,
                department: foundTeacher.department, 
                hours: totalHours,
                pairs: totalPairs,
                stats: {             
                    lec: countLec,
                    prac: countPrac,
                    lab: countLab,
                    perLec: perLec,
                    perPrac: perPrac,
                    perLab: perLab
                },
                busiestDay: busiestDayName,
                status: statusText,
                statusClass: statusClass,
                date: new Date().toLocaleDateString()
            };

            let reports = JSON.parse(localStorage.getItem('savedReports') || '[]');
            reports.push(reportData);
            localStorage.setItem('savedReports', JSON.stringify(reports));

            alert('Звіт успішно сформовано та збережено в архів!');
            this.disabled = true;
            this.innerText = "Збережено";
            this.style.backgroundColor = "#4caf50";
        });

    } else {
        resultDiv.innerHTML = `<p class="error-msg">Викладача не знайдено.</p>`;
    }
});