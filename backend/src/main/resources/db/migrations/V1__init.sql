CREATE TYPE benutzerrolle AS ENUM (
  'hangaranbieter',
  'flugzeugbesitzer',
  'flugzeugwartungsanbieter',
  'flugzeugteileanbieter'
);

CREATE TYPE flugzeugtyp_enum AS ENUM (
  'SEP',
  'MEP',
  'Helikopter',
  'Jet',
  'Turboprop',
  'Ultraleicht'
);

CREATE TYPE flugzeuggroesse_enum AS ENUM (
  'XS', -- UL, Gyro
  'S',  -- C172, PA28
  'M',  -- Bonanza, TBM
  'L',  -- King Air
  'XL'  -- Business Jet
);


CREATE TABLE benutzer (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

                        rolle benutzerrolle NOT NULL,

                        name TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        passwort_hash TEXT NOT NULL,

                        strasse TEXT,
                        hausnummer TEXT,
                        plz TEXT,
                        ort TEXT,

                        erstellt_am TIMESTAMP NOT NULL DEFAULT now(),
                        aktiviert BOOLEAN DEFAULT true
);
