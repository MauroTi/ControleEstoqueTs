import type { Produto } from '../models/Produto';
import { marcarCampoInvalido, limparCamposInvalidos } from './CampoUI';

function obterCampoPorId(id: string): HTMLInputElement {
  const campo = document.getElementById(id);

  if (!(campo instanceof HTMLInputElement)) {
    throw new Error(`Campo ${id} não encontrado.`);
  }

  return campo;
}

function obterCamposCadastro(): HTMLInputElement[] {
  return [
    obterCampoPorId('nome'),
    obterCampoPorId('categoria'),
    obterCampoPorId('quantidade'),
    obterCampoPorId('preco')
  ];
}

export function obterDadosCadastro(): Omit<Produto, 'id'> {
  const nome = obterCampoPorId('nome');
  const categoria = obterCampoPorId('categoria');
  const quantidade = obterCampoPorId('quantidade');
  const preco = obterCampoPorId('preco');

  return {
    nome: nome.value.trim(),
    categoria: categoria.value.trim(),
    quantidade: Number(quantidade.value),
    preco: Number(preco.value)
  };
}

export function limparCamposCadastroInvalidos(): void {
  limparCamposInvalidos(obterCamposCadastro());
}

export function marcarCamposInvalidosCadastro(dadosProduto: Omit<Produto, 'id'>): void {
  const [nome, categoria, quantidade, preco] = obterCamposCadastro();

  limparCamposInvalidos([nome, categoria, quantidade, preco]);

  if (!dadosProduto.nome.trim()) {
    marcarCampoInvalido(nome);
  }

  if (!dadosProduto.categoria.trim()) {
    marcarCampoInvalido(categoria);
  }

  if (!Number.isFinite(dadosProduto.quantidade) || dadosProduto.quantidade < 0) {
    marcarCampoInvalido(quantidade);
  }

  if (!Number.isFinite(dadosProduto.preco) || dadosProduto.preco < 0) {
    marcarCampoInvalido(preco);
  }
}

export function limparCamposInvalidosEdicao(...campos: HTMLInputElement[]): void {
  limparCamposInvalidos(campos);
}

interface CamposEdicaoArgs {
  dadosProduto: Omit<Produto, 'id'>;
  editarNome: HTMLInputElement;
  editarCategoria: HTMLInputElement;
  editarQuantidade: HTMLInputElement;
  editarPreco: HTMLInputElement;
}

export function marcarCamposInvalidosEdicao({
  dadosProduto,
  editarNome,
  editarCategoria,
  editarQuantidade,
  editarPreco
}: CamposEdicaoArgs): void {
  limparCamposInvalidosEdicao(editarNome, editarCategoria, editarQuantidade, editarPreco);

  if (!dadosProduto.nome.trim()) {
    marcarCampoInvalido(editarNome);
  }

  if (!dadosProduto.categoria.trim()) {
    marcarCampoInvalido(editarCategoria);
  }

  if (!Number.isFinite(dadosProduto.quantidade) || dadosProduto.quantidade < 0) {
    marcarCampoInvalido(editarQuantidade);
  }

  if (!Number.isFinite(dadosProduto.preco) || dadosProduto.preco < 0) {
    marcarCampoInvalido(editarPreco);
  }
}
