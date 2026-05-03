using ControleEstoque.Api.Models;
using ControleEstoque.Api.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ControleEstoque.Api.Controllers;

[ApiController]
[Route("api/produtos")]
public class ProdutosApiController(ProdutoRepository repository) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Produto>>> GetAll()
    {
        return Ok(await repository.ObterTodosAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Produto>> GetById(int id)
    {
        var produto = await repository.ObterPorIdAsync(id);
        return produto is null ? NotFound() : Ok(produto);
    }

    [HttpPost]
    public async Task<ActionResult<Produto>> Create([FromBody] Produto produto)
    {
        var novo = await repository.CriarAsync(produto);
        return Created($"/api/produtos/{novo.Id}", novo);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Produto produto)
    {
        var atualizado = await repository.AtualizarAsync(id, produto);
        return atualizado ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var removido = await repository.RemoverAsync(id);
        return removido ? NoContent() : NotFound();
    }
}
