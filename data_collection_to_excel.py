"""
RS&CO Tracking System - Data Collection to Excel Script
========================================================
This script collects user and bus driver data via command-line input
and stores them in an Excel file with two separate sheets.

Requirements:
- pandas
- openpyxl

Installation:
pip install pandas openpyxl
"""

import pandas as pd
import openpyxl
from openpyxl import load_workbook
import os
from datetime import datetime

# Define file name and paths
EXCEL_FILE = 'rs_and_co_data.xlsx'


def create_empty_excel_if_not_exists():
    """
    Creates an Excel file with two empty sheets if it doesn't exist.
    This ensures the file has proper structure before appending data.
    """
    if not os.path.exists(EXCEL_FILE):
        print(f"\n✓ Creating new Excel file: {EXCEL_FILE}")
        
        # Create dataframes with columns but no rows
        users_df = pd.DataFrame(columns=['Name', 'Email', 'Phone', 'Role'])
        drivers_df = pd.DataFrame(columns=['Driver ID', 'Name', 'Contact', 'License Number', 'Bus Number', 'Route'])
        
        # Write to Excel with two sheets
        with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl') as writer:
            users_df.to_excel(writer, sheet_name='Users', index=False)
            drivers_df.to_excel(writer, sheet_name='Drivers', index=False)
        
        print(f"✓ Excel file created with 'Users' and 'Drivers' sheets.\n")


def collect_user_data():
    """
    Collects user information from command-line input.
    Returns: Dictionary with user data
    """
    print("\n" + "="*60)
    print("STEP 1: USER REGISTRATION")
    print("="*60)
    
    name = input("Enter Name: ").strip()
    email = input("Enter Email: ").strip()
    phone = input("Enter Phone Number: ").strip()
    role = input("Enter Role (admin/manager/driver/client): ").strip()
    
    user_data = {
        'Name': name,
        'Email': email,
        'Phone': phone,
        'Role': role
    }
    
    return user_data


def collect_driver_data():
    """
    Collects bus driver information from command-line input.
    Allows multiple entries in a loop until user types 'done' or 'exit'.
    Returns: List of dictionaries with driver data
    """
    print("\n" + "="*60)
    print("STEP 2: BUS DRIVER REGISTRATION")
    print("="*60)
    print("(Type 'done' or 'exit' when finished entering drivers)\n")
    
    drivers_list = []
    driver_count = 1
    
    while True:
        print(f"\n--- Driver #{driver_count} ---")
        
        # Check for exit command before collecting data
        driver_id = input("Enter Driver ID (or type 'done'/'exit' to finish): ").strip()
        
        if driver_id.lower() in ['done', 'exit']:
            print("\n✓ Driver data collection completed.")
            break
        
        name = input("Enter Driver Name: ").strip()
        contact = input("Enter Contact Number: ").strip()
        license_number = input("Enter License Number: ").strip()
        bus_number = input("Enter Bus Number: ").strip()
        route = input("Enter Route (e.g., Route A, City A - City B): ").strip()
        
        driver_data = {
            'Driver ID': driver_id,
            'Name': name,
            'Contact': contact,
            'License Number': license_number,
            'Bus Number': bus_number,
            'Route': route
        }
        
        drivers_list.append(driver_data)
        print(f"✓ Driver #{driver_count} added successfully.")
        driver_count += 1
    
    return drivers_list


def append_user_to_excel(user_data):
    """
    Appends user data to the 'Users' sheet in Excel.
    If the file doesn't exist, it creates one.
    """
    try:
        # Read existing data from Users sheet
        if os.path.exists(EXCEL_FILE):
            users_df = pd.read_excel(EXCEL_FILE, sheet_name='Users')
        else:
            users_df = pd.DataFrame(columns=['Name', 'Email', 'Phone', 'Role'])
        
        # Convert new user data to DataFrame
        new_user_df = pd.DataFrame([user_data])
        
        # Append new data to existing data
        users_df = pd.concat([users_df, new_user_df], ignore_index=True)
        
        # Write updated data back to Excel
        with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            users_df.to_excel(writer, sheet_name='Users', index=False)
        
        print(f"\n✓ User '{user_data['Name']}' added to 'Users' sheet.")
        
    except Exception as e:
        print(f"\n✗ Error adding user data: {e}")


def append_drivers_to_excel(drivers_list):
    """
    Appends bus driver data to the 'Drivers' sheet in Excel.
    If the file doesn't exist, it creates one.
    """
    if not drivers_list:
        print("\nℹ No drivers to add.")
        return
    
    try:
        # Read existing data from Drivers sheet
        if os.path.exists(EXCEL_FILE):
            drivers_df = pd.read_excel(EXCEL_FILE, sheet_name='Drivers')
        else:
            drivers_df = pd.DataFrame(columns=['Driver ID', 'Name', 'Contact', 'License Number', 'Bus Number', 'Route'])
        
        # Convert new drivers data to DataFrame
        new_drivers_df = pd.DataFrame(drivers_list)
        
        # Append new data to existing data
        drivers_df = pd.concat([drivers_df, new_drivers_df], ignore_index=True)
        
        # Write updated data back to Excel
        with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            drivers_df.to_excel(writer, sheet_name='Drivers', index=False)
        
        print(f"✓ {len(drivers_list)} driver(s) added to 'Drivers' sheet.")
        
    except Exception as e:
        print(f"\n✗ Error adding driver data: {e}")


def display_excel_preview():
    """
    Displays a preview of the Excel file data in the console.
    """
    if not os.path.exists(EXCEL_FILE):
        print("\n✗ Excel file does not exist.")
        return
    
    print("\n" + "="*60)
    print("EXCEL FILE PREVIEW")
    print("="*60)
    
    try:
        # Read and display Users sheet
        print("\n📄 SHEET 1: Users")
        print("-" * 60)
        users_df = pd.read_excel(EXCEL_FILE, sheet_name='Users')
        print(users_df.to_string(index=False))
        print(f"Total Users: {len(users_df)}")
        
        # Read and display Drivers sheet
        print("\n📄 SHEET 2: Drivers")
        print("-" * 60)
        drivers_df = pd.read_excel(EXCEL_FILE, sheet_name='Drivers')
        print(drivers_df.to_string(index=False))
        print(f"Total Drivers: {len(drivers_df)}")
        
    except Exception as e:
        print(f"\n✗ Error reading Excel file: {e}")


def main():
    """
    Main function that orchestrates the entire data collection process.
    """
    print("\n" + "="*60)
    print("RS&CO TRACKING SYSTEM - DATA COLLECTION TOOL")
    print("="*60)
    print(f"Excel File: {EXCEL_FILE}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Create empty Excel file if it doesn't exist
    create_empty_excel_if_not_exists()
    
    # Collect user data
    user_data = collect_user_data()
    
    # Collect driver data (multiple entries allowed)
    drivers_list = collect_driver_data()
    
    # Append data to Excel
    append_user_to_excel(user_data)
    append_drivers_to_excel(drivers_list)
    
    # Display preview of the updated Excel file
    display_excel_preview()
    
    print("\n" + "="*60)
    print("✓ Data collection completed successfully!")
    print("="*60)
    print(f"\n📁 File location: {os.path.abspath(EXCEL_FILE)}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n✗ Process interrupted by user.")
    except Exception as e:
        print(f"\n✗ An unexpected error occurred: {e}")
