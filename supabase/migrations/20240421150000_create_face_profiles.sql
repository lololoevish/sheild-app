-- Таблица для хранения профилей лиц
CREATE TABLE face_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'staff')),
  face_embedding vector(128) NOT NULL, -- Векторное представление лица
  photo_url TEXT, -- URL фото для визуальной идентификации
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индекс для быстрого поиска по эмбеддингам
CREATE INDEX idx_face_embedding ON face_profiles USING ivfflat (face_embedding vector_l2_ops) WITH (lists = 100);