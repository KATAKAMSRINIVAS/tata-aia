-- Migration: Create policy_leads table for storing contact form submissions
-- Date: May 15, 2026
-- Purpose: Store leads from the contact form with all necessary fields

-- Create policy_leads table
CREATE TABLE IF NOT EXISTS policy_leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  policy_selected TEXT,
  category_id INTEGER REFERENCES policy_categories(id),
  category_name TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  source_page TEXT DEFAULT 'index.html',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_policy_leads_submitted_at ON policy_leads(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_policy_leads_status ON policy_leads(status);
CREATE INDEX IF NOT EXISTS idx_policy_leads_email ON policy_leads(email);

-- Enable Row Level Security (RLS)
ALTER TABLE policy_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for contact form)
CREATE POLICY "Allow anonymous inserts to policy_leads" ON policy_leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all leads (for admin)
CREATE POLICY "Allow authenticated users to read policy_leads" ON policy_leads
  FOR SELECT TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update leads (for admin)
CREATE POLICY "Allow authenticated users to update policy_leads" ON policy_leads
  FOR UPDATE TO authenticated
  USING (true);

-- Add insert_count column to policy_categories if it doesn't exist
ALTER TABLE policy_categories
  ADD COLUMN IF NOT EXISTS insert_count INTEGER DEFAULT 0;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policy_leads_updated_at
    BEFORE UPDATE ON policy_leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();