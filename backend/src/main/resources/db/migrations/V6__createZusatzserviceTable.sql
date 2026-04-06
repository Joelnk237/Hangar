CREATE TABLE zusatzservice (
                       id SERIAL PRIMARY KEY ,
                       bezeichnung TEXT NOT NULL,
                      beschreibung TEXT,

                       preis NUMERIC NOT NULL,
                       einheit VARCHAR(255)

);
