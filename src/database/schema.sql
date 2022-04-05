CREATE DATABASE my_contacts2;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  category_id UUID DEFAULT null,
  FOREIGN KEY(category_id) REFERENCES categories(id)
);
