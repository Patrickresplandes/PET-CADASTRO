-- ===================================================================
-- EXECUTE ESTE SQL COMPLETO NO SUPABASE DASHBOARD (SQL EDITOR)
-- Isso vai criar as colunas e corrigir as políticas RLS
-- ===================================================================

-- PASSO 1: Criar colunas que estão faltando
-- ===================================================================

-- 1.1 Adicionar coluna block na tabela residents
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'residents' AND column_name = 'block') THEN
        ALTER TABLE residents ADD COLUMN block TEXT;
        RAISE NOTICE 'Coluna block adicionada na tabela residents';
    ELSE
        RAISE NOTICE 'Coluna block já existe na tabela residents';
    END IF;
END $$;

-- 1.2 Atualizar registros existentes com valor padrão
UPDATE residents SET block = '1' WHERE block IS NULL OR block = '';

-- 1.3 Tornar a coluna obrigatória
ALTER TABLE residents ALTER COLUMN block SET NOT NULL;

-- 1.4 Adicionar coluna resident_block na tabela pets
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pets' AND column_name = 'resident_block') THEN
        ALTER TABLE pets ADD COLUMN resident_block TEXT;
        RAISE NOTICE 'Coluna resident_block adicionada na tabela pets';
    ELSE
        RAISE NOTICE 'Coluna resident_block já existe na tabela pets';
    END IF;
END $$;

-- 1.5 Atualizar registros existentes de pets
UPDATE pets SET resident_block = '1' WHERE resident_block IS NULL OR resident_block = '';

-- 1.6 Definir valor padrão para resident_block
ALTER TABLE pets ALTER COLUMN resident_block SET DEFAULT '1';

-- PASSO 2: Corrigir políticas RLS
-- ===================================================================

-- 2.1 Desabilitar RLS temporariamente
ALTER TABLE residents DISABLE ROW LEVEL SECURITY;
ALTER TABLE pets DISABLE ROW LEVEL SECURITY;

-- 2.2 Remover todas as políticas existentes
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Remove policies for residents table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'residents') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON residents';
    END LOOP;
    
    -- Remove policies for pets table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'pets') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON pets';
    END LOOP;
END $$;

-- 2.3 Garantir permissões completas
GRANT ALL ON residents TO authenticated;
GRANT ALL ON pets TO authenticated;
GRANT SELECT ON residents TO anon;
GRANT SELECT ON pets TO anon;

-- 2.4 Criar políticas simples e funcionais
CREATE POLICY "Allow all operations for authenticated users" ON residents
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON pets
    FOR ALL TO authenticated USING (true);

-- 2.5 Permitir acesso de leitura para usuários anônimos
CREATE POLICY "Allow read for anonymous users" ON residents
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow read for anonymous users" ON pets
    FOR SELECT TO anon USING (true);

-- 2.6 Re-habilitar RLS
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- PASSO 3: Verificar se tudo funcionou
-- ===================================================================

-- 3.1 Verificar colunas criadas
SELECT 
    'residents' as table_name, 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'residents' AND column_name IN ('block', 'name', 'apartment')

UNION ALL

SELECT 
    'pets' as table_name, 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'pets' AND column_name IN ('resident_block', 'name', 'species')
ORDER BY table_name, column_name;

-- 3.2 Verificar políticas criadas
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd,
    roles
FROM pg_policies 
WHERE tablename IN ('residents', 'pets')
ORDER BY tablename, policyname;

-- 3.3 Mostrar contagem de registros
SELECT 'residents' as table_name, COUNT(*) as total_records FROM residents
UNION ALL
SELECT 'pets' as table_name, COUNT(*) as total_records FROM pets;
