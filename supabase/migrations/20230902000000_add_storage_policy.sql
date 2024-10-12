-- Habilita RLS para a tabela de produtos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserções de usuários autenticados
CREATE POLICY "Permitir inserções de produtos por usuários autenticados" ON products
FOR INSERT TO authenticated
WITH CHECK (true);

-- Política para permitir leitura de produtos por usuários autenticados
CREATE POLICY "Permitir leitura de produtos por usuários autenticados" ON products
FOR SELECT TO authenticated
USING (true);

-- Política para permitir atualizações de produtos por usuários autenticados
CREATE POLICY "Permitir atualizações de produtos por usuários autenticados" ON products
FOR UPDATE TO authenticated
USING (true);

-- Política para permitir exclusões de produtos por usuários autenticados
CREATE POLICY "Permitir exclusões de produtos por usuários autenticados" ON products
FOR DELETE TO authenticated
USING (true);

-- Nota: As políticas acima permitem que qualquer usuário autenticado realize operações CRUD na tabela de produtos.
-- Se você precisar de controles mais granulares, ajuste as condições 'WITH CHECK' e 'USING' conforme necessário.
