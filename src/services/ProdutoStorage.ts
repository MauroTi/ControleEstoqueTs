import type { Produto } from '../models/Produto';

const CHAVE_PRODUTOS = 'produtos';

export const salvarProdutos = (produtos: Produto[]): void => {
  localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
};

export const carregarProdutos = (): Produto[] => {
  const dados = localStorage.getItem(CHAVE_PRODUTOS);

  if (!dados) {
    return [];
  }

  try {
    return JSON.parse(dados) as Produto[];
  } catch {
    localStorage.removeItem(CHAVE_PRODUTOS);
    return [];
  }
};