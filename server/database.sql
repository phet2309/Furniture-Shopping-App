CREATE DATABASE desksrus;

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    fname VARCHAR(255) NOT NULL,
    lname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users(fname, lname, email, user_password) VALUES('Bukayo', 'Saka', 'bsaka@gmail.com', 'bs7');