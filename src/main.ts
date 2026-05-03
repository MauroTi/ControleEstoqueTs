import type { Produto } from './models/Produto';
import {
  adicionarProduto,
  atualizarProduto,
  obterProdutos,
  removerProduto
} from './services/ProdutoService';
import {
  limparCamposCadastroInvalidos,
  limparCamposInvalidosEdicao,
  marcarCamposInvalidosCadastro,
  marcarCamposInvalidosEdicao,
  obterDadosCadastro
} from './ui/FormProdutoUI';
import { limparErros, mostrarErros } from './ui/MensagemUI';
import { renderizarProdutosUI } from './ui/ProdutoUI';
import { validarProduto } from './validators/ProdutoValidator';

const modalEditar = document.querySelector<HTMLDivElement>('#modalEditar')!;
const editarId = document.querySelector<HTMLInputElement>('#editarId')!;
const editarNome = document.querySelector<HTMLInputElement>('#editarNome')!;
const editarCategoria = document.querySelector<HTMLInputElement>('#editarCategoria')!;
const editarQuantidade = document.querySelector<HTMLInputElement>('#editarQuantidade')!;
const editarPreco = document.querySelector<HTMLInputElement>('#editarPreco')!;
const btnSalvarEdicao = document.querySelector<HTMLButtonElement>('#btnSalvarEdicao')!;
const btnCancelarEdicao = document.querySelector<HTMLButtonElement>('#btnCancelarEdicao')!;

const form = document.querySelector<HTMLFormElement>('#formProduto')!;
const tabelaProdutos = document.querySelector<HTMLTableSectionElement>('#tabelaProdutos')!;
const valorTotalEstoque = document.querySelector<HTMLHeadingElement>('#valorTotalEstoque')!;
const errosForm = document.querySelector<HTMLDivElement>('#errosForm')!;
const errosModal = document.querySelector<HTMLDivElement>('#errosModal')!;
const itensPorPaginaSelect = document.querySelector<HTMLSelectElement>('#itensPorPagina')!;
const btnPaginaAnterior = document.querySelector<HTMLButtonElement>('#btnPaginaAnterior')!;
const btnProximaPagina = document.querySelector<HTMLButtonElement>('#btnProximaPagina')!;
const infoPaginacao = document.querySelector<HTMLSpanElement>('#infoPaginacao')!;

let produtos: Produto[] = [];
let paginaAtual = 1;
let itensPorPagina = Number(itensPorPaginaSelect.value);

async function init(): Promise<void> {
  produtos = await obterProdutos();
  atualizarTela();
}

init();

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dadosProduto = obterDadosCadastro();

  const erros = validarProduto(dadosProduto);

  if (erros.length > 0) {
    mostrarErros(errosForm, erros);
    marcarCamposInvalidosCadastro(dadosProduto);
    return;
  }

  limparErros(errosForm);
  limparCamposCadastroInvalidos();

  produtos = await adicionarProduto(produtos, dadosProduto);
  paginaAtual = calcularTotalPaginas();
  atualizarTela();

  form.reset();
  limparCamposCadastroInvalidos();
});

tabelaProdutos.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains('btn-editar')) {
    const id = Number(target.dataset.id);
    editarProduto(id);
  }

  if (target.classList.contains('btn-excluir')) {
    const id = Number(target.dataset.id);
    excluirProduto(id);
  }
});

btnSalvarEdicao.addEventListener('click', async () => {
  const id = Number(editarId.value);

  const produto = produtos.find(produto => produto.id === id);

  if (!produto) {
    mostrarErros(errosModal, ['Produto não encontrado.']);
    return;
  }

  const dadosProduto = {
    nome: editarNome.value.trim(),
    categoria: editarCategoria.value.trim(),
    quantidade: Number(editarQuantidade.value),
    preco: Number(editarPreco.value)
  };

  const erros = validarProduto(dadosProduto);

  if (erros.length > 0) {
    mostrarErros(errosModal, erros);
    marcarCamposInvalidosEdicao({
      dadosProduto,
      editarNome,
      editarCategoria,
      editarQuantidade,
      editarPreco
    });
    return;
  }

  limparErros(errosModal);
  limparCamposInvalidosEdicao(editarNome, editarCategoria, editarQuantidade, editarPreco);

  produtos = await atualizarProduto(produtos, id, dadosProduto);
  atualizarTela();

  modalEditar.style.display = 'none';
});

btnCancelarEdicao.addEventListener('click', () => {
  modalEditar.style.display = 'none';
  limparErros(errosModal);
  limparCamposInvalidosEdicao(editarNome, editarCategoria, editarQuantidade, editarPreco);
});

itensPorPaginaSelect.addEventListener('change', () => {
  itensPorPagina = Number(itensPorPaginaSelect.value);
  paginaAtual = 1;
  atualizarTela();
});

btnPaginaAnterior.addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--;
    atualizarTela();
  }
});

btnProximaPagina.addEventListener('click', () => {
  const totalPaginas = calcularTotalPaginas();
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    atualizarTela();
  }
});

function atualizarTela(): void {
  const totalPaginas = calcularTotalPaginas();

  if (paginaAtual > totalPaginas) {
    paginaAtual = totalPaginas;
  }

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const produtosPagina = produtos.slice(inicio, fim);

  renderizarProdutosUI(produtosPagina, tabelaProdutos, valorTotalEstoque);

  infoPaginacao.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
  btnPaginaAnterior.disabled = paginaAtual <= 1;
  btnProximaPagina.disabled = paginaAtual >= totalPaginas;
}

function calcularTotalPaginas(): number {
  return Math.max(1, Math.ceil(produtos.length / itensPorPagina));
}

async function excluirProduto(id: number): Promise<void> {
  produtos = await removerProduto(produtos, id);
  atualizarTela();
}

function editarProduto(id: number): void {
  limparErros(errosModal);
  limparCamposInvalidosEdicao(editarNome, editarCategoria, editarQuantidade, editarPreco);

  const produto = produtos.find(produto => produto.id === id);

  if (!produto) {
    mostrarErros(errosModal, ['Produto não encontrado.']);
    return;
  }

  editarId.value = produto.id.toString();
  editarNome.value = produto.nome;
  editarCategoria.value = produto.categoria;
  editarQuantidade.value = produto.quantidade.toString();
  editarPreco.value = produto.preco.toString();

  modalEditar.style.display = 'flex';
}
