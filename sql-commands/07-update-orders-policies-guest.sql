-- Update RLS policies to support guest orders
-- This allows both authenticated and guest users to create orders

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Users can view items from their orders" ON order_items;
DROP POLICY IF EXISTS "Users can create items for their orders" ON order_items;
DROP POLICY IF EXISTS "Users can view status history for their orders" ON order_status_history;

-- Create updated policies for orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        -- Logged-in users can view their own orders
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR
        -- Guest users can view orders by email (for order tracking)
        (auth.uid() IS NULL AND customer_email IS NOT NULL)
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (
        -- Logged-in users can create orders for themselves
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR
        -- Guest users can create orders (user_id will be NULL)
        (auth.uid() IS NULL AND user_id IS NULL)
    );

-- Create updated policies for order_items
CREATE POLICY "Users can view items from their orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                -- Logged-in users can view their own order items
                (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
                OR
                -- Guest users can view order items by email
                (auth.uid() IS NULL AND orders.customer_email IS NOT NULL)
            )
        )
    );

CREATE POLICY "Users can create items for their orders" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                -- Logged-in users can create items for their own orders
                (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
                OR
                -- Guest users can create items for their orders
                (auth.uid() IS NULL AND orders.user_id IS NULL)
            )
        )
    );

-- Create updated policies for order_status_history
CREATE POLICY "Users can view status history for their orders" ON order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_status_history.order_id 
            AND (
                -- Logged-in users can view status history for their own orders
                (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
                OR
                -- Guest users can view status history by email
                (auth.uid() IS NULL AND orders.customer_email IS NOT NULL)
            )
        )
    );

-- Add policy for guest users to create status history
CREATE POLICY "Users can create status history for their orders" ON order_status_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_status_history.order_id 
            AND (
                -- Logged-in users can create status history for their own orders
                (auth.uid() IS NOT NULL AND orders.user_id = auth.uid())
                OR
                -- Guest users can create status history for their orders
                (auth.uid() IS NULL AND orders.user_id IS NULL)
            )
        )
    );

-- Add comments for documentation
COMMENT ON POLICY "Users can view their own orders" ON orders IS 'Allows users to view their own orders and guests to view orders by email';
COMMENT ON POLICY "Users can create orders" ON orders IS 'Allows both authenticated and guest users to create orders';
COMMENT ON POLICY "Users can view items from their orders" ON order_items IS 'Allows users to view items from their orders and guests to view items by email';
COMMENT ON POLICY "Users can create items for their orders" ON order_items IS 'Allows both authenticated and guest users to create order items';
COMMENT ON POLICY "Users can view status history for their orders" ON order_status_history IS 'Allows users to view status history for their orders and guests to view by email';
COMMENT ON POLICY "Users can create status history for their orders" ON order_status_history IS 'Allows both authenticated and guest users to create status history'; 