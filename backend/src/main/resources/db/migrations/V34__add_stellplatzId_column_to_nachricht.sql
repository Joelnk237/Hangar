
ALTER TABLE nachricht
  ADD COLUMN stellplatz_id UUID;


ALTER TABLE nachricht
  ADD CONSTRAINT nachricht_stellplatz_id_fkey
    FOREIGN KEY (stellplatz_id)
      REFERENCES stellplatz(id)
      ON DELETE CASCADE;

