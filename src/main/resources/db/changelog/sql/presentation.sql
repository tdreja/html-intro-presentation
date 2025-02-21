-- liquibase formatted sql
-- changeset tdreja:001-create-presentation-table
create table
    presentation
(
    id                        INTEGER not null,
    start_time                TEXT    not null,
    title                     TEXT    not null,
    description               TEXT    null,
    countdown_runtime_seconds INTEGER not null,
    primary key (id)
);