CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INTEGER,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  stock INTEGER NOT NULL,
  sold INTEGER DEFAULT 0,
  is_free_shipping BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert" ON products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON products FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete" ON products FOR DELETE TO anon USING (true);
