export function mostrarErros(elemento: HTMLElement, erros: string[]): void {
  elemento.innerHTML = erros.map(erro => `<p>${erro}</p>`).join('');
}

export function limparErros(elemento: HTMLElement): void {
  elemento.innerHTML = '';
}