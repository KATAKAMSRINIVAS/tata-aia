# 🛡️ Admin Portal - Lead Management

## Overview
The Admin Portal (`admin.html`) provides a comprehensive interface for managing leads generated from the contact form. All leads are stored in the `policy_leads` table in Supabase.

## Features

### 📊 Dashboard Statistics
- **Total Leads**: Count of all submissions
- **New Leads**: Leads with "new" status
- **This Month**: Leads submitted in current month

### 📋 Leads Management Table
Displays all leads with the following columns:
- **ID**: Unique lead identifier
- **Name**: Customer name
- **Email**: Contact email (clickable mailto link)
- **Phone**: Contact phone number
- **Policy Selected**: Which policy they're interested in
- **Status**: Current status (new/contacted/closed)
- **Submitted At**: Date and time of submission
- **Actions**: Buttons to update status

### 📥 Excel Export
- Click "Export to Excel" to download all leads
- File format: `.xlsx` with proper column headers
- Includes all lead data with formatted dates
- Auto-sized columns for better readability

### 🔄 Status Management
- **Contacted**: Mark when you've reached out to the lead
- **Closed**: Mark when the lead has been converted or is no longer active
- Status changes are saved immediately to the database

## Database Schema

```sql
CREATE TABLE policy_leads (
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
```

## Security Notes
- Row Level Security (RLS) is enabled
- Anonymous users can insert leads (from contact form)
- Authenticated users can read/update leads (admin access)
- No public link to admin portal for security

## Usage Instructions

1. **Access**: Open `admin.html` directly in browser
2. **View Leads**: Leads load automatically on page load
3. **Refresh**: Click "Refresh Data" to reload from database
4. **Export**: Click "Export to Excel" to download spreadsheet
5. **Update Status**: Use action buttons in the table to change lead status

## Technical Details

### Dependencies
- Supabase client (`@supabase/supabase-js`)
- SheetJS library (`xlsx`) for Excel export
- Existing styles.css for consistent UI

### API Calls
- `SELECT * FROM policy_leads ORDER BY submitted_at DESC`
- `UPDATE policy_leads SET status = ? WHERE id = ?`

### File Structure
```
admin.html          # Main admin interface
script.js           # Contains admin functionality
styles.css          # Admin-specific styles added
supabase-config.js  # Database connection
```

## Troubleshooting

### No Leads Showing
- Check if `policy_leads` table exists in Supabase
- Verify RLS policies allow authenticated reads
- Check browser console for errors

### Export Not Working
- Ensure SheetJS library is loaded (`xlsx` script tag)
- Check browser console for JavaScript errors
- Verify leads data is loading properly

### Status Updates Failing
- Check Supabase connection
- Verify RLS policies allow updates
- Ensure user has proper authentication (if required)