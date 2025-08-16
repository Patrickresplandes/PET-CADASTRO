-- Execute este SQL no painel do Supabase (SQL Editor)
-- para adicionar as colunas necessárias

-- 1. Adicionar coluna block na tabela residents
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'residents' AND column_name = 'block') THEN
        ALTER TABLE residents ADD COLUMN block TEXT;
    END IF;
END $$;

-- 2. Atualizar registros existentes com valor padrão
UPDATE residents SET block = '1' WHERE block IS NULL OR block = '';

-- 3. Tornar a coluna obrigatória
ALTER TABLE residents ALTER COLUMN block SET NOT NULL;

-- 4. Adicionar coluna resident_block na tabela pets
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'pets' AND column_name = 'resident_block') THEN
        ALTER TABLE pets ADD COLUMN resident_block TEXT;
    END IF;
END $$;

-- 5. Atualizar registros existentes de pets
UPDATE pets SET resident_block = '1' WHERE resident_block IS NULL OR resident_block = '';

-- 6. Definir valor padrão para resident_block
ALTER TABLE pets ALTER COLUMN resident_block SET DEFAULT '1';

-- Verificar se as colunas foram criadas
SELECT 'residents' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'residents' AND column_name = 'block'
UNION
SELECT 'pets' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pets' AND column_name = 'resident_block';
