using Npgsql;

namespace ControleEstoque.Api.Database;

public static class DatabaseBootstrapper
{
    public static Task<SeedResult> EnsureCreatedAndSeedAsync(string connectionString)
    {
        return SeedToMinimumAsync(connectionString, 100);
    }

    public static async Task<SeedResult> SeedToMinimumAsync(string connectionString, int minimum)
    {
        await using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();

        const string createTableSql = """
            CREATE TABLE IF NOT EXISTS produtos (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(120) NOT NULL,
                categoria VARCHAR(80) NOT NULL,
                quantidade INTEGER NOT NULL,
                preco NUMERIC(12,2) NOT NULL
            );
            """;

        await using (var createCmd = new NpgsqlCommand(createTableSql, connection))
        {
            await createCmd.ExecuteNonQueryAsync();
        }

        const string countSql = "SELECT COUNT(1) FROM produtos;";
        int countBefore;
        await using (var countCmd = new NpgsqlCommand(countSql, connection))
        {
            countBefore = Convert.ToInt32(await countCmd.ExecuteScalarAsync() ?? 0);
        }

        if (countBefore >= minimum)
        {
            return new SeedResult(countBefore, 0, countBefore);
        }

        await using var tx = await connection.BeginTransactionAsync();

        const string insertSql = """
            INSERT INTO produtos (nome, categoria, quantidade, preco)
            VALUES (@nome, @categoria, @quantidade, @preco);
            """;

        var inserts = minimum - countBefore;

        for (var i = 1; i <= inserts; i++)
        {
            var sequencia = countBefore + i;

            await using var insertCmd = new NpgsqlCommand(insertSql, connection, tx);
            insertCmd.Parameters.AddWithValue("nome", $"Produto {sequencia:000}");
            insertCmd.Parameters.AddWithValue("categoria", $"Categoria {((sequencia - 1) % 10) + 1}");
            insertCmd.Parameters.AddWithValue("quantidade", 5 + (sequencia % 80));
            insertCmd.Parameters.AddWithValue("preco", Math.Round(10m + (sequencia * 1.37m), 2));

            await insertCmd.ExecuteNonQueryAsync();
        }

        await tx.CommitAsync();

        var countAfter = countBefore + inserts;
        return new SeedResult(countBefore, inserts, countAfter);
    }
}

public record SeedResult(int CountBefore, int Inserted, int CountAfter);
