CREATE TABLE flugzeugbesitzer (
                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                benutzer_id UUID NOT NULL UNIQUE
                                  REFERENCES benutzer(id) ON DELETE CASCADE,

                                telefon TEXT,
                                erstellt_am TIMESTAMP DEFAULT now()
);
