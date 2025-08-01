-- Create order_status_history table for tracking order status changes
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at);

-- Enable RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Create policies for order_status_history
CREATE POLICY "Users can view their own order status history" ON order_status_history
    FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE user_id = auth.uid() 
            OR customer_email = auth.email()
        )
    );

-- Admin can view all order status history
CREATE POLICY "Admins can view all order status history" ON order_status_history
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- System can insert order status history (for webhooks)
CREATE POLICY "Allow insert for order status history" ON order_status_history
    FOR INSERT
    WITH CHECK (true);