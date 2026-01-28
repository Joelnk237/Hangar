CREATE TABLE anfrage (
                       id SERIAL PRIMARY KEY,
                       flugzeugbesitzer_id UUID NOT NULL REFERENCES flugzeugbesitzer(id) ON DELETE CASCADE,
                       hangaranbieter_id UUID NOT NULL REFERENCES hangaranbieter(id) ON DELETE CASCADE,
                       stellplatz_id UUID NOT NULL REFERENCES stellplatz(id) ON DELETE CASCADE,
                       flugzeug_id UUID REFERENCES flugzeug(id) ON DELETE CASCADE,
                       inhalt TEXT,
                       is_detailsinfos BOOLEAN NOT NULL DEFAULT false,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
