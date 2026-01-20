CREATE TABLE zustand (
   flugzeug_id UUID NOT NULL REFERENCES flugzeug(id) ON DELETE CASCADE,
   stellplatz_id UUID NOT NULL REFERENCES stellplatz(id) ON DELETE CASCADE,
  wartung TEXT,
  fahrbereitschaft TEXT,
  beschreibung TEXT,
   PRIMARY KEY (flugzeug_id, stellplatz_id)

);
