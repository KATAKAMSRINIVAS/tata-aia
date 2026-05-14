# TATA-AIA Insurance Brochure System - Database & Implementation Guide

## Overview
This document outlines the complete setup for dynamic brochure generation with database-driven content for all insurance plans.

---

## 📊 Database Schema - policy_categories Table

### New Columns to Add
Execute the SQL migration file to add these columns:

```sql
-- Core Brochure Section Columns
about_plan                   TEXT         -- About this plan section
key_benefits                 JSONB        -- Array of benefit items
eligibility_details          TEXT         -- Eligibility details section
sample_plan_section_title    TEXT         -- Title for Sample Plan Details (default: "Sample Plan Details")
premium_details              TEXT         -- Premium explanation section
plan_term_details            TEXT         -- Plan term explanation
maturity_details             TEXT         -- Maturity details section
download_count               INT          -- Track brochure downloads (default: 0)
```

### Column Details

| Column Name | Type | Purpose | Example |
|------------|------|---------|---------|
| `about_plan` | TEXT | Brief overview of the plan | "Term insurance offers high-value protection..." |
| `key_benefits` | JSONB | Array of plan benefits | `["Large life cover", "Flexible terms", "..."]` |
| `eligibility_details` | TEXT | Who can buy this plan | "Available for individuals aged 18 to 65..." |
| `sample_plan_section_title` | TEXT | Title for sample details section | "Sample Plan Details" |
| `premium_details` | TEXT | How premiums are calculated | "Premiums depend on age, sum assured, term..." |
| `plan_term_details` | TEXT | Explanation of plan terms | "Typical terms range from short to long..." |
| `maturity_details` | TEXT | What happens at maturity | "Savings plans may pay maturity benefits..." |

---

## 🗄️ SQL Migration File

**Location:** `supabase/migrations/20260513000000_add_brochure_sections_complete.sql`

### How to Apply:
1. Open Supabase Dashboard → SQL Editor
2. Copy the entire migration file content
3. Execute the SQL script
4. All four plan categories (term, savings, children, retirement) will be automatically populated

### What It Does:
- ✅ Adds all new columns with IF NOT EXISTS clause
- ✅ Seeds all content for each plan category
- ✅ Updates are idempotent (safe to re-run)

---

## 🎨 Brochure Sections Structure

Each downloaded brochure now includes:

### 1. **About This Plan** (about_plan)
```
"Term insurance offers high-value protection for your family 
during the years they need it most."
```

### 2. **Key Benefits** (key_benefits - JSONB Array)
```json
[
  "Large life cover at an affordable premium",
  "Financial protection for dependents",
  "Flexible policy term and sum assured options"
]
```

### 3. **Eligibility Details** (eligibility_details)
```
"Available for individuals aged 18 to 65. Ideal for salaried 
professionals and family providers."
```

### 4. **Sample Plan Details** (New Composite Section)
A comprehensive section with three subsections:

#### a. What is the Premium? (premium_details)
```
"Premiums depend on age, sum assured, term, and product variant. 
Your advisor will walk through indicative options and tax 
implications before you decide."
```

#### b. Plan Term (plan_term_details)
```
"Typical terms range from short protection windows to longer 
coverage periods; the right term matches your income years and 
family obligations."
```

#### c. Maturity Details (maturity_details)
```
"Pure term plans usually do not pay a maturity benefit—the focus 
is life protection for your nominees. Confirm product-specific 
wording with your advisor."
```

---

## 📁 Updated Files

### 1. **script.js** - Main application script
- Fetches brochure data from Supabase on page load
- Falls back to hardcoded defaults if database unavailable
- Generates dynamic brochures with all sections
- Updated `buildBrochureHTML()` function includes new sections

### 2. **Individual Plan Pages** (term.html, savings.html, children.html, retirement.html)
- Updated HTML structure with new section elements
- New element IDs: `policy-about`, `policy-premium`, `policy-term`, `policy-maturity`
- Fetch from Supabase on page load
- Display static fallback content immediately, then update with database content

### 3. **brochure.html** - Static brochure template (unchanged)
Used only when opened directly; dynamic brochures from "Download Brochure" button use script.js

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  User Clicks "Download Brochure"            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         script.js → buildBrochureHTML(slug)                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Fetch from brochureData object │
        │  (Already loaded from Supabase) │
        └────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│   Generate HTML with all 4 sections:                        │
│   1. About this plan (about_plan)                           │
│   2. Key benefits (key_benefits)                            │
│   3. Eligibility details (eligibility_details)              │
│   4. Sample Plan Details (premium/term/maturity)            │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Download/Preview as .html file                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Row-Level Security (RLS)

### Required Policy
Ensure anon users can SELECT from policy_categories:

```sql
-- Verify existing RLS:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE tablename = 'policy_categories';

-- If SELECT is missing for anon, add:
CREATE POLICY "Allow public read policy_categories"
ON policy_categories FOR SELECT TO anon USING (true);
```

---

## 🧪 Testing Checklist

- [ ] 1. Run migration SQL script in Supabase
- [ ] 2. Verify all 4 plan rows exist in policy_categories table
- [ ] 3. Verify new columns are populated with content
- [ ] 4. Test "Download Brochure" button on index.html
- [ ] 5. Verify brochure contains all 4 sections
- [ ] 6. Test individual plan pages (term.html, savings.html, etc.)
- [ ] 7. Verify each page shows all sections with dynamic content
- [ ] 8. Test fallback: temporarily break Supabase connection and verify static content displays

---

## 📝 Customization Guide

### Editing Brochure Content

To update brochure content for any plan:

```sql
UPDATE policy_categories SET
  about_plan = 'Your new about content here...',
  key_benefits = jsonb_build_array(
    'Benefit 1',
    'Benefit 2',
    'Benefit 3'
  ),
  eligibility_details = 'Your eligibility details...',
  premium_details = 'Your premium explanation...',
  plan_term_details = 'Your term explanation...',
  maturity_details = 'Your maturity explanation...'
WHERE category = 'term';  -- Change 'term' to: savings, children, or retirement
```

### Adding New Plan Categories

1. Insert a new row in policy_categories:
```sql
INSERT INTO policy_categories (category, about_plan, key_benefits, ...)
VALUES ('new_plan', 'About...', jsonb_build_array(...), ...);
```

2. Add to policyTitles in script.js:
```javascript
const policyTitles = {
  term: "Term Plans",
  savings: "Savings Plans",
  children: "Children Plans",
  retirement: "Retirement Plans",
  new_plan: "New Plan Name"  // ← Add this
};
```

3. Create new_plan.html file with SLUG = "new_plan"

---

## 🚀 Deployment

1. **Backup current data** (if any)
2. **Execute migration** in Supabase SQL Editor
3. **Test thoroughly** using checklist above
4. **No code changes needed** if using existing plan categories (term, savings, children, retirement)
5. **Monitor** `download_count` in policy_categories to track brochure downloads

---

## 📊 Monitoring & Analytics

The system tracks:
- **download_count** - Incremented each time a brochure is downloaded
- Query: `SELECT category, download_count FROM policy_categories;`

---

## 🐛 Troubleshooting

### Issue: "Supabase connection error"
**Solution:** Verify RLS policies allow anon SELECT on policy_categories

### Issue: Brochure showing static fallback content only
**Solution:** Check browser console for Supabase errors; verify policy_categories table has data

### Issue: JSONB benefits not displaying as list
**Solution:** Ensure key_benefits is stored as JSONB array, not JSON string

### Issue: Downloaded HTML file is blank
**Solution:** Clear browser cache; ensure buildBrochureHTML() returns valid HTML

---

## 📚 References

- **Supabase Docs:** https://supabase.io/docs
- **JSONB in PostgreSQL:** https://www.postgresql.org/docs/current/datatype-json.html
- **JavaScript Blob API:** https://developer.mozilla.org/en-US/docs/Web/API/Blob

---

**Created:** May 13, 2026  
**Version:** 1.0  
**Status:** Ready for Production
