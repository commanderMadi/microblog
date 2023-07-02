
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;


CREATE TABLE IF NOT EXISTS Articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    contents TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    likes_count INTEGER NOT NULL,
    created_at_date TEXT NOT NULL,
    modified_at_date TEXT NOT NULL,
    publish_date TEXT,
    publish_state TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_author TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    article_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (article_id) REFERENCES Articles (article_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE IF NOT EXISTS Likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE IF NOT EXISTS BlogSettings (
    blog_title TEXT NOT NULL,
    blog_subtitle TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users (user_id)
);


CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    user_role TEXT NOT NULL
);

INSERT INTO Users ("user_name", "user_email", "user_password", "user_role") VALUES ("Admin", "admin@bloggy.com", "admintest123", "Author");
INSERT INTO BlogSettings ("blog_title", "blog_subtitle", "user_id") VALUES ("Bloggy", "A Simple Microblogging Portable Platform", 1);


COMMIT;

