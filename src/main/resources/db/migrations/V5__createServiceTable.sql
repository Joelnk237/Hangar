CREATE TYPE servicename_enum AS ENUM (
  'Einlagerung',
  'Flugbereitschaft',
  'Tanken',
  'Reinigung'
);
CREATE TABLE service (
                              id SERIAL PRIMARY KEY ,
                              bezeichnung servicename_enum NOT NULL,

                              preis NUMERIC NOT NULL,
                              einheit VARCHAR(255)

);
