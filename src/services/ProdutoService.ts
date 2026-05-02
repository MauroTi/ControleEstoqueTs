import type { Produto } from '../models/Produto';
import { carregarProdutos, salvarProdutos } from './ProdutoStorage';

export async function obterProdutos(): Promise<Produto[]> {
    return carregarProdutos();
}

export async function adicionarProduto(
    produtos: Produto[],
    dadosProduto: Omit<Produto, 'id'>
): Promise<Produto[]> {
    const novoProduto: Produto = {
        id: Date.now(),
        ...dadosProduto
    };

    const produtosAtualizados = [...produtos, novoProduto];

    salvarProdutos(produtosAtualizados);

    return produtosAtualizados;
}

export async function atualizarProduto(
    produtos: Produto[],
    id: number,
    dadosProduto: Omit<Produto, 'id'>
): Promise<Produto[]> {
    const produtosAtualizados = produtos.map(produto => {
        if (produto.id !== id) {
            return produto;
        }

        return {
            ...produto,
            ...dadosProduto
        };
    });

    salvarProdutos(produtosAtualizados);

    return produtosAtualizados;
}

export async function removerProduto(
    produtos: Produto[],
    id: number
): Promise<Produto[]> {
    const produtosAtualizados = produtos.filter(produto => produto.id !== id);

    salvarProdutos(produtosAtualizados);

    return produtosAtualizados;
}