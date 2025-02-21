-- liquibase formatted sql
-- changeset tdreja:001-create-event-table
create table
    event
(
    id              INTEGER not null,
    start_time      TEXT    not null,
    title           TEXT    not null,
    description     TEXT    null,
    presentation_id INTEGER not null,
    primary key (id)
);