# Phase 2 Setup Guide: Product Management System

## 🚀 Quick Start

### Step 1: Execute Database Setup
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `PHASE_2_PRODUCTS_SETUP.sql`
4. Click "Run" to create all the product tables

### Step 2: Verify Installation
1. Start your development server: `npm run dev`
2. Navigate to `/admin` (make sure you're logged in as admin)
3. Click on "Products" in the sidebar
4. You should see the product management interface

## 📋 What's Included

### ✅ Database Schema
- **product_categories**: Necklaces, Earrings, Bracelets, Rings
- **products**: Main product table with all fields
- **product_images**: Support for multiple product photos
- **product_variants**: Size/color variations
- **product_collections**: Curated product groups
- **product_collection_items**: Collection relationships

### ✅ Admin Interface
- **Product Listing**: Paginated product table with search
- **Create Products**: Full product creation form
- **Statistics**: Real-time product metrics
- **Filtering**: By category, status, search terms
- **Stock Management**: Track inventory levels

### ✅ API Routes
- `GET /api/admin/products` - List products with pagination
- `POST /api/admin/products` - Create new products
- `GET /api/admin/categories` - List product categories
- `POST /api/admin/categories` - Create new categories

## 🎯 Testing the System

### Create Your First Product
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in the form:
   - **Name**: "Wildflower Necklace"
   - **Price**: "89.99"
   - **Category**: Select "Necklaces"
   - **Description**: "Beautiful handcrafted necklace inspired by wildflowers"
   - **Stock Quantity**: "10"
   - Check "Active" and "Featured"
4. Click "Create Product"

### Test Search and Filtering
1. Use the search box to find products
2. Filter by category using the dropdown
3. Filter by status (Active/Inactive)
4. Test pagination if you have many products

## 🔧 Customization Options

### Adding New Categories
The system comes with 4 default categories:
- Necklaces
- Earrings  
- Bracelets
- Rings

To add more categories:
1. Use the admin interface (coming soon)
2. Or add them directly in Supabase:
```sql
INSERT INTO product_categories (name, slug, description) VALUES
('Anklets', 'anklets', 'Delicate anklets for summer vibes'),
('Hair Accessories', 'hair-accessories', 'Beautiful hair pins and clips');
```

### Product Fields Explained
- **Name**: Product title (required)
- **SKU**: Stock Keeping Unit (optional, for inventory)
- **Price**: Base price (required)
- **Compare Price**: Original price for showing discounts
- **Category**: Product category
- **Brand**: Product brand/maker
- **Stock Quantity**: Available inventory
- **Active**: Whether product is visible to customers
- **Featured**: Whether to highlight this product
- **Tags**: JSON array of product tags
- **Materials**: JSON array of materials used
- **Dimensions**: JSON object with size info

## 🚧 What's Coming Next

### Phase 2 Remaining Features:
- [ ] Product editing and deletion
- [ ] Image upload and management
- [ ] Product variants (sizes, colors)
- [ ] Bulk operations (edit multiple products)
- [ ] CSV import/export
- [ ] SEO optimization (meta tags, slugs)

### Phase 3 Preview:
- Shopping cart functionality
- Add to cart buttons
- Cart persistence
- Checkout flow

## 🐛 Troubleshooting

### Products Not Loading?
1. Check browser console for errors
2. Verify you're logged in as admin
3. Check that the database tables were created successfully
4. Ensure your `SUPABASE_SERVICE_ROLE_KEY` is set correctly

### Can't Create Products?
1. Verify admin role in database
2. Check network tab for API errors
3. Ensure all required fields are filled
4. Check Supabase logs for database errors

### Categories Not Showing?
1. Verify the categories table has data
2. Check the API endpoint `/api/admin/categories`
3. Ensure RLS policies allow reading categories

## 📊 Database Structure

```
product_categories
├── id (UUID, Primary Key)
├── name (Text, Unique)
├── slug (Text, Unique)
├── description (Text)
├── image_url (Text)
├── parent_id (UUID, Foreign Key)
├── sort_order (Integer)
├── is_active (Boolean)
├── created_at (Timestamp)
└── updated_at (Timestamp)

products
├── id (UUID, Primary Key)
├── name (Text, Required)
├── slug (Text, Unique)
├── description (Text)
├── short_description (Text)
├── sku (Text, Unique)
├── price (Decimal, Required)
├── compare_price (Decimal)
├── cost_price (Decimal)
├── category_id (UUID, Foreign Key)
├── brand (Text)
├── weight (Decimal)
├── dimensions (JSONB)
├── materials (JSONB)
├── care_instructions (Text)
├── stock_quantity (Integer)
├── track_quantity (Boolean)
├── allow_backorder (Boolean)
├── is_active (Boolean)
├── is_featured (Boolean)
├── meta_title (Text)
├── meta_description (Text)
├── tags (JSONB)
├── created_at (Timestamp)
└── updated_at (Timestamp)
```

## 🎉 Success!

Once you complete the setup, you'll have:
- ✅ Professional product management system
- ✅ Category organization
- ✅ Stock tracking
- ✅ Search and filtering
- ✅ Real-time statistics
- ✅ Mobile-responsive admin interface

Ready to move on to Phase 3: Shopping Cart & Checkout System! 🛒 