CREATE TABLE service_zu_stellplatz (
                        stellplatz_id UUID REFERENCES stellplatz(id) ON DELETE CASCADE ,
                        service_id INTEGER REFERENCES service(id) ON DELETE CASCADE,
                        PRIMARY KEY (stellplatz_id, service_id)
);

CREATE TABLE gebuchter_zusatzservice (
                                     stellplatz_id UUID REFERENCES stellplatz(id) ON DELETE CASCADE ,
                                     zusatzservice_id INTEGER REFERENCES zusatzservice(id) ON DELETE CASCADE,
                                     PRIMARY KEY (stellplatz_id, zusatzservice_id)
);
