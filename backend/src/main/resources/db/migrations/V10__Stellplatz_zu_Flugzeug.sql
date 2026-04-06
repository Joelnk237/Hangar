CREATE TABLE flugzeug_zu_stellplatz (
                                     stellplatz_id UUID REFERENCES stellplatz(id) ON DELETE CASCADE ,
                                     flugzeug_id UUID REFERENCES flugzeug(id) ON DELETE CASCADE,
                                      von DATE NOT NULL ,
                                      bis DATE NOT NULL ,
                                     PRIMARY KEY (stellplatz_id, flugzeug_id)
);
