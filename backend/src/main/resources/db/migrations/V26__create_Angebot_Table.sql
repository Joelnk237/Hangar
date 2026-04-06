CREATE TABLE angebot (
                       id SERIAL PRIMARY KEY,
                       stellplatz_id UUID NOT NULL REFERENCES stellplatz(id) ON DELETE CASCADE,
                       flugzeug_id UUID NOT NULL REFERENCES flugzeug(id) ON DELETE CASCADE,
                       flugzeugbesitzer_id UUID NOT NULL REFERENCES flugzeugbesitzer(id) ON DELETE CASCADE,
                       hangaranbieter_id UUID NOT NULL REFERENCES hangaranbieter(id) ON DELETE CASCADE,
                       von DATE NOT NULL,
                       bis DATE NOT NULL,
                       inhalt TEXT,
                       accepted BOOLEAN,

                       CONSTRAINT angebot_unique_pro_zeitraum
                         UNIQUE (stellplatz_id, flugzeug_id, von, bis),

                       CHECK (bis >= von)
);

