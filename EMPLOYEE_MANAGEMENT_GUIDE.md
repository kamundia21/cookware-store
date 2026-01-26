# 👥 Employee Management System Guide

## Overview
Your Admin Dashboard now includes a complete employee management system. You can add, view, and delete employees directly from the admin panel.

## How to Add an Employee

1. **Login to Admin Panel**
   - Go to `/admin/add-product` 
   - Login with your admin credentials

2. **Switch to Employees Tab**
   - Click the **👥 Employees** button in the admin header
   - You'll see the "Add New Employee" form

3. **Fill in Employee Details**
   - **Full Name**: Employee's complete name (required)
   - **Email**: Valid email address (required)
   - **Phone**: Valid phone number like 0712345678 (required)
   - **Department**: Select from:
     - Sales
     - Warehouse
     - Delivery
     - Customer Support
     - Admin

4. **Submit the Form**
   - Click **"Add Employee"** button
   - Wait for confirmation message
   - Success message will show "Employee [name] added successfully!"

## Features

### ✅ Add Employees
- Simple form with validation
- Auto-saves to Supabase database
- Real-time confirmation messages

### 📋 View Employees
- See all employees in a table format
- Displays: Name, Email, Phone, Department, Date Added
- Sorted by most recently added first

### 🗑️ Delete Employees
- Click the **Delete** button next to any employee
- Confirm the deletion
- Employee is immediately removed

## Database
- Employees are stored in Supabase `employees` table
- Data includes: ID, Full Name, Email, Phone, Department, Created Date
- Data persists across sessions

## Error Handling
If you encounter errors when adding an employee:
- **"Please enter employee name"** - Full name field is empty
- **"Please enter a valid email"** - Email format is incorrect
- **"Please enter a valid phone number"** - Phone number is invalid or too short
- **"Failed to add employee: [error]"** - Supabase connection issue

### Troubleshooting Supabase Errors:
1. Check your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Verify the `employees` table exists in Supabase (see next section)
3. Check browser console for detailed error messages

## Setting Up the Employees Table in Supabase

If employees aren't saving, you may need to create the table:

1. **Go to Supabase Dashboard**
   - Open https://app.supabase.com
   - Select your project

2. **Create the Table**
   - Click **"SQL Editor"** 
   - Run this SQL:

```sql
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(100) DEFAULT 'sales',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_created_at ON employees(created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
```

3. **Allow Public Access (for testing)**
   - Still in SQL Editor, run:

```sql
CREATE POLICY "Enable public read access" ON employees
  FOR SELECT USING (true);

CREATE POLICY "Enable public insert access" ON employees
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public delete access" ON employees
  FOR DELETE USING (true);
```

## Tips
- Employee data is stored separately from user accounts
- This is for your HR/management records only
- You can export employee data from Supabase dashboard anytime
- Phone numbers are stored as text, so any format works (0712345678, +254712345678, etc.)

## Next Steps
- Add all your current employees
- Set up automated employee schedules (future feature)
- Create employee access control system (future feature)

## Support
For issues:
1. Check browser console (F12) for detailed errors
2. Verify Supabase table structure
3. Make sure all environment variables are set correctly
