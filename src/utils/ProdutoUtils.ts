import type { Produto } from '../models/Produto';

export const calcularTotalProduto = (produto: Produto): number => {
  return produto.quantidade * produto.preco;
};

export const calcularTotalEstoque = (produtos: Produto[]): number => {
  return produtos.reduce((soma, produto) => {
    return soma + calcularTotalProduto(produto);
  }, 0);
};

export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};