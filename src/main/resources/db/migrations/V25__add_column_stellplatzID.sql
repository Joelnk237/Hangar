ALTER TABLE uebergabe_rueckgabe_termin
  ADD COLUMN stellplatz_id UUID,
ADD CONSTRAINT stellplatz_id_fkey
FOREIGN KEY (stellplatz_id)
REFERENCES stellplatz (id)
ON DELETE SET NULL;
