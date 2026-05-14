-- Migration: Add comprehensive brochure section fields to policy_categories table
-- Date: 2026-05-13
-- Purpose: Support dynamic brochure generation with database-driven content

-- Add new columns for brochure sections if they don't exist
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

-- ============================================================================
-- UPDATE: TERM PLANS
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

-- ============================================================================
-- UPDATE: SAVINGS PLANS
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

-- ============================================================================
-- UPDATE: CHILDREN PLANS
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

-- ============================================================================
-- UPDATE: RETIREMENT PLANS
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

-- ============================================================================
-- RLS VERIFICATION
-- ============================================================================
-- Verify that RLS allows anon users to SELECT from policy_categories:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies WHERE tablename = 'policy_categories';
--
-- If SELECT is denied for anon, add this policy (adjust USING clause as needed):
--   CREATE POLICY "Allow public read policy_categories"
--   ON policy_categories FOR SELECT TO anon USING (true);
