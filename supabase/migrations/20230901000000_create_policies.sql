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