CREATE TABLE IF NOT EXISTS proposals (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL,
    bid_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, freelancer_id)
);

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE
ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_proposals_job_id ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);