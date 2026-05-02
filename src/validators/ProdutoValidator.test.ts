import { describe, expect, it } from 'vitest';
import { validarProduto } from './ProdutoValidator';

describe('ProdutoValidator', () => {
  it('retorna erros para campos obrigatórios vazios', () => {
    const erros = validarProduto({
      nome: '',
      categoria: '',
      quantidade: 1,
      preco: 1
    });

    expect(erros).toContain('O nome do produto é obrigatório.');
    expect(erros).toContain('A categoria é obrigatória.');
  });

  it('retorna erro para quantidade e preço negativos', () => {
    const erros = validarProduto({
      nome: 'Produto',
      categoria: 'Categoria',
      quantidade: -1,
      preco: -5
    });

    expect(erros).toContain('A quantidade não pode ser negativa.');
    expect(erros).toContain('O preço não pode ser negativo.');
  });

  it('retorna erro para quantidade e preço inválidos', () => {
    const erros = validarProduto({
      nome: 'Produto',
      categoria: 'Categoria',
      quantidade: Number.NaN,
      preco: Number.NaN
    });

    expect(erros).toContain('A quantidade deve ser um número válido.');
    expect(erros).toContain('O preço deve ser um número válido.');
  });

  it('não retorna erros para produto válido', () => {
    const erros = validarProduto({
      nome: 'Produto',
      categoria: 'Categoria',
      quantidade: 10,
      preco: 12.5
    });

    expect(erros).toEqual([]);
  });
});
