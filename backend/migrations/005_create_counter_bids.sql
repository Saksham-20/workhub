-- Create counter_bids table
CREATE TABLE IF NOT EXISTS counter_bids (
    id SERIAL PRIMARY KEY,
    proposal_id INTEGER NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    freelancer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    counter_amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_counter_bids_proposal_id ON counter_bids(proposal_id);
CREATE INDEX IF NOT EXISTS idx_counter_bids_freelancer_id ON counter_bids(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_counter_bids_status ON counter_bids(status);

-- Add counter bid fields to proposals table
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS has_counter_bid BOOLEAN DEFAULT FALSE;
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS latest_counter_amount DECIMAL(10,2);
