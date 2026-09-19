SHOHIN ENGLISH

Professional English Learning Platform by SHOHIN.

---

1. Project

SHOHIN ENGLISH — это PWA-приложение для изучения английского языка.

Главная цель проекта — создать полноценную образовательную платформу, которую можно постепенно расширять до большого количества пользователей.

На первом этапе приложение работает без обязательной регистрации.

Пользователь открывает приложение и сразу может пользоваться курсом.

Прогресс Guest-пользователя сохраняется локально на его устройстве.

В будущем будет добавлена система аккаунтов и синхронизация прогресса.

---

2. Course Structure

Курс состоит из 6 уровней:

Level| Name| Lessons
A1| Beginner| 20
A2| Elementary| 25
B1| Intermediate| 30
B2| Upper-Intermediate| 30
C1| Advanced| 35
C2| Proficiency| 40

Total

180 lessons

Каждый уровень заканчивается итоговым assessment/test.

Для перехода на следующий уровень пользователь должен:

1. Завершить необходимые уроки.
2. Пройти итоговый тест.
3. Получить проходной результат.

---

3. Lesson Structure

Каждый урок рассчитан на следующую структуру:

Lesson
│
├── Introduction
│
├── Cards
│
├── Exercises
│
├── Test
│
└── Completion

Контент уроков не должен быть жёстко записан в "index.html".

В будущем он будет управляться через Admin Panel.

---

4. Videos

Для каждого уровня предусмотрен отдельный раздел Videos.

A1
└── Videos

A2
└── Videos

B1
└── Videos

B2
└── Videos

C1
└── Videos

C2
└── Videos

Видео в будущем будут добавляться через Admin Panel.

Планируемые параметры видео:

id
levelId
lessonId
title
cover
url
description
order
published

Видео могут быть:

- общими для уровня;
- привязанными к конкретному уроку.

---

5. Vocabulary

Каждый уровень может иметь собственный vocabulary.

Пример:

{
  "id": "word-001",
  "levelId": "A1",
  "word": "hello",
  "translation": "привет",
  "example": "Hello, my friend."
}

Позже Admin Panel сможет управлять словарём.

---

6. Exercises

Система упражнений поддерживает следующие типы:

multiple_choice
true_false
text_input
matching
fill_blank

Новые типы упражнений можно будет добавлять без изменения основной структуры приложения.

---

7. Tests

Каждый уровень имеет итоговый тест.

Текущий проходной процент:

70%

Количество попыток:

Unlimited

Результат сохраняется локально.

В будущем результаты могут синхронизироваться с сервером.

---

8. Guest Mode

Сейчас регистрация не обязательна.

Пользователь работает как Guest.

Локально сохраняются:

Current Level
Current Lesson
Completed Lessons
Completed Levels
Watched Videos
Learned Words
Test Results
Settings

Основной файл:

js/storage.js

Используемое хранилище:

localStorage

---

9. Future Account System

В будущем можно добавить:

Guest
   ↓
Create Account
   ↓
Login
   ↓
Cloud Sync
   ↓
User Profile

Аккаунт не должен быть обязательным на первом этапе.

После подключения backend локальный Guest-прогресс можно будет переносить в аккаунт.

---

10. Admin Panel

Admin Panel будет отдельным приложением.

Примерная структура:

SHOHIN-ENGLISH/
│
├── USER APP
│
└── ADMIN/
    │
    ├── index.html
    │
    ├── css/
    │
    ├── js/
    │
    └── ...

Admin Panel в будущем сможет управлять:

Levels
Lessons
Cards
Vocabulary
Exercises
Tests
Videos
Images
Audio
Publishing
Users
Statistics

---

11. Lesson Publishing

Каждый lesson имеет статус.

Пример:

draft
published

Draft-урок не должен отображаться как доступный полноценный урок для пользователя.

После публикации Admin Panel устанавливает:

published: true

---

12. Video Publishing

Видео также могут иметь статус:

Draft
Published

Администратор сможет добавлять:

Video title
Video URL
Cover
Description
Level
Lesson
Order
Published status

---

13. Project Structure

SHOHIN-ENGLISH/
│
├── index.html
├── manifest.json
├── sw.js
├── README.md
│
├── css/
│   ├── style.css
│   └── components.css
│
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── levels.js
│   ├── lessons.js
│   ├── lesson-player.js
│   ├── exercises.js
│   ├── tests.js
│   └── progress.js
│
├── data/
│   └── lessons.json
│
└── assets/
    ├── logo/
    ├── icons/
    └── images/

---

14. Main JavaScript Modules

"app.js"

Главный контроллер приложения.

Отвечает за:

- navigation;
- home;
- levels;
- lessons;
- videos;
- vocabulary;
- progress;
- menu.

---

"storage.js"

Локальное хранение Guest-прогресса.

---

"levels.js"

Система уровней:

A1
A2
B1
B2
C1
C2

---

"lessons.js"

Универсальная система уроков.

Не содержит 180 уроков вручную.

---

"lesson-player.js"

Запускает урок и управляет этапами:

Introduction
Cards
Exercises
Test
Completion

---

"exercises.js"

Система упражнений.

---

"tests.js"

Система итоговых тестов уровней.

---

"progress.js"

Общая система прогресса пользователя.

---

15. Data Architecture

На первом этапе используется:

data/lessons.json

Но файл является только начальной структурой.

В будущем данные будут поступать из backend/API.

Пример будущей архитектуры:

Admin Panel
      ↓
Database
      ↓
API
      ↓
SHOHIN ENGLISH
      ↓
User

---

16. Large User Base

Приложение проектируется с расчётом на большое количество пользователей.

Важно:

"localStorage" используется только для Guest-прогресса.

Он не является основной базой пользователей.

В будущем серверная система должна хранить:

Users
Profiles
Progress
Lessons
Videos
Vocabulary
Exercises
Tests
Results
Statistics

---

17. Backend

Backend пока не является обязательной частью первой версии.

После завершения UI и основной логики можно подключить:

Firebase

или

Supabase

или другой backend.

Выбор backend будет сделан после проверки пользовательского приложения.

---

18. PWA

Приложение поддерживает Progressive Web App.

Основные файлы:

manifest.json
sw.js

После правильного размещения приложения на HTTPS пользователь сможет установить SHOHIN ENGLISH на устройство.

---

19. Design

Основной бренд SHOHIN использует зелёную цветовую систему.

--dark:#071c16;
--dark2:#0d3024;
--green:#08a56c;
--green2:#087b53;
--lime:#baf05b;

SHOHIN BRAND COLORS — НЕ МЕНЯТЬ

Эти цвета являются базовыми цветами SHOHIN ENGLISH.

---

20. Development Roadmap

Phase 1 — Foundation

✓ index.html
✓ CSS
✓ storage
✓ levels
✓ lessons
✓ lesson player
✓ exercises
✓ tests
✓ progress
✓ app controller
✓ manifest
✓ service worker
✓ data structure

Phase 2 — Content

Lessons
Cards
Vocabulary
Exercises
Tests
Videos
Audio
Images

Phase 3 — Admin Panel

Admin Login
Dashboard
Levels
Lessons
Videos
Vocabulary
Exercises
Tests
Publishing
Statistics

Phase 4 — Backend

Database
API
Authentication
Cloud Progress
User Profiles
Admin Permissions

Phase 5 — Growth

Notifications
Analytics
Achievements
Streaks
Certificates
Subscriptions
Advertising
Advanced Statistics

---

21. Important Rule

Не добавлять реальные 180 уроков непосредственно в:

index.html

или

app.js

Контент должен быть отделён от интерфейса.

Правильная архитектура:

Interface
   ↓
Application Logic
   ↓
Data Layer
   ↓
Backend

---

22. Current Status

Current project stage:

FOUNDATION

Основная структура приложения готова.

Следующий этап:

TEST → FIX → CONTENT → ADMIN PANEL → BACKEND

---

23. Project Name

SHOHIN ENGLISH

Brand:

SHOHIN

Platform:

English Learning

Target:

Global users

Initial access:

Guest

Future:

Accounts + Cloud Sync + Admin Panel