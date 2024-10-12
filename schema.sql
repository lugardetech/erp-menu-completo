-- Create a new database
-- Note: You need to run this command separately or create the database manually
-- CREATE DATABASE your_database_name;

-- Connect to the new database
-- \c your_database_name

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Stores user accounts for system access and authentication';

-- Products table
CREATE TABLE products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  image_url TEXT
);

COMMENT ON TABLE products IS 'Contains product information including pricing and inventory levels';

-- Suppliers table
CREATE TABLE suppliers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  contact TEXT
);

COMMENT ON TABLE suppliers IS 'Maintains a list of suppliers and their contact information';

-- Customers table
CREATE TABLE customers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT
);

COMMENT ON TABLE customers IS 'Contains customer information for order processing and communication';

-- Banks table
CREATE TABLE banks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL
);

COMMENT ON TABLE banks IS 'Lists banks used for financial transactions';

-- Card brands table
CREATE TABLE card_brands (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL
);

COMMENT ON TABLE card_brands IS 'Contains a list of credit card brands accepted for payments';

-- Credit cards table
CREATE TABLE credit_cards (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  last_four_digits VARCHAR(4) NOT NULL,
  expiration_date DATE NOT NULL,
  card_brand_id BIGINT REFERENCES card_brands (id),
  bank_id BIGINT REFERENCES banks (id)
);

COMMENT ON TABLE credit_cards IS 'Stores customer credit card information for payment processing';

-- Bank accounts table
CREATE TABLE bank_accounts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_type TEXT NOT NULL,
  bank_id BIGINT REFERENCES banks (id)
);

COMMENT ON TABLE bank_accounts IS 'Contains bank account details for financial transactions';

-- Carriers table
CREATE TABLE carriers (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  contact TEXT,
  service_area TEXT
);

COMMENT ON TABLE carriers IS 'Lists shipping carriers and their service information';

-- Marketplaces table
CREATE TABLE marketplaces (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL
);

COMMENT ON TABLE marketplaces IS 'Stores information about different marketplaces where products are sold';

-- Purchase orders table
CREATE TABLE purchase_orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  supplier_id BIGINT REFERENCES suppliers (id),
  payment_method TEXT,
  credit_card_id BIGINT REFERENCES credit_cards (id),
  bank_account_id BIGINT REFERENCES bank_accounts (id),
  carrier_id BIGINT REFERENCES carriers (id)
);

COMMENT ON TABLE purchase_orders IS 'Records purchase orders placed with suppliers for inventory replenishment';

-- Purchase order items table
CREATE TABLE purchase_order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  purchase_order_id BIGINT REFERENCES purchase_orders (id),
  product_id BIGINT REFERENCES products (id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

COMMENT ON TABLE purchase_order_items IS 'Contains line items for each purchase order';

-- Purchases table
CREATE TABLE purchases (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  supplier_id BIGINT REFERENCES suppliers (id),
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_status TEXT,
  import_taxes NUMERIC(10, 2),
  shipping_cost NUMERIC(10, 2),
  other_costs NUMERIC(10, 2),
  total_cost NUMERIC(10, 2) NOT NULL,
  carrier_id BIGINT REFERENCES carriers (id),
  tracking_code TEXT,
  updated_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE purchases IS 'Records completed purchases from suppliers, including associated costs';

-- Purchase items table
CREATE TABLE purchase_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  purchase_id BIGINT REFERENCES purchases (id),
  product_id BIGINT REFERENCES products (id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

COMMENT ON TABLE purchase_items IS 'Contains line items for each completed purchase';

-- Sales orders table
CREATE TABLE sales_orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id BIGINT REFERENCES customers (id),
  order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT,
  credit_card_id BIGINT REFERENCES credit_cards (id),
  bank_account_id BIGINT REFERENCES bank_accounts (id),
  carrier_id BIGINT REFERENCES carriers (id),
  marketplace_id BIGINT REFERENCES marketplaces (id)
);

COMMENT ON TABLE sales_orders IS 'Records customer orders, including payment and shipping details';

-- Sales order items table
CREATE TABLE sales_order_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sales_order_id BIGINT REFERENCES sales_orders (id),
  product_id BIGINT REFERENCES products (id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL
);

COMMENT ON TABLE sales_order_items IS 'Contains line items for each customer order';

-- Inventory movements table
CREATE TABLE inventory_movements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT REFERENCES products(id),
  movement_type VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  reference_id BIGINT,
  reference_type VARCHAR(20),
  movement_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

COMMENT ON TABLE inventory_movements IS 'Logs all inventory changes for accurate stock tracking';

-- Purchase order tracking table
CREATE TABLE purchase_order_tracking (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  purchase_order_id BIGINT REFERENCES purchase_orders(id),
  status VARCHAR(50) NOT NULL,
  location TEXT,
  update_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery_date DATE,
  notes TEXT
);

COMMENT ON TABLE purchase_order_tracking IS 'Tracks the status and location of incoming purchase orders';

-- Sales order returns table
CREATE TABLE sales_order_returns (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sales_order_id BIGINT REFERENCES sales_orders(id),
  customer_id BIGINT REFERENCES customers(id),
  return_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  refund_amount NUMERIC(10, 2),
  refund_method VARCHAR(50),
  carrier_id BIGINT REFERENCES carriers(id),
  tracking_code VARCHAR(100),
  notes TEXT
);

COMMENT ON TABLE sales_order_returns IS 'Manages customer returns, including reasons and refund details';

-- Sales return items table
CREATE TABLE sales_return_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sales_order_return_id BIGINT REFERENCES sales_order_returns(id),
  product_id BIGINT REFERENCES products(id),
  quantity INT NOT NULL,
  reason TEXT,
  condition VARCHAR(50)
);

COMMENT ON TABLE sales_return_items IS 'Contains line items for each customer return';

-- Sales return tracking table
CREATE TABLE sales_return_tracking (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sales_order_return_id BIGINT REFERENCES sales_order_returns(id),
  status VARCHAR(50) NOT NULL,
  location TEXT,
  update_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery_date DATE,
  notes TEXT
);

COMMENT ON TABLE sales_return_tracking IS 'Tracks the status and location of customer returns';

-- Product profits table
CREATE TABLE product_profits (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id BIGINT REFERENCES products (id),
  sales_order_id BIGINT REFERENCES sales_orders (id),
  cost_price NUMERIC(10, 2) NOT NULL,
  selling_price NUMERIC(10, 2) NOT NULL,
  import_tax NUMERIC(10, 2) DEFAULT 0,
  national_tax NUMERIC(10, 2) DEFAULT 0,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  marketplace_fee NUMERIC(10, 2) DEFAULT 0,
  profit NUMERIC(10, 2) GENERATED ALWAYS AS (
    (
      (
        ((selling_price - cost_price) - import_tax) - national_tax
      ) - shipping_cost
    ) - marketplace_fee
  ) STORED,
  purchase_id BIGINT REFERENCES purchases (id)
);

COMMENT ON TABLE product_profits IS 'Calculates and stores detailed profit information for each product sale';

-- Complaints table
CREATE TABLE complaints (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id BIGINT REFERENCES customers(id),
  order_id BIGINT REFERENCES sales_orders(id),
  complaint_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  category VARCHAR(100),
  priority VARCHAR(20),
  assigned_to BIGINT REFERENCES users(id),
  resolution_date TIMESTAMP WITH TIME ZONE,
  satisfaction_rating INT
);

COMMENT ON TABLE complaints IS 'Manages customer complaints, their status, and resolution';

-- Complaint communications table
CREATE TABLE complaint_communications (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  complaint_id BIGINT REFERENCES complaints(id),
  sender_type VARCHAR(20) NOT NULL,
  sender_id BIGINT,
  message_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  message_content TEXT NOT NULL,
  attachment_url TEXT
);

COMMENT ON TABLE complaint_communications IS 'Records all communications related to customer complaints';

-- Marketplace questions table
CREATE TABLE marketplace_questions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  marketplace_id BIGINT REFERENCES marketplaces(id),
  product_id BIGINT REFERENCES products(id),
  customer_id BIGINT,
  question_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  question_content TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  answered_by BIGINT REFERENCES users(id),
  answer_date TIMESTAMP WITH TIME ZONE,
  answer_content TEXT,
  is_public BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE marketplace_questions IS 'Manages customer questions about products on marketplaces';

-- Indexes
CREATE INDEX idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX idx_inventory_movements_date ON inventory_movements(movement_date);

CREATE INDEX idx_purchase_order_tracking_po ON purchase_order_tracking(purchase_order_id);
CREATE INDEX idx_purchase_order_tracking_status ON purchase_order_tracking(status);
CREATE INDEX idx_purchase_order_tracking_date ON purchase_order_tracking(update_date);

CREATE INDEX idx_sales_order_returns_so ON sales_order_returns(sales_order_id);
CREATE INDEX idx_sales_order_returns_customer ON sales_order_returns(customer_id);
CREATE INDEX idx_sales_order_returns_status ON sales_order_returns(status);

CREATE INDEX idx_sales_return_items_return ON sales_return_items(sales_order_return_id);
CREATE INDEX idx_sales_return_items_product ON sales_return_items(product_id);

CREATE INDEX idx_sales_return_tracking_return ON sales_return_tracking(sales_order_return_id);
CREATE INDEX idx_sales_return_tracking_status ON sales_return_tracking(status);
CREATE INDEX idx_sales_return_tracking_date ON sales_return_tracking(update_date);

CREATE INDEX idx_complaints_customer ON complaints(customer_id);
CREATE INDEX idx_complaints_order ON complaints(order_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_priority ON complaints(priority);

CREATE INDEX idx_complaint_communications_complaint ON complaint_communications(complaint_id);
CREATE INDEX idx_complaint_communications_date ON complaint_communications(message_date);

CREATE INDEX idx_marketplace_questions_marketplace ON marketplace_questions(marketplace_id);
CREATE INDEX idx_marketplace_questions_product ON marketplace_questions(product_id);
CREATE INDEX idx_marketplace_questions_status ON marketplace_questions(status);
CREATE INDEX idx_marketplace_questions_date ON marketplace_questions(question_date);

CREATE INDEX idx_sales_orders_marketplace ON sales_orders(marketplace_id);

-- Views
CREATE OR REPLACE VIEW product_profit_view AS
SELECT
  pp.id,
  pp.product_id,
  pp.sales_order_id,
  pp.cost_price,
  pp.selling_price,
  pp.national_tax,
  pp.shipping_cost,
  pp.marketplace_fee,
  p.import_taxes as import_tax,
  (
    (
      (
        (pp.selling_price - pp.cost_price) - COALESCE(p.import_taxes, 0)
      ) - pp.national_tax
    ) - pp.shipping_cost
  ) - pp.marketplace_fee as profit
FROM
  product_profits pp
  LEFT JOIN purchases p ON pp.purchase_id = p.id;

COMMENT ON VIEW product_profit_view IS 'Provides a comprehensive view of product profitability, including all associated costs';

-- Continuação das Views

CREATE OR REPLACE VIEW complaint_analysis_view AS
SELECT 
    c.id AS complaint_id,
    c.customer_id,
    c.order_id,
    c.complaint_date,
    c.status,
    c.category,
    c.priority,
    c.resolution_date,
    c.satisfaction_rating,
    COUNT(cc.id) AS communication_count,
    MAX(cc.message_date) AS last_communication_date,
    EXTRACT(EPOCH FROM (COALESCE(c.resolution_date, CURRENT_TIMESTAMP) - c.complaint_date)) / 3600 AS resolution_time_hours
FROM 
    complaints c
LEFT JOIN 
    complaint_communications cc ON c.id = cc.complaint_id
GROUP BY 
    c.id;

COMMENT ON VIEW complaint_analysis_view IS 'Provides analytics on complaints, including resolution time and communication frequency';

CREATE OR REPLACE VIEW marketplace_question_analysis_view AS
SELECT 
    mq.id AS question_id,
    mq.marketplace_id,
    m.name AS marketplace_name,
    mq.product_id,
    p.name AS product_name,
    mq.question_date,
    mq.status,
    mq.answer_date,
    EXTRACT(EPOCH FROM (COALESCE(mq.answer_date, CURRENT_TIMESTAMP) - mq.question_date)) / 3600 AS response_time_hours,
    mq.is_public
FROM 
    marketplace_questions mq
JOIN 
    marketplaces m ON mq.marketplace_id = m.id
JOIN 
    products p ON mq.product_id = p.id;

COMMENT ON VIEW marketplace_question_analysis_view IS 'Provides analytics on marketplace questions, including response times and associated product and marketplace information';

-- Functions and Triggers

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET stock = stock + NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_product_stock() IS 'Automatically updates product stock levels when inventory movements occur';

-- Trigger to update product stock on inventory movement
CREATE TRIGGER trigger_update_product_stock
AFTER INSERT ON inventory_movements
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

COMMENT ON TRIGGER trigger_update_product_stock ON inventory_movements IS 'Triggers the update_product_stock function after new inventory movements are inserted';

-- Function to update purchases updated_at timestamp
CREATE OR REPLACE FUNCTION update_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_purchases_updated_at() IS 'Automatically updates the updated_at timestamp when a purchase record is modified';

-- Trigger to update purchases updated_at timestamp
CREATE TRIGGER trigger_update_purchases_updated_at
BEFORE UPDATE ON purchases
FOR EACH ROW
EXECUTE FUNCTION update_purchases_updated_at();

COMMENT ON TRIGGER trigger_update_purchases_updated_at ON purchases IS 'Triggers the update_purchases_updated_at function before purchases are updated';

-- Function to update complaint status
CREATE OR REPLACE FUNCTION update_complaint_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.resolution_date IS NOT NULL AND OLD.resolution_date IS NULL THEN
        NEW.status = 'Resolved';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_complaint_status() IS 'Automatically updates the complaint status to "Resolved" when a resolution date is set';

-- Trigger to update complaint status
CREATE TRIGGER trigger_update_complaint_status
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION update_complaint_status();

COMMENT ON TRIGGER trigger_update_complaint_status ON complaints IS 'Triggers the update_complaint_status function before complaints are updated';

-- Function to update marketplace question status
CREATE OR REPLACE FUNCTION update_marketplace_question_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.answer_content IS NOT NULL AND OLD.answer_content IS NULL THEN
        NEW.status = 'Answered';
        NEW.answer_date = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_marketplace_question_status() IS 'Automatically updates the marketplace question status to "Answered" and sets the answer date when an answer is provided';

-- Trigger to update marketplace question status
CREATE TRIGGER trigger_update_marketplace_question_status
BEFORE UPDATE ON marketplace_questions
FOR EACH ROW
EXECUTE FUNCTION update_marketplace_question_status();

COMMENT ON TRIGGER trigger_update_marketplace_question_status ON marketplace_questions IS 'Triggers the update_marketplace_question_status function before marketplace questions are updated';

-- End of schema