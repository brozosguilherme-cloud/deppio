-- ============================================================
-- ROW LEVEL SECURITY (RLS) — inventory-saas
-- Executa este arquivo no SQL Editor do Supabase Dashboard
-- OU via: supabase db push
-- ============================================================

-- Função helper: retorna o organizationId do usuário logado
-- buscando pela coluna supabase_user_id na tabela users (Prisma)
CREATE OR REPLACE FUNCTION auth.organization_id()
RETURNS TEXT AS $$
  SELECT organization_id
  FROM users
  WHERE supabase_user_id = auth.uid()::text
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─────────────────────────────────────────────────────────────
-- ORGANIZATIONS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_select_own" ON organizations
  FOR SELECT USING (id = auth.organization_id());

CREATE POLICY "org_update_own" ON organizations
  FOR UPDATE USING (id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_org" ON users
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "users_update_self" ON users
  FOR UPDATE USING (supabase_user_id = auth.uid()::text);

-- ─────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_org" ON categories
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- SUPPLIERS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suppliers_org" ON suppliers
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_org" ON products
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- STOCK LOCATIONS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_locations_org" ON stock_locations
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- STOCK MOVEMENTS (imutável — sem UPDATE/DELETE)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_movements_select" ON stock_movements
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "stock_movements_insert" ON stock_movements
  FOR INSERT WITH CHECK (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- CUSTOMERS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers_org" ON customers
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- SALES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_org" ON sales
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- SALE ITEMS (acesso via JOIN com sales)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sale_items_via_sale" ON sale_items
  FOR ALL USING (
    sale_id IN (
      SELECT id FROM sales WHERE organization_id = auth.organization_id()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- PURCHASE ORDERS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_orders_org" ON purchase_orders
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- PURCHASE ORDER ITEMS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchase_order_items_via_po" ON purchase_order_items
  FOR ALL USING (
    purchase_order_id IN (
      SELECT id FROM purchase_orders WHERE organization_id = auth.organization_id()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- RAW MATERIALS (plano Pro)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "raw_materials_org" ON raw_materials
  FOR ALL USING (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- RAW MATERIAL MOVEMENTS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE raw_material_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "raw_material_movements_select" ON raw_material_movements
  FOR SELECT USING (organization_id = auth.organization_id());

CREATE POLICY "raw_material_movements_insert" ON raw_material_movements
  FOR INSERT WITH CHECK (organization_id = auth.organization_id());

-- ─────────────────────────────────────────────────────────────
-- PRODUCT RAW MATERIALS (BOM)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE product_raw_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_raw_materials_via_product" ON product_raw_materials
  FOR ALL USING (
    product_id IN (
      SELECT id FROM products WHERE organization_id = auth.organization_id()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- Permissão para service_role (Prisma server-side) ignorar RLS
-- O Prisma usa DATABASE_URL com service_role key — não afetado
-- O anon key (client-side) segue todas as policies acima
-- ─────────────────────────────────────────────────────────────
