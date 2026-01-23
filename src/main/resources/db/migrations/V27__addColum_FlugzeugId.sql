
ALTER TABLE gebuchter_zusatzservice
  ADD COLUMN flugzeug_id UUID NOT NULL;


ALTER TABLE gebuchter_zusatzservice
  ADD CONSTRAINT gebuchter_zusatzservice_flugzeug_fkey
    FOREIGN KEY (flugzeug_id)
      REFERENCES flugzeug(id)
      ON DELETE CASCADE;


ALTER TABLE gebuchter_zusatzservice
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT now();


ALTER TABLE gebuchter_zusatzservice
DROP CONSTRAINT gebuchter_zusatzservice_pkey;


ALTER TABLE gebuchter_zusatzservice
  ADD CONSTRAINT gebuchter_zusatzservice_unique_combination
    UNIQUE (stellplatz_id, zusatzservice_id, flugzeug_id);
