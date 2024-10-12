-- Existing content
-- Modify the is_admin function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE id = (auth.uid())::text::bigint AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modify policies to cast auth.uid() to bigint
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING ((auth.uid())::text::bigint = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING ((auth.uid())::text::bigint = id);

CREATE POLICY "Users can view their own credit cards" ON credit_cards
  FOR SELECT USING ((auth.uid())::text::bigint = user_id);

CREATE POLICY "Users can insert and update their own credit cards" ON credit_cards
  FOR INSERT WITH CHECK ((auth.uid())::text::bigint = user_id);

CREATE POLICY "Users can update their own credit cards" ON credit_cards
  FOR UPDATE USING ((auth.uid())::text::bigint = user_id);

CREATE POLICY "Users can view their own bank accounts" ON bank_accounts
  FOR SELECT USING ((auth.uid())::text::bigint = user_id);

CREATE POLICY "Users can insert and update their own bank accounts" ON bank_accounts
  FOR INSERT WITH CHECK ((auth.uid())::text::bigint = user_id);

CREATE POLICY "Users can update their own bank accounts" ON bank_accounts
  FOR UPDATE USING ((auth.uid())::text::bigint = user_id);

-- Update the log_data_changes function
CREATE OR REPLACE FUNCTION log_data_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, action, user_id, old_data, new_data)
  VALUES (TG_TABLE_NAME, TG_OP, (auth.uid())::text::bigint, row_to_json(OLD), row_to_json(NEW));
  RETURN NEW;
end;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the audit_log_view
CREATE OR REPLACE VIEW audit_log_view AS
SELECT al.*, u.email as user_email
FROM audit_log al
LEFT JOIN users u ON al.user_id = u.id;

-- Note: Ensure that the audit_log table uses bigint for user_id

-- New policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_order_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_return_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_profits ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_questions ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Authenticated users can view products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE TO authenticated USING (true);

-- Suppliers policies
CREATE POLICY "Authenticated users can view suppliers" ON suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert suppliers" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update suppliers" ON suppliers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete suppliers" ON suppliers FOR DELETE TO authenticated USING (true);

-- Customers policies
CREATE POLICY "Authenticated users can view customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers" ON customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete customers" ON customers FOR DELETE TO authenticated USING (true);

-- Banks policies
CREATE POLICY "Authenticated users can view banks" ON banks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert banks" ON banks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update banks" ON banks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete banks" ON banks FOR DELETE TO authenticated USING (true);

-- Card brands policies
CREATE POLICY "Authenticated users can view card brands" ON card_brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert card brands" ON card_brands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update card brands" ON card_brands FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete card brands" ON card_brands FOR DELETE TO authenticated USING (true);

-- Carriers policies
CREATE POLICY "Authenticated users can view carriers" ON carriers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert carriers" ON carriers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update carriers" ON carriers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete carriers" ON carriers FOR DELETE TO authenticated USING (true);

-- Marketplaces policies
CREATE POLICY "Authenticated users can view marketplaces" ON marketplaces FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert marketplaces" ON marketplaces FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update marketplaces" ON marketplaces FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete marketplaces" ON marketplaces FOR DELETE TO authenticated USING (true);

-- Purchase orders policies
CREATE POLICY "Authenticated users can view purchase orders" ON purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchase orders" ON purchase_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchase orders" ON purchase_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchase orders" ON purchase_orders FOR DELETE TO authenticated USING (true);

-- Purchase order items policies
CREATE POLICY "Authenticated users can view purchase order items" ON purchase_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchase order items" ON purchase_order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchase order items" ON purchase_order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchase order items" ON purchase_order_items FOR DELETE TO authenticated USING (true);

-- Purchases policies
CREATE POLICY "Authenticated users can view purchases" ON purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchases" ON purchases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchases" ON purchases FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchases" ON purchases FOR DELETE TO authenticated USING (true);

-- Purchase items policies
CREATE POLICY "Authenticated users can view purchase items" ON purchase_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchase items" ON purchase_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchase items" ON purchase_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchase items" ON purchase_items FOR DELETE TO authenticated USING (true);

-- Sales orders policies
CREATE POLICY "Authenticated users can view sales orders" ON sales_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales orders" ON sales_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales orders" ON sales_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sales orders" ON sales_orders FOR DELETE TO authenticated USING (true);

-- Sales order items policies
CREATE POLICY "Authenticated users can view sales order items" ON sales_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales order items" ON sales_order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales order items" ON sales_order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sales order items" ON sales_order_items FOR DELETE TO authenticated USING (true);

-- Inventory movements policies
CREATE POLICY "Authenticated users can view inventory movements" ON inventory_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert inventory movements" ON inventory_movements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update inventory movements" ON inventory_movements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete inventory movements" ON inventory_movements FOR DELETE TO authenticated USING (true);

-- Purchase order tracking policies
CREATE POLICY "Authenticated users can view purchase order tracking" ON purchase_order_tracking FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert purchase order tracking" ON purchase_order_tracking FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update purchase order tracking" ON purchase_order_tracking FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete purchase order tracking" ON purchase_order_tracking FOR DELETE TO authenticated USING (true);

-- Sales order returns policies
CREATE POLICY "Authenticated users can view sales order returns" ON sales_order_returns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales order returns" ON sales_order_returns FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales order returns" ON sales_order_returns FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sales order returns" ON sales_order_returns FOR DELETE TO authenticated USING (true);

-- Sales return items policies
CREATE POLICY "Authenticated users can view sales return items" ON sales_return_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales return items" ON sales_return_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales return items" ON sales_return_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sales return items" ON sales_return_items FOR DELETE TO authenticated USING (true);

-- Sales return tracking policies
CREATE POLICY "Authenticated users can view sales return tracking" ON sales_return_tracking FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert sales return tracking" ON sales_return_tracking FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales return tracking" ON sales_return_tracking FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sales return tracking" ON sales_return_tracking FOR DELETE TO authenticated USING (true);

-- Product profits policies
CREATE POLICY "Authenticated users can view product profits" ON product_profits FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert product profits" ON product_profits FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update product profits" ON product_profits FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete product profits" ON product_profits FOR DELETE TO authenticated USING (true);

-- Complaints policies
CREATE POLICY "Authenticated users can view complaints" ON complaints FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert complaints" ON complaints FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update complaints" ON complaints FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete complaints" ON complaints FOR DELETE TO authenticated USING (true);

-- Complaint communications policies
CREATE POLICY "Authenticated users can view complaint communications" ON complaint_communications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert complaint communications" ON complaint_communications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update complaint communications" ON complaint_communications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete complaint communications" ON complaint_communications FOR DELETE TO authenticated USING (true);

-- Marketplace questions policies
CREATE POLICY "Authenticated users can view marketplace questions" ON marketplace_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert marketplace questions" ON marketplace_questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update marketplace questions" ON marketplace_questions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete marketplace questions" ON marketplace_questions FOR DELETE TO authenticated USING (true);
