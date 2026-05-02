import type { Produto } from '../models/Produto';

export const validarProduto = (produto: Omit<Produto, 'id'>): string[] => {
  const erros: string[] = [];

  if (!produto.nome.trim()) {
    erros.push('O nome do produto é obrigatório.');
  }

  if (!produto.categoria.trim()) {
    erros.push('A categoria é obrigatória.');
  }

  if (!Number.isFinite(produto.quantidade)) {
    erros.push('A quantidade deve ser um número válido.');
  } else if (produto.quantidade < 0) {
    erros.push('A quantidade não pode ser negativa.');
  }

  if (!Number.isFinite(produto.preco)) {
    erros.push('O preço deve ser um número válido.');
  } else if (produto.preco < 0) {
    erros.push('O preço não pode ser negativo.');
  }

  return erros;
};
