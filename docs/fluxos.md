# Fluxos de uso — Ateliê Breda

Permitir desenhar com os dedos e colorir modelos originais em uma experiência offline, com controle adulto das ações de compartilhamento.

## Mapa de telas

| Tela / área | O que a pessoa faz | Referência de implementação |
|---|---|---|
| Início | Escolher desenho livre, catálogo ou galeria. | [Screens.tsx](../src/presentation/Screens.tsx) |
| Catálogo | Selecionar um dos doze modelos vetoriais. | [Screens.tsx](../src/presentation/Screens.tsx) |
| Estúdio | Desenhar, preencher, carimbar e desfazer. | [StudioScreen.tsx](../src/presentation/StudioScreen.tsx) |
| Galeria | Salvar e reabrir criações locais. | [Screens.tsx](../src/presentation/Screens.tsx) |
| Responsáveis | Gerenciar galeria, preferências e autorização de exportação. | [RouteScreens.tsx](../src/presentation/RouteScreens.tsx) |

## Demonstração guiada

Use dados fictícios, em ambiente de avaliação.

1. Abra um desenho livre e experimente pincéis e espessuras.
2. Desfaça e refaça um traço; limpe e desfaça a limpeza.
3. Salve a criação, feche e reabra pela galeria.
4. Escolha um modelo do catálogo e preencha regiões.
5. Solicite exportação, passe pela barreira de responsáveis e compartilhe o PNG.

## Casos que merecem atenção

- Falha ao ler uma galeria existente não pode sobrescrevê-la vazia.
- Ao atingir limites, preservar criações e informar o responsável.
- URL direta para a área adulta não concede autorização.

## Escopo e resultado esperado

Sem backend ou autenticação. Compra única na loja é proposta de monetização; não há cobrança ativa/IAP. Evidências Playwright são da versão web, não de gestos nativos. Build iOS disponível para simulador; não instala em iPhone físico.

## Checklist para validação do proprietário

- [ ] Instalar/abrir a versão correspondente às evidências.
- [ ] Percorrer a jornada principal e uma condição de falha.
- [ ] Confirmar navegação, retorno, teclado e leitura em tela pequena.
- [ ] Fechar/reabrir e verificar os dados que devem persistir.
- [ ] Avaliar os recursos nativos pertinentes no aparelho real.
- [ ] Registrar versão, aparelho, resultado esperado e observado em eventual relato.

[Voltar ao README](../README.md) · [Evidências](evidencias.md)
