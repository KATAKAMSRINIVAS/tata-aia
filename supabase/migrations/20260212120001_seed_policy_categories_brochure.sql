-- Seed / update brochure fields for each category slug.
-- Execute after 20260212120000_policy_categories_brochure_fields.sql

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premiums depend on age, sum assured, term, and product variant. Your advisor will walk through indicative options and tax implications before you decide.',
  plan_term_details = 'Typical terms range from short protection windows to longer coverage periods; the right term matches your income years and family obligations.',
  maturity_details = 'For pure term plans there is usually no maturity value—coverage is for protection. Confirm exact product wording with your advisor.'
WHERE category = 'term';

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premium amounts vary by age, premium payment term, sum assured, and the savings product you choose. Your advisor can illustrate indicative payment patterns.',
  plan_term_details = 'Premium payment terms and policy terms can often be aligned with goals such as education or retirement; options differ by product.',
  maturity_details = 'On maturity, benefits are paid as defined in the product—often including sum assured components and accrued bonuses where applicable. Illustrations are not guarantees.'
WHERE category = 'savings';

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premiums are structured around the child''s age and the chosen coverage or savings goal; your advisor explains frequency and duration.',
  plan_term_details = 'Terms are designed around education milestones and other goals; policy duration should match when funds will be needed.',
  maturity_details = 'Maturity or payout timing depends on the selected plan—often coinciding with higher education or adulthood. Verify figures with your advisor.'
WHERE category = 'children';

UPDATE policy_categories SET
  sample_plan_section_title = 'Sample Plan Details',
  premium_details = 'Premium depends on entry age, deferment or accumulation period, annuity options, and regulatory limits; get an indicative illustration before deciding.',
  plan_term_details = 'Accumulation period and payout phase can be tailored toward your retirement age and income needs; options vary by pension/annuity product.',
  maturity_details = 'Benefits may be taken as lump sum, annuity, or a combination per product rules and tax laws at the time of vesting or withdrawal.'
WHERE category = 'retirement';
