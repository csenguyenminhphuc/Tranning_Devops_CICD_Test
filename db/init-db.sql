-- Create database if not exists
-- (PostgreSQL Docker image will create the database based on POSTGRES_DB environment variable)

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some sample data
INSERT INTO users (name, email) VALUES 
('Nguyễn Minh Phúc', 'phuc.nguyen@example.com'),
('Admin User', 'admin@phucncc.com'),
('Test User', 'test@example.com')
ON CONFLICT (email) DO NOTHING;

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions to the application user
GRANT ALL PRIVILEGES ON TABLE users TO phuc;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO phuc;

COMMIT;