import { describe, expect, it } from 'vitest';
import { calcularTotalEstoque, calcularTotalProduto, formatarMoeda } from './ProdutoUtils';

describe('ProdutoUtils', () => {
  it('calcula total de um produto', () => {
    const total = calcularTotalProduto({
      id: 1,
      nome: 'Notebook',
      categoria: 'Eletrônicos',
      quantidade: 2,
      preco: 1500
    });

    expect(total).toBe(3000);
  });

  it('calcula total do estoque', () => {
    const total = calcularTotalEstoque([
      { id: 1, nome: 'Mouse', categoria: 'Periféricos', quantidade: 3, preco: 100 },
      { id: 2, nome: 'Teclado', categoria: 'Periféricos', quantidade: 2, preco: 200 }
    ]);

    expect(total).toBe(700);
  });

  it('formata moeda em pt-BR', () => {
    expect(formatarMoeda(1234.56)).toContain('1.234,56');
  });
});
