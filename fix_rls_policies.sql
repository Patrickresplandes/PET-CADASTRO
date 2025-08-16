-- Execute este SQL no Supabase SQL Editor para corrigir as políticas RLS

-- 1. Desabilitar RLS temporariamente
ALTER TABLE residents DISABLE ROW LEVEL SECURITY;
ALTER TABLE pets DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON residents;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON residents;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON residents;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON residents;
DROP POLICY IF EXISTS "Users can insert their own resident data" ON residents;
DROP POLICY IF EXISTS "Users can read their own resident data" ON residents;
DROP POLICY IF EXISTS "Anyone can read all residents for directory" ON residents;
DROP POLICY IF EXISTS "Anyone can insert residents" ON residents;
DROP POLICY IF EXISTS "Anyone can read residents" ON residents;

DROP POLICY IF EXISTS "Enable read access for all users" ON pets;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON pets;
DROP POLICY IF EXISTS "Enable update for users based on resident ownership" ON pets;
DROP POLICY IF EXISTS "Enable delete for users based on resident ownership" ON pets;
DROP POLICY IF EXISTS "Users can insert pets for their residents" ON pets;
DROP POLICY IF EXISTS "Anyone can read all pets for directory" ON pets;
DROP POLICY IF EXISTS "Users can read their own pets" ON pets;
DROP POLICY IF EXISTS "Anyone can insert pets" ON pets;
DROP POLICY IF EXISTS "Anyone can read pets" ON pets;

-- 3. Garantir permissões completas para usuários autenticados
GRANT ALL ON residents TO authenticated;
GRANT ALL ON pets TO authenticated;

-- 4. Garantir permissões de leitura para usuários anônimos (para galeria pública)
GRANT SELECT ON residents TO anon;
GRANT SELECT ON pets TO anon;

-- 5. Criar políticas simples e funcionais
CREATE POLICY "Allow all for authenticated users" ON residents
    FOR ALL USING (true);

CREATE POLICY "Allow all for authenticated users" ON pets
    FOR ALL USING (true);

-- 6. Permitir acesso de leitura para usuários anônimos
CREATE POLICY "Allow read for anonymous users" ON residents
    FOR SELECT USING (true);

CREATE POLICY "Allow read for anonymous users" ON pets
    FOR SELECT USING (true);

-- 7. Re-habilitar RLS
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('residents', 'pets');
