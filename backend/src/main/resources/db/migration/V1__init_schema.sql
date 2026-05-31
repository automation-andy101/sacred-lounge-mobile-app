-- ============================================================
-- Sacred Lounge - Initial Database Schema
-- V1__init_schema.sql
-- ============================================================

-- USERS & AUTH
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    first_name  VARCHAR(100) NOT NULL,
    last_name   VARCHAR(100) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'MEMBER',  -- MEMBER | ADMIN
    avatar_url  VARCHAR(500),
    bio         TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVENTS
CREATE TABLE events (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) NOT NULL UNIQUE,
    description         TEXT,
    short_description   VARCHAR(500),
    image_url           VARCHAR(500),
    event_date          TIMESTAMPTZ NOT NULL,
    end_date            TIMESTAMPTZ,
    location_name       VARCHAR(255),
    location_address    VARCHAR(500),
    location_lat        DECIMAL(10,7),
    location_lng        DECIMAL(10,7),
    eventbrite_url      VARCHAR(500),
    eventbrite_id       VARCHAR(100),
    capacity            INTEGER,
    is_free             BOOLEAN NOT NULL DEFAULT TRUE,
    price               DECIMAL(8,2),
    status              VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',  -- DRAFT | PUBLISHED | CANCELLED
    what_to_expect      TEXT[],
    created_by          UUID REFERENCES users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_bookings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',  -- CONFIRMED | CANCELLED | WAITLISTED
    booked_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- EXPERIENCES
CREATE TABLE experience_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name   VARCHAR(50),
    sort_order  INTEGER NOT NULL DEFAULT 0
);

INSERT INTO experience_categories (name, slug, description, icon_name, sort_order) VALUES
    ('Guided Meditation',       'guided-meditation',    'Calm the mind and connect within.',               'lotus',     1),
    ('Mantra Music & Kirtan',   'mantra-music-kirtan',  'Soothing sounds to uplift the soul.',             'music',     2),
    ('Wisdom & Reflections',    'wisdom-reflections',   'Meaningful talks to inspire clarity.',            'book',      3),
    ('Community & Connection',  'community',            'Share, connect and grow together.',               'people',    4),
    ('Tea & Refreshments',      'tea-refreshments',     'Relax and enjoy good company.',                   'cup',       5);

-- LIBRARY (meditations, talks, music)
CREATE TABLE library_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    category        VARCHAR(50)  NOT NULL,  -- MEDITATION | TALK | MUSIC | KIRTAN
    duration_secs   INTEGER,
    audio_url       VARCHAR(500),
    image_url       VARCHAR(500),
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    is_free         BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    play_count      INTEGER NOT NULL DEFAULT 0,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_library_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id         UUID NOT NULL REFERENCES library_items(id) ON DELETE CASCADE,
    progress_secs   INTEGER NOT NULL DEFAULT 0,
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    last_played     TIMESTAMPTZ,
    UNIQUE(user_id, item_id)
);

CREATE TABLE user_favourites (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id     UUID NOT NULL REFERENCES library_items(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, item_id)
);

-- DAILY INSPIRATION
CREATE TABLE inspirations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote       TEXT NOT NULL,
    author      VARCHAR(100),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    display_date DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO inspirations (quote, author) VALUES
    ('When you take time to pause, you create space for peace.', 'Sacred Lounge'),
    ('The present moment is always the beginning of everything.', 'Eckhart Tolle'),
    ('Stillness is where creativity and solutions to problems are found.', 'Eckhart Tolle'),
    ('In the middle of movement and chaos, keep stillness inside of you.', 'Deepak Chopra'),
    ('Meditation is not a way of making your mind quiet. It''s a way of entering into the quiet that''s already there.', 'Deepak Chopra'),
    ('The soul always knows what to do to heal itself. The challenge is to silence the mind.', 'Caroline Myss'),
    ('Peace comes from within. Do not seek it without.', 'Buddha'),
    ('You have to grow from the inside out.', 'Swami Vivekananda'),
    ('Breath is the bridge which connects life to consciousness.', 'Thich Nhat Hanh'),
    ('Where there is peace and meditation, there is neither anxiety nor doubt.', 'St. Francis de Sales');

-- SEED LIBRARY ITEMS
INSERT INTO library_items (title, description, category, duration_secs, is_featured, sort_order) VALUES
    ('Morning Calm',         'Start your day with intention and stillness.',       'MEDITATION', 900,  false, 1),
    ('Letting Go',           'Release what no longer serves you.',                 'MEDITATION', 1080, false, 2),
    ('Gratitude Practice',   'Open your heart to the gifts already present.',      'MEDITATION', 720,  false, 3),
    ('Soothing Mantra Kirtan','Ancient healing sounds for the modern soul.',       'KIRTAN',     1200, true,  1),
    ('The Power of Presence','A talk on awakening to the here and now.',           'TALK',       1800, false, 1),
    ('Breath Awareness',     'Return to the anchor of the breath.',                'MEDITATION', 600,  false, 4),
    ('Om Namah Shivaya',     'Traditional Shiva mantra for inner transformation.', 'KIRTAN',     900,  false, 2);

-- SEED EVENTS
INSERT INTO events (title, slug, short_description, description, event_date, end_date, location_name, location_address, is_free, status, what_to_expect) VALUES
    (
        'A Life of Meaning & Inner Peace',
        'a-life-of-meaning-inner-peace-may',
        'An uplifting meditation and wisdom event to help you find clarity, inner strength and lasting peace.',
        'Join us for an evening of guided meditation, mantra music, and meaningful reflection designed to help you reconnect with what truly matters. Whether you''re new to meditation or an experienced practitioner, this event offers a safe and welcoming space to pause, breathe, and be.',
        '2025-05-24 15:00:00+00',
        '2025-05-24 17:00:00+00',
        'The Life Centre',
        'Deansgate, Manchester, M3 4LY',
        true,
        'PUBLISHED',
        ARRAY['Guided meditation to calm the mind','Soothing mantra music and live kirtan','Meaningful wisdom and reflections','A warm community and authentic connection','Tea, refreshments and time to connect']
    ),
    (
        'Calm Mind, Open Heart',
        'calm-mind-open-heart-jun',
        'A gentle evening of meditation and heart-centred practice.',
        'In this session we explore the connection between a settled mind and an open heart. Through breath, sound and silence, we invite you to drop beneath the surface noise and touch something deeper within.',
        '2025-06-07 15:00:00+00',
        '2025-06-07 17:00:00+00',
        'The Life Centre',
        'Deansgate, Manchester, M3 4LY',
        true,
        'PUBLISHED',
        ARRAY['Heart-opening guided meditation','Kirtan and mantra chanting','Wisdom talk on compassion','Community sharing circle','Herbal teas and light refreshments']
    ),
    (
        'Inner Strength & Clarity',
        'inner-strength-clarity-jun',
        'Discover the quiet power that lives within you.',
        'A powerful evening dedicated to building inner resilience. Through meditation, reflection and community, we''ll explore practical ways to access your innate strength and find clarity amidst the noise of everyday life.',
        '2025-06-21 15:00:00+00',
        '2025-06-21 17:00:00+00',
        'The Life Centre',
        'Deansgate, Manchester, M3 4LY',
        true,
        'PUBLISHED',
        ARRAY['Strength-building meditation','Mantra music for courage','Wisdom on resilience and clarity','Q&A and open discussion','Community tea and connection']
    );

-- NOTIFICATIONS (push tokens)
CREATE TABLE push_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    platform    VARCHAR(10)  NOT NULL,  -- IOS | ANDROID
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX idx_events_event_date       ON events(event_date);
CREATE INDEX idx_events_status           ON events(status);
CREATE INDEX idx_event_bookings_user     ON event_bookings(user_id);
CREATE INDEX idx_event_bookings_event    ON event_bookings(event_id);
CREATE INDEX idx_library_items_category  ON library_items(category);
CREATE INDEX idx_library_items_featured  ON library_items(is_featured);
CREATE INDEX idx_refresh_tokens_token    ON refresh_tokens(token);
CREATE INDEX idx_inspirations_date       ON inspirations(display_date);
