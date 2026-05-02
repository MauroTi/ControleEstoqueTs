import type { Produto } from '../models/Produto';
import {
  calcularTotalEstoque,
  calcularTotalProduto,
  formatarMoeda
} from '../utils/ProdutoUtils';

export function renderizarProdutosUI(
  produtos: Produto[],
  tabela: HTMLTableSectionElement,
  totalElemento: HTMLElement
): void {
  tabela.innerHTML = '';

  produtos.forEach((produto) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td>${formatarMoeda(produto.preco)}</td>
      <td>${formatarMoeda(calcularTotalProduto(produto))}</td>
      <td>
        <div class="acoes">
          <button class="btn-editar" data-id="${produto.id}">Editar</button>
          <button class="btn-excluir" data-id="${produto.id}">Excluir</button>
        </div>
      </td>
    `;

    tabela.appendChild(tr);
  });

  const total = calcularTotalEstoque(produtos);
  totalElemento.textContent = `Total em estoque: ${formatarMoeda(total)}`;
}