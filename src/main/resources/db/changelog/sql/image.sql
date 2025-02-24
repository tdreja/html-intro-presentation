-- liquibase formatted sql
-- changeset tdreja:001-create-image-table
create table
    image
(
    id        INTEGER not null,
    file_name TEXT    not null,
    mime_type TEXT    not null,
    content   BLOB    not null,
    event_id  INTEGER not null,
    primary key (id)
);