# Engenharia — Ateliê Breda

## Problema técnico

Permitir desenhar com os dedos e colorir modelos originais em uma experiência offline, com controle adulto das ações de compartilhamento.

## Responsabilidades e código

| Fronteira | Responsabilidade real | Onde inspecionar |
|---|---|---|
| Domínio | Entidades de desenho, catálogo e contratos | [src/domain](../src/domain) |
| Aplicação | StudioViewModel e histórico limitado | [src/application](../src/application) |
| Infraestrutura | Adapters AsyncStorage | [src/infrastructure](../src/infrastructure) |
| Apresentação | React Native, SVG e Expo Router | [src/presentation](../src/presentation) |

## Invariantes e decisões

- Falha ao ler uma galeria existente não pode sobrescrevê-la vazia.
- Ao atingir limites, preservar criações e informar o responsável.
- URL direta para a área adulta não concede autorização.

## Como examinar os testes

Os arquivos abaixo fazem parte do código versionado. A existência de uma suíte não comprova sua aprovação; o resultado remoto está em [evidências](evidencias.md).

- [tests/storage-failure.test.ts](../tests/storage-failure.test.ts)
- [tests/studio.test.ts](../tests/studio.test.ts)

## Limites e compromissos

Sem backend ou autenticação. Compra única na loja é proposta de monetização; não há cobrança ativa/IAP. Evidências Playwright são da versão web, não de gestos nativos. Build iOS disponível para simulador; não instala em iPhone físico.

A separação de responsabilidades documentada é a encontrada no código. Não se afirma certificação SOLID, paridade com produtos comerciais, auditoria de segurança ou operação em produção.

## Reproduzir a validação

```sh
npm ci
npm run check
npx expo start
# Validação de interface web:
npx expo export --platform web
npm run test:ui
```

[Voltar ao README](../README.md) · [Fluxos](fluxos.md)
