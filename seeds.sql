DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(250) UNIQUE NOT NULL,
password_digest VARCHAR(100) NOT NULL
);

CREATE TABLE preferences (
id SERIAL PRIMARY KEY,
user_id INT NOT NULL,
url_string VARCHAR(250) NOT NULL,
FOREIGN KEY (user_id) REFERENCES users (id)
);


INSERT INTO users (email, password_digest) VALUES ('farihamzfaruquekazi@gmail.com', 'hellothere123');
