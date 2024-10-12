-- Insert test data

-- Users
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', 'hashed_password', 'admin'),
('user1', 'user1@example.com', 'hashed_password', 'user'),
('user2', 'user2@example.com', 'hashed_password', 'user');

-- Products
INSERT INTO produtos (nome, descricao, preco, estoque, sku) VALUES
('Laptop', 'High-performance laptop', 1200.00, 50, 'LAP001'),
('Smartphone', 'Latest model smartphone', 800.00, 100, 'PHN001'),
('Headphones', 'Noise-cancelling headphones', 150.00, 200, 'AUD001'),
('Tablet', '10-inch tablet', 300.00, 75, 'TAB001'),
('Smart Watch', 'Fitness tracking smart watch', 180.00, 150, 'WCH001');

-- Suppliers
INSERT INTO fornecedores (nome, contato) VALUES
('TechSupply Co.', 'contact@techsupply.com'),
('Gadget Wholesalers', 'sales@gadgetwholesalers.com'),
('ElectroDistributors', 'info@electrodistributors.com');

-- Customers
INSERT INTO clientes (nome, email, telefone) VALUES
('John Doe', 'john.doe@example.com', '555-1234'),
('Jane Smith', 'jane.smith@example.com', '555-5678'),
('Bob Johnson', 'bob.johnson@example.com', '555-9012');

-- Banks
INSERT INTO bancos (nome) VALUES
('Bank of America'),
('Chase'),
('Wells Fargo');

-- Card Brands
INSERT INTO bandeiras_cartao (nome) VALUES
('Visa'),
('Mastercard'),
('American Express');

-- Credit Cards
INSERT INTO cartoes_credito (nome, numero_final, data_expiracao, bandeira_id, banco_id) VALUES
('John Doe Visa', '1234', '2025-12-31', 1, 1),
('Jane Smith Mastercard', '5678', '2024-06-30', 2, 2),
('Bob Johnson Amex', '9012', '2026-03-31', 3, 3);

-- Bank Accounts
INSERT INTO contas_bancarias (nome, numero_conta, tipo_conta, banco_id) VALUES
('John Doe Checking', '12345678', 'corrente', 1),
('Jane Smith Savings', '87654321', 'poupanca', 2),
('Bob Johnson Checking', '56781234', 'corrente', 3);

-- Carriers
INSERT INTO carriers (nome, contato, service_area) VALUES
('FastShip', 'support@fastship.com', 'Domestic'),
('GlobalExpress', 'info@globalexpress.com', 'International'),
('QuickDelivery', 'contact@quickdelivery.com', 'Local');

-- Marketplaces
INSERT INTO marketplaces (nome) VALUES
('Amazon'),
('eBay'),
('Etsy');

-- Purchase Orders
INSERT INTO compras (fornecedor_id, data_compra, total, status_envio, total_cost, transportadora_id) VALUES
(1, CURRENT_DATE - INTERVAL '10 days', 5000.00, 'shipped', 5000.00, 1),
(2, CURRENT_DATE - INTERVAL '5 days', 3000.00, 'processing', 3000.00, 2),
(3, CURRENT_DATE - INTERVAL '2 days', 2000.00, 'pending', 2000.00, 3);

-- Sales Orders
INSERT INTO pedidos (customer_id, data_pedido, status, total, meio_pagamento, cartao_credito_id, transportadora_id, marketplace_id) VALUES
(1, CURRENT_DATE - INTERVAL '7 days', 'delivered', 1350.00, 'credit_card', 1, 1, 1),
(2, CURRENT_DATE - INTERVAL '3 days', 'shipped', 950.00, 'credit_card', 2, 2, 2),
(3, CURRENT_DATE - INTERVAL '1 day', 'processing', 330.00, 'credit_card', 3, 3, 3);

-- Order Items
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 1, 1200.00),
(1, 3, 1, 150.00),
(2, 2, 1, 800.00),
(2, 5, 1, 150.00),
(3, 4, 1, 300.00),
(3, 3, 1, 30.00);

-- Inventory Movements
INSERT INTO inventory_movements (product_id, movement_type, quantity, reference_id, reference_type, notes) VALUES
(1, 'purchase', 10, 1, 'purchase_order', 'Restocking laptops'),
(2, 'sale', -1, 1, 'sales_order', 'Sold to customer'),
(3, 'adjustment', -5, NULL, NULL, 'Inventory count adjustment');

-- Complaints
INSERT INTO complaints (customer_id, order_id, status, category, priority) VALUES
(1, 1, 'Open', 'Product Defect', 'High'),
(2, 2, 'In Progress', 'Late Delivery', 'Medium'),
(3, 3, 'Resolved', 'Wrong Item', 'Low');

-- Marketplace Questions
INSERT INTO marketplace_questions (marketplace_id, product_id, customer_id, question_content, status) VALUES
(1, 1, 1, 'Is this laptop compatible with Linux?', 'Pending'),
(2, 2, 2, 'Does this smartphone come with a charger?', 'Answered'),
(3, 3, 3, 'What is the battery life of these headphones?', 'Pending');