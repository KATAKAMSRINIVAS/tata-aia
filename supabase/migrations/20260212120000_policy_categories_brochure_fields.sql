-- Run in Supabase SQL Editor (or via CLI). Adds brochure fields to policy_categories.

-- New columns for "Sample Plan Details" section
ALTER TABLE policy_categories
  ADD COLUMN IF NOT EXISTS premium_details text,
  ADD COLUMN IF NOT EXISTS plan_term_details text,
  ADD COLUMN IF NOT EXISTS maturity_details text,
  ADD COLUMN IF NOT EXISTS sample_plan_section_title text;

-- Core brochure copy (if missing)
ALTER TABLE policy_categories
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS benefits jsonb,
  ADD COLUMN IF NOT EXISTS eligibility text;

-- RLS: New columns are included automatically in SELECT * / row reads if your policy
-- already allows SELECT on policy_categories for anon/authenticated roles.
-- If reads fail after adding columns, re-check policies in Dashboard → Authentication → Policies.
-- Example pattern (adjust table/columns to match your setup — only if SELECT is denied):
-- CREATE POLICY "Allow public read active categories"
--   ON policy_categories FOR SELECT
--   TO anon
--   USING (is_active = true);
