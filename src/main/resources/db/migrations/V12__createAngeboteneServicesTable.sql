CREATE TABLE angebotene_services (
                          service_id INTEGER NOT NULL REFERENCES service(id) ON DELETE CASCADE,
                          hangaranbieter_id UUID NOT NULL REFERENCES hangaranbieter(id) ON DELETE CASCADE,
                          PRIMARY KEY (hangaranbieter_id, service_id)

);
