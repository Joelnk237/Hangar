CREATE TABLE IF NOT EXISTS uebergabe_rueckgabe_termin
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    flugzeugbesitzer_id uuid NOT NULL,
    hangaranbieter_id uuid NOT NULL,
    termin_zeitpunkt timestamp with time zone NOT NULL,
    ist_uebergabe boolean NOT NULL,
    CONSTRAINT uebergabe_rueckgabe_termin_pkey PRIMARY KEY (id),
    CONSTRAINT flugzeugbesitzer_id_fkey FOREIGN KEY (flugzeugbesitzer_id)
        REFERENCES flugzeugbesitzer (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT hangaranbieter_id_fkey FOREIGN KEY (hangaranbieter_id)
        REFERENCES hangaranbieter (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)
