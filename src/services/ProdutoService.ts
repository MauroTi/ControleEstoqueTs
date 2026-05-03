import type { Produto } from '../models/Produto';

const API_URL = import.meta.env.DEV
  ? ((import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5140')
  : '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function obterProdutos(): Promise<Produto[]> {
  const response = await fetch(`${API_URL}/api/produtos`);
  return handleResponse<Produto[]>(response);
}

export async function adicionarProduto(
  _produtos: Produto[],
  dadosProduto: Omit<Produto, 'id'>
): Promise<Produto[]> {
  const response = await fetch(`${API_URL}/api/produtos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dadosProduto)
  });

  await handleResponse<Produto>(response);
  return obterProdutos();
}

export async function atualizarProduto(
  _produtos: Produto[],
  id: number,
  dadosProduto: Omit<Produto, 'id'>
): Promise<Produto[]> {
  const response = await fetch(`${API_URL}/api/produtos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...dadosProduto })
  });

  await handleResponse<void>(response);
  return obterProdutos();
}

export async function removerProduto(
  _produtos: Produto[],
  id: number
): Promise<Produto[]> {
  const response = await fetch(`${API_URL}/api/produtos/${id}`, {
    method: 'DELETE'
  });

  await handleResponse<void>(response);
  return obterProdutos();
}
