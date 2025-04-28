-- Таблица для логов событий здоровья
CREATE TABLE health_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  face_id UUID REFERENCES face_profiles(id),
  is_sick BOOLEAN NOT NULL,
  confidence FLOAT NOT NULL, -- Уверенность модели
  temperature FLOAT, -- Замеренная температура
  symptoms TEXT[], -- Массив симптомов ['красные глаза', 'бледность']
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);