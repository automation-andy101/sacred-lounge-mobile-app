# 🪷 Sacred Lounge

> *Meditation · Music · Meaning — Find deep calm in a busy world*

A full-stack mobile application for Sacred Lounge, a Hare Krishna-inspired meditation and community group based in Manchester, UK. The app allows members to discover and book upcoming events, access a library of guided meditations and kirtan music, and connect with the Sacred Lounge community.

---

## 📱 Screenshots

*Coming soon*

---

## ✨ Features

- **Home** — Next upcoming event with one-tap Eventbrite booking, daily inspiration quote
- **Events** — Upcoming and past events with full detail pages
- **Experience** — Overview of what to expect at a Sacred Lounge evening
- **Library** — Guided meditations, mantra music, kirtan and wisdom talks
- **Profile** — User registration, login, booking history
- **Admin Panel** — Add and manage events and library content

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile Frontend | React Native + Expo (iOS & Android) |
| Navigation | Expo Router |
| State / Data | TanStack Query + Zustand |
| Backend API | Java 17 + Spring Boot 3 |
| Database | PostgreSQL 18 |
| Authentication | JWT (access + refresh tokens) |
| DB Migrations | Flyway |
| Media Storage | AWS S3 (optional) |
| Event Booking | Eventbrite (deep link integration) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 14+
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

### Backend Setup

**1. Create the database**

```sql
CREATE DATABASE sacred_lounge;
ALTER USER postgres WITH PASSWORD 'your_password';
```

**2. Configure the app**

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/sacred_lounge
spring.datasource.username=postgres
spring.datasource.password=your_password
app.jwt.secret=your-base64-encoded-256-bit-secret
```

**3. Run the API**

```bash
cd backend
mvn spring-boot:run
```

The API will start on `http://localhost:8080/api`

**First run only** — temporarily set this to create tables, then revert to `validate`:
```properties
spring.jpa.hibernate.ddl-auto=create
```

---

### Frontend Setup

**1. Install dependencies**

```bash
cd frontend
npm install
```

**2. Set the API URL**

Create a `.env` file in the `frontend/` folder:

```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8080/api
```

> Use your machine's local IP address (e.g. `192.168.1.x`), not `localhost`, so your phone can reach the API over WiFi.

**3. Start the app**

```bash
npx expo start
```

Scan the QR code with Expo Go on your phone.

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/home` | Public | Home screen data (next event + inspiration) |
| GET | `/api/events/upcoming` | Public | List upcoming events |
| GET | `/api/events/past` | Public | List past events |
| GET | `/api/events/{slug}` | Public | Event detail |
| GET | `/api/library` | Public | Library overview |
| GET | `/api/library/meditations` | Public | All meditations |
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh token |
| GET | `/api/profile` | Member | User profile |
| POST | `/api/admin/events` | Admin | Create event |
| PUT | `/api/admin/events/{id}` | Admin | Update event |
| POST | `/api/admin/library` | Admin | Add library item |

---

## 🗄 Database Schema

Key tables:

- `users` — Member accounts with roles (MEMBER / ADMIN)
- `events` — Sacred Lounge events with Eventbrite integration
- `event_bookings` — User event bookings
- `library_items` — Meditations, kirtan, talks (MEDITATION / KIRTAN / TALK / MUSIC)
- `inspirations` — Daily inspiration quotes
- `experience_categories` — Experience types shown on Experience screen

---

## 📁 Project Structure

```
sacred-lounge/
├── backend/                          # Spring Boot API
│   └── src/main/java/com/sacredlounge/
│       ├── controller/               # REST controllers
│       ├── service/                  # Business logic
│       ├── entity/                   # JPA entities
│       ├── repository/               # Spring Data repositories
│       ├── dto/                      # Request/response objects
│       ├── security/                 # JWT filter & utils
│       └── config/                   # Spring Security config
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/             # Flyway SQL migrations
│
├── frontend/                         # React Native app
│   ├── app/                          # Expo Router screens
│   │   ├── _layout.tsx               # Root layout + tab navigation
│   │   ├── index.tsx                 # Home
│   │   ├── events.tsx                # Events list
│   │   ├── experience.tsx            # Experience
│   │   ├── library.tsx               # Library
│   │   └── profile.tsx               # Profile / Login
│   └── src/
│       ├── screens/                  # Screen components
│       ├── services/                 # API calls (axios)
│       ├── context/                  # Auth context
│       └── theme/                    # Design tokens (colours, spacing)
│
└── .gitignore
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Base64-encoded 256-bit JWT secret |
| `EXPO_PUBLIC_API_URL` | Backend API URL for the mobile app |

---

## 🙏 About Sacred Lounge

Sacred Lounge is a community gathering inspired by the Hare Krishna tradition, offering guided meditation, mantra music, kirtan, wisdom talks and heart-centred connection. Events are held regularly at The Life Centre, Deansgate, Manchester.

---

*Built with love and stillness* 🪷
