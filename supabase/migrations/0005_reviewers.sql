-- Reviewers (friends, partners, editors) read every book in full, including unlisted drafts, free for life.
alter table users add column if not exists is_reviewer boolean not null default false;
