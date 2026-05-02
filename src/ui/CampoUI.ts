export function marcarCampoInvalido(campo: HTMLInputElement): void {
    campo.classList.add('campo-invalido');
}

export function limparCampoInvalido(campo: HTMLInputElement): void {
    campo.classList.remove('campo-invalido');
}

export function limparCamposInvalidos(campos: HTMLInputElement[]): void {
    campos.forEach(campo => limparCampoInvalido(campo));
}