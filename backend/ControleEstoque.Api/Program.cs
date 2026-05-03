using ControleEstoque.Api.Database;
using ControleEstoque.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ProdutoRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

var connectionString = app.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' nao encontrada.");

try
{
    await DatabaseBootstrapper.EnsureCreatedAndSeedAsync(connectionString);
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "Falha ao executar seed inicial.");
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("frontend");

app.MapControllers();

app.MapGet("/api/diagnostico", async (ProdutoRepository repo) =>
{
    var database = await repo.ObterBancoAtualAsync();
    var total = await repo.ContarAsync();
    return Results.Ok(new { database, total });
});

app.MapPost("/api/seed-100", async () =>
{
    try
    {
        var result = await DatabaseBootstrapper.SeedToMinimumAsync(connectionString, 100);
        return Results.Ok(new
        {
            message = "Seed executado",
            result.CountBefore,
            result.Inserted,
            result.CountAfter
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Erro ao executar seed: {ex.Message}");
    }
});

app.MapFallbackToFile("index.html");

app.Run();
