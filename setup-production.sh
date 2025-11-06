#!/bin/bash

# AcadMark Production Setup Script
# This script prepares the database for production deployment

echo "🚀 AcadMark Production Setup"
echo "=============================="
echo ""

# Check if MySQL credentials are provided
if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
    echo "❌ Error: Database credentials not set"
    echo "Please set the following environment variables:"
    echo "  - DB_HOST"
    echo "  - DB_USER"
    echo "  - DB_PASSWORD"
    echo "  - DB_NAME"
    exit 1
fi

echo "✓ Database credentials found"
echo ""

# Import database schema
echo "📦 Setting up database schema..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < database_setup.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully"
else
    echo "❌ Error creating database schema"
    exit 1
fi

echo ""
echo "🎉 Production setup complete!"
echo ""
echo "Next steps:"
echo "1. Login as admin at your deployment URL"
echo "2. Import teacher CSV file"
echo "3. Import student CSV file"
echo "4. Verify teacher-student mappings"
echo "5. Test attendance flow"
echo ""
echo "Default admin credentials:"
echo "  Username: $ADMIN_USER"
echo "  Password: (check your environment variables)"
echo ""
