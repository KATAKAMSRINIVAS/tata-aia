-- Run in Supabase SQL Editor (or via CLI). Safe to re-run: uses IF NOT EXISTS.
-- Table: policy_categories

-- New brochure section columns
ALTER TABLE policy_categories
  ADD COLUMN IF NOT EXISTS premium_details text,
  ADD COLUMN IF NOT EXISTS plan_term_details text,
  ADD COLUMN IF NOT EXISTS maturity_details text,
  ADD COLUMN IF NOT EXISTS sample_plan_section_title text;

-- Core copy columns (plan pages + brochure merge)
ALTER TABLE policy_categories
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS benefits jsonb,
  ADD COLUMN IF NOT EXISTS eligibility text;

-- Seed / update brochure copy per category slug
UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premiums depend on age, sum assured, term, and product variant. Your advisor will walk through indicative options and tax implications before you decide.',
  plan_term_details = 'Typical terms range from short protection windows to longer coverage periods; the right term matches your income years and family obligations.',
  maturity_details = 'Pure term plans usually do not pay a maturity benefit—the focus is life protection for your nominees. Confirm product-specific wording with your advisor.'
WHERE category = 'term';

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premium payment modes (annual, half-yearly, etc.) and amounts vary by age, premium payment term, and fund or bonus structure. Your advisor will explain options suited to your cash flow.',
  plan_term_details = 'Policy terms often combine a premium payment period with a longer coverage or accumulation phase; align the term with when you need money back or continued protection.',
  maturity_details = 'Savings-oriented plans may pay maturity or survival benefits as defined in the product; bonuses or returns are illustrative until confirmed in the official illustration.'
WHERE category = 'savings';

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premiums are set based on the life assured''s age, sum assured, and how long you pay—your advisor will share indicative figures for education or milestone goals.',
  plan_term_details = 'Choose a term that covers school and higher education years; some designs link payouts to key ages so funds arrive when milestones occur.',
  maturity_details = 'Benefits may include guaranteed or accrued amounts around maturity for the child''s future needs; exact structure depends on the selected child plan—review the illustration carefully.'
WHERE category = 'children';

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Contribution amounts depend on entry age, deferment or payout preferences, and whether income starts immediately or later. Your advisor will align premium with your retirement timeline.',
  plan_term_details = 'Deferment period and annuity or withdrawal phase define how long you accumulate versus how long income lasts—pick terms that match your retirement age and lifestyle.',
  maturity_details = 'Payouts may be annuity income, lump sum, or a combination per product rules; tax treatment can vary—confirm maturity and income details with your advisor.'
WHERE category = 'retirement';

-- RLS: new columns are readable whenever existing SELECT policies apply (column-level grants are uncommon on Supabase).
-- Verify policies allow anon SELECT on policy_categories:
--   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
--   FROM pg_policies WHERE tablename = 'policy_categories';
--
-- If SELECT is denied for anon, add (adjust USING to match your rule, e.g. is_active):
--   CREATE POLICY "Allow public read policy_categories"
--   ON policy_categories FOR SELECT TO anon USING (true);
