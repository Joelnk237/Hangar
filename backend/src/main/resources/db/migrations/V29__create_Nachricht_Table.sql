CREATE TABLE nachricht (
   id SERIAL PRIMARY KEY,
   hangaranbieter_id UUID NOT NULL REFERENCES hangaranbieter(id) ON DELETE CASCADE,
   flugzeugbesitzer_id UUID NOT NULL REFERENCES flugzeugbesitzer(id) ON DELETE CASCADE,
   inhalt TEXT,
   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
