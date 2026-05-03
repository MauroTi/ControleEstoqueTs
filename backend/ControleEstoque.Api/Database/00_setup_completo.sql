-- Setup completo para PostgreSQL (psql)
-- Exemplo:
-- psql -h localhost -U postgres -d postgres -f 00_setup_completo.sql

SELECT 'CREATE DATABASE controle_estoque_dev'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'controle_estoque_dev')
\gexec

\connect controle_estoque_dev;

CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    quantidade INTEGER NOT NULL,
    preco NUMERIC(12,2) NOT NULL
);

TRUNCATE TABLE produtos RESTART IDENTITY;

INSERT INTO produtos (nome, categoria, quantidade, preco)
SELECT
    format('Produto %s', lpad(gs::text, 3, '0')),
    format('Categoria %s', ((gs - 1) % 10) + 1),
    5 + (gs % 80),
    ROUND((10 + (gs * 1.37))::numeric, 2)
FROM generate_series(1, 100) AS gs;
