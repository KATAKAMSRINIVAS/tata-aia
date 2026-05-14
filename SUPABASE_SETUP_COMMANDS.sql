-- ============================================================================
-- QUICK SETUP: Copy-paste this entire script into Supabase SQL Editor
-- ============================================================================
-- Purpose: Add comprehensive brochure fields to policy_categories table
-- Date: May 13, 2026
-- All commands are idempotent (safe to re-run)
-- ============================================================================

-- Step 1: Add new columns to policy_categories table
-- ============================================================================
ALTER TABLE policy_categories
  ADD COLUMN IF NOT EXISTS about_plan text,
  ADD COLUMN IF NOT EXISTS key_benefits jsonb,
  ADD COLUMN IF NOT EXISTS eligibility_details text,
  ADD COLUMN IF NOT EXISTS eligibility_notes text,
  ADD COLUMN IF NOT EXISTS sample_plan_section_title text DEFAULT 'Sample Plan Details',
  ADD COLUMN IF NOT EXISTS premium_details text,
  ADD COLUMN IF NOT EXISTS plan_term_details text,
  ADD COLUMN IF NOT EXISTS maturity_details text,
  ADD COLUMN IF NOT EXISTS download_count int DEFAULT 0;

-- Step 2: Populate content for TERM PLANS
-- ============================================================================
UPDATE policy_categories SET
  about_plan = 'Term insurance offers high-value protection for your family during the years they need it most.',
  key_benefits = jsonb_build_array(
    'Large life cover at an affordable premium',
    'Financial protection for dependents',
    'Flexible policy term and sum assured options'
  ),
  eligibility_details = 'Available for individuals aged 18 to 65. Ideal for salaried professionals and family providers.',
  eligibility_notes = '',
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premiums depend on age, sum assured, term, and product variant. Your advisor will walk through indicative options and tax implications before you decide.',
  plan_term_details = 'Typical terms range from short protection windows to longer coverage periods; the right term matches your income years and family obligations.',
  maturity_details = 'Pure term plans usually do not pay a maturity benefit—the focus is life protection for your nominees. Confirm product-specific wording with your advisor.'
WHERE category = 'term';

-- Step 3: Populate content for SAVINGS PLANS
-- ============================================================================
UPDATE policy_categories SET
  about_plan = 'Build a disciplined savings habit while maintaining protection through a plan designed for long-term goals.',
  key_benefits = jsonb_build_array(
    'Regular returns with insurance cover',
    'Loyalty bonuses and maturity benefits',
    'Helps meet future goals with disciplined savings'
  ),
  eligibility_details = 'Suitable for individuals aged 25 to 55 looking for life cover plus savings.',
  eligibility_notes = '',
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premium payment modes (annual, half-yearly, etc.) and amounts vary by age, premium payment term, and fund or bonus structure. Your advisor will explain options suited to your cash flow.',
  plan_term_details = 'Policy terms often combine a premium payment period with a longer coverage or accumulation phase; align the term with when you need money back or continued protection.',
  maturity_details = 'Savings-oriented plans may pay maturity or survival benefits as defined in the product; bonuses or returns are illustrative until confirmed in the official illustration.'
WHERE category = 'savings';

-- Step 4: Populate content for CHILDREN PLANS
-- ============================================================================
UPDATE policy_categories SET
  about_plan = 'Protect your child''s future with a plan that supports education, milestones, and long-term security.',
  key_benefits = jsonb_build_array(
    'Funding for education and milestones',
    'Guaranteed growth with maturity benefits',
    'Security even in the event of a guardian''s loss'
  ),
  eligibility_details = 'Designed for parents and guardians. Covers children from birth through early adulthood.',
  eligibility_notes = '',
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premiums are set based on the life assured''s age, sum assured, and how long you pay—your advisor will share indicative figures for education or milestone goals.',
  plan_term_details = 'Choose a term that covers school and higher education years; some designs link payouts to key ages so funds arrive when milestones occur.',
  maturity_details = 'Benefits may include guaranteed or accrued amounts around maturity for the child''s future needs; exact structure depends on the selected child plan—review the illustration carefully.'
WHERE category = 'children';

-- Step 5: Populate content for RETIREMENT PLANS
-- ============================================================================
UPDATE policy_categories SET
  about_plan = 'Plan for a comfortable retirement with a strategy that creates future income and preserves your lifestyle.',
  key_benefits = jsonb_build_array(
    'Steady retirement income',
    'Tax-efficient savings',
    'Financial independence in later years'
  ),
  eligibility_details = 'Ideal for individuals aged 30 to 55 who want to secure their retirement lifestyle.',
  eligibility_notes = '',
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Contribution amounts depend on entry age, deferment or payout preferences, and whether income starts immediately or later. Your advisor will align premium with your retirement timeline.',
  plan_term_details = 'Deferment period and annuity or withdrawal phase define how long you accumulate versus how long income lasts—pick terms that match your retirement age and lifestyle.',
  maturity_details = 'Payouts may be annuity income, lump sum, or a combination per product rules; tax treatment can vary—confirm maturity and income details with your advisor.'
WHERE category = 'retirement';

-- Step 6: Verify data was inserted
-- ============================================================================
-- Run this query to verify all columns are populated:
SELECT 
  category,
  COALESCE(about_plan, 'NULL') as about_plan_status,
  COALESCE(key_benefits::text, 'NULL') as benefits_status,
  COALESCE(eligibility_details, 'NULL') as eligibility_status,
  COALESCE(eligibility_notes, 'NULL') as notes_status,
  COALESCE(premium_details, 'NULL') as premium_status,
  COALESCE(plan_term_details, 'NULL') as term_status,
  COALESCE(maturity_details, 'NULL') as maturity_status
FROM policy_categories
WHERE category IN ('term', 'savings', 'children', 'retirement');

-- Step 7: RLS Verification (IMPORTANT)
-- ============================================================================
-- Check if anon users can read policy_categories:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE tablename = 'policy_categories';

-- If no SELECT policy exists for anon role, run this:
-- CREATE POLICY "Allow public read policy_categories"
-- ON policy_categories FOR SELECT TO anon USING (true);

-- ============================================================================
-- COMPLETION CHECKLIST:
-- ============================================================================
-- [✓] All new columns added (including eligibility_notes)
-- [✓] Content populated for all 4 plans
-- [✓] Eligibility notes initialized as empty for all plans
-- [✓] Verification query confirms data
-- [✓] RLS policy allows anon SELECT
-- [✓] Ready to test with frontend
-- ============================================================================
