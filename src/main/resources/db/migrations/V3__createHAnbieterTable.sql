CREATE TABLE hangaranbieter (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              benutzer_id UUID NOT NULL UNIQUE
                                REFERENCES benutzer(id) ON DELETE CASCADE,

                              firmenname TEXT NOT NULL,
                              ansprechpartner VARCHAR(255),
                              telefon TEXT,

                              hangar_merkmale JSONB NOT NULL,
                              services JSONB NOT NULL,
                              flugzeugtyp_und_stellplaetze JSONB NOT NULL,

                              erstellt_am TIMESTAMP DEFAULT now(),
                              aktiv BOOLEAN DEFAULT true
);
