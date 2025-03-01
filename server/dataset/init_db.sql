-- Drop existing databases if they exist
DROP DATABASE IF EXISTS medismart_delhi;
DROP DATABASE IF EXISTS medismart_kolkata;

-- Create the databases
CREATE DATABASE medismart_delhi;
CREATE DATABASE medismart_kolkata;

-- Connect to Delhi database
\c medismart_delhi

-- Create tables for Delhi
CREATE TABLE medicines (
    medicine_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL
);

CREATE TABLE batches (
    batch_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(medicine_id),
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    qr_code VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE usage_history (
    usage_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(medicine_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    date DATE NOT NULL,
    quantity_used INTEGER NOT NULL
);

CREATE TABLE predictions (
    prediction_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(medicine_id),
    predicted_demand INTEGER NOT NULL,
    period VARCHAR(7) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE thresholds (
    medicine_id INTEGER PRIMARY KEY REFERENCES medicines(medicine_id),
    reorder_level INTEGER NOT NULL,
    reorder_quantity INTEGER NOT NULL
);

CREATE TABLE pandemics (
    pandemic_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    demand_multiplier FLOAT NOT NULL
);

-- Create the same tables for Kolkata database
\c medismart_kolkata

CREATE TABLE medicines (
    medicine_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL
);

CREATE TABLE batches (
    batch_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(medicine_id),
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    qr_code VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE usage_history (
    usage_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(medicine_id),
    batch_id INTEGER REFERENCES batches(batch_id),
    date DATE NOT NULL,
    quantity_used INTEGER NOT NULL
);

CREATE TABLE predictions (
    prediction_id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(medicine_id),
    predicted_demand INTEGER NOT NULL,
    period VARCHAR(7) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

CREATE TABLE thresholds (
    medicine_id INTEGER PRIMARY KEY REFERENCES medicines(medicine_id),
    reorder_level INTEGER NOT NULL,
    reorder_quantity INTEGER NOT NULL
);

CREATE TABLE pandemics (
    pandemic_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    demand_multiplier FLOAT NOT NULL
);
