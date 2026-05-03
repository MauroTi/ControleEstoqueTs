using ControleEstoque.Api.Models;
using Npgsql;

namespace ControleEstoque.Api.Repositories;

public class ProdutoRepository(IConfiguration configuration)
{
    private readonly string _connectionString =
        configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("Connection string 'DefaultConnection' nao encontrada.");

    public async Task<List<Produto>> ObterTodosAsync()
    {
        var produtos = new List<Produto>();

        const string sql = """
            SELECT id, nome, categoria, quantidade, preco
            FROM produtos
            ORDER BY nome;
            """;

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            produtos.Add(Map(reader));
        }

        return produtos;
    }

    public async Task<int> ContarAsync()
    {
        const string sql = "SELECT COUNT(1) FROM produtos;";

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    public async Task<string> ObterBancoAtualAsync()
    {
        const string sql = "SELECT current_database();";

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        var result = await command.ExecuteScalarAsync();
        return Convert.ToString(result) ?? string.Empty;
    }

    public async Task<Produto?> ObterPorIdAsync(int id)
    {
        const string sql = """
            SELECT id, nome, categoria, quantidade, preco
            FROM produtos
            WHERE id = @id;
            """;

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("id", id);

        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
        {
            return null;
        }

        return Map(reader);
    }

    public async Task<Produto> CriarAsync(Produto produto)
    {
        const string sql = """
            INSERT INTO produtos (nome, categoria, quantidade, preco)
            VALUES (@nome, @categoria, @quantidade, @preco)
            RETURNING id;
            """;

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("nome", produto.Nome);
        command.Parameters.AddWithValue("categoria", produto.Categoria);
        command.Parameters.AddWithValue("quantidade", produto.Quantidade);
        command.Parameters.AddWithValue("preco", produto.Preco);

        produto.Id = Convert.ToInt32(await command.ExecuteScalarAsync());
        return produto;
    }

    public async Task<bool> AtualizarAsync(int id, Produto produto)
    {
        const string sql = """
            UPDATE produtos
            SET nome = @nome,
                categoria = @categoria,
                quantidade = @quantidade,
                preco = @preco
            WHERE id = @id;
            """;

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("id", id);
        command.Parameters.AddWithValue("nome", produto.Nome);
        command.Parameters.AddWithValue("categoria", produto.Categoria);
        command.Parameters.AddWithValue("quantidade", produto.Quantidade);
        command.Parameters.AddWithValue("preco", produto.Preco);

        var rows = await command.ExecuteNonQueryAsync();
        return rows > 0;
    }

    public async Task<bool> RemoverAsync(int id)
    {
        const string sql = "DELETE FROM produtos WHERE id = @id;";

        await using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        await using var command = new NpgsqlCommand(sql, connection);
        command.Parameters.AddWithValue("id", id);

        var rows = await command.ExecuteNonQueryAsync();
        return rows > 0;
    }

    private static Produto Map(NpgsqlDataReader reader)
    {
        return new Produto
        {
            Id = reader.GetInt32(0),
            Nome = reader.GetString(1),
            Categoria = reader.GetString(2),
            Quantidade = reader.GetInt32(3),
            Preco = reader.GetDecimal(4)
        };
    }
}
