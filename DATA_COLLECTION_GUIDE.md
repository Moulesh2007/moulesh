# RS&CO Tracking System - Data Collection Script
## Excel Output Format & Sample Data

### How to Run the Script

```bash
# Install required libraries
pip install pandas openpyxl

# Run the script
python data_collection_to_excel.py
```

---

## Excel File Structure

The script creates an Excel file named **`rs_and_co_data.xlsx`** with two sheets:

### Sheet 1: Users

**Columns:** Name | Email | Phone | Role

| Name | Email | Phone | Role |
|------|-------|-------|------|
| John Smith | john.smith@email.com | +1-555-0101 | admin |
| Sarah Johnson | sarah.johnson@email.com | +1-555-0102 | manager |
| Michael Brown | michael.brown@email.com | +1-555-0103 | driver |
| Emma Davis | emma.davis@email.com | +1-555-0104 | client |
| David Wilson | david.wilson@email.com | +1-555-0105 | manager |
| Lisa Anderson | lisa.anderson@email.com | +1-555-0106 | client |

---

### Sheet 2: Drivers

**Columns:** Driver ID | Name | Contact | License Number | Bus Number | Route

| Driver ID | Name | Contact | License Number | Bus Number | Route |
|-----------|------|---------|-----------------|-----------|-------|
| DRV001 | James Martinez | +1-555-1001 | DL-2024-0001 | BUS-101 | Route A (City A - City B) |
| DRV002 | Robert Lee | +1-555-1002 | DL-2024-0002 | BUS-102 | Route B (City B - City C) |
| DRV003 | Christopher Garcia | +1-555-1003 | DL-2024-0003 | BUS-103 | Route C (City C - City D) |
| DRV004 | Daniel Rodriguez | +1-555-1004 | DL-2024-0004 | BUS-104 | Route A (City A - City B) |
| DRV005 | Andrew Taylor | +1-555-1005 | DL-2024-0005 | BUS-105 | Route D (City D - City E) |
| DRV006 | Kevin Thomas | +1-555-1006 | DL-2024-0006 | BUS-106 | Route B (City B - City C) |

---

## Usage Example

### Step 1: User Registration
```
============================================================
STEP 1: USER REGISTRATION
============================================================
Enter Name: Sarah Johnson
Enter Email: sarah.johnson@email.com
Enter Phone Number: +1-555-0102
Enter Role (admin/manager/driver/client): manager
```

### Step 2: Bus Driver Registration
```
============================================================
STEP 2: BUS DRIVER REGISTRATION
============================================================
(Type 'done' or 'exit' when finished entering drivers)

--- Driver #1 ---
Enter Driver ID (or type 'done'/'exit' to finish): DRV001
Enter Driver Name: James Martinez
Enter Contact Number: +1-555-1001
Enter License Number: DL-2024-0001
Enter Bus Number: BUS-101
Enter Route (e.g., Route A, City A - City B): Route A (City A - City B)
✓ Driver #1 added successfully.

--- Driver #2 ---
Enter Driver ID (or type 'done'/'exit' to finish): DRV002
Enter Driver Name: Robert Lee
Enter Contact Number: +1-555-1002
Enter License Number: DL-2024-0002
Enter Bus Number: BUS-102
Enter Route (e.g., Route A, City A - City B): Route B (City B - City C)
✓ Driver #2 added successfully.

--- Driver #3 ---
Enter Driver ID (or type 'done'/'exit' to finish): done
✓ Driver data collection completed.
```

### Step 3: Output
```
============================================================
EXCEL FILE PREVIEW
============================================================

📄 SHEET 1: Users
------------------------------------------------------------
           Name                    Email        Phone      Role
Sarah Johnson  sarah.johnson@email.com  +1-555-0102    manager
Total Users: 1

📄 SHEET 2: Drivers
------------------------------------------------------------
Driver ID           Name        Contact License Number Bus Number                      Route
     DRV001  James Martinez  +1-555-1001     DL-2024-0001   BUS-101  Route A (City A - City B)
     DRV002     Robert Lee  +1-555-1002     DL-2024-0002   BUS-102  Route B (City B - City C)
Total Drivers: 2

============================================================
✓ Data collection completed successfully!
============================================================

📁 File location: C:\Users\moule\Downloads\rs&co tracking\rs_and_co_data.xlsx
```

---

## Key Features of the Script

✅ **Two Separate Sheets** - Users and Drivers data stored separately
✅ **Multiple Entries** - Add multiple drivers in one session using a loop
✅ **Append Mode** - New data appends to existing data without overwriting
✅ **Validation** - Checks for file existence and creates if needed
✅ **Error Handling** - Graceful error messages and exception handling
✅ **Preview Display** - Shows the final Excel content in console
✅ **User-Friendly** - Clear prompts and visual feedback (✓, ✗, ℹ)
✅ **Exit Options** - Type 'done' or 'exit' to finish driver entry

---

## Data Persistence

If you run the script multiple times:

**First Run:**
- Creates `rs_and_co_data.xlsx` file
- Adds 1 User and N Drivers

**Second Run:**
- Opens existing file
- Appends new User data (no overwrite)
- Appends new Driver data (no overwrite)
- Total rows = Previous rows + New rows

---

## Advanced Features

### Modify the Script (Optional Enhancements)

**1. Add Data Validation:**
```python
import re

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
```

**2. Add Duplicate Prevention:**
```python
if user_data['Email'] in users_df['Email'].values:
    print("✗ Email already exists!")
    return
```

**3. Add Data Export Options:**
```python
# Export to CSV
users_df.to_csv('users.csv', index=False)

# Export to JSON
users_df.to_json('users.json', orient='records')
```

---

## Troubleshooting

### Error: `ModuleNotFoundError: No module named 'pandas'`
**Solution:** Install pandas and openpyxl
```bash
pip install pandas openpyxl
```

### Error: `PermissionError: [Errno 13] Permission denied`
**Solution:** Close Excel file if it's open in another program

### Error: File keeps getting overwritten
**Solution:** Make sure you're using `mode='a'` (append mode) in ExcelWriter

---

## File Requirements

- **Python 3.6+**
- **pandas**: `pip install pandas`
- **openpyxl**: `pip install openpyxl`

