# Ateliê Breda

**Desenho e pintura infantil com galeria local, ferramentas criativas e área de responsáveis.**

Projeto de **Bruno Breda · breda_dev**. Permitir desenhar com os dedos e colorir modelos originais em uma experiência offline, com controle adulto das ações de compartilhamento.

**Plataforma:** React Native · Expo SDK 57 · TypeScript · Android/iOS  
**Estado:** implementação de portfólio em evolução; esteira aprovada na execução referenciada.

[Fluxos e demonstração](docs/fluxos.md) · [Engenharia](docs/engenharia.md) · [Builds e evidências](docs/evidencias.md) · [Portfólio completo](https://github.com/brunobredadeveloper/breda-park-wash/blob/main/docs/portfolio-breda-dev.md)

## O que você pode avaliar

- Desenho livre, quatro ferramentas, nove cores, três espessuras e quatro papéis.
- Doze ilustrações vetoriais próprias com preenchimento por regiões e carimbos.
- Desfazer/refazer, rascunho automático e galeria local com reabertura.
- Área de responsáveis, movimento reduzido e exportação PNG pelo sistema.

## Experiência e navegação

Veja o [mapa das telas e o roteiro de avaliação](docs/fluxos.md). Esta revisão não adiciona capturas sem origem verificável; imagens conceituais não são apresentadas como telas do aplicativo.

## Fluxo principal

1. Abra um desenho livre e experimente pincéis e espessuras.
2. Desfaça e refaça um traço; limpe e desfaça a limpeza.
3. Salve a criação, feche e reabra pela galeria.
4. Escolha um modelo do catálogo e preencha regiões.
5. Solicite exportação, passe pela barreira de responsáveis e compartilhe o PNG.

## Executar e validar

Node 24 e npm, conforme lockfile. Android 7+; iOS 16.4+. Confira os requisitos nativos e EAS na referência técnica.

```sh
npm ci
npm run check
npx expo start
# Validação de interface web:
npx expo export --platform web
npm run test:ui
```

Configuração, Firebase quando aplicável, assinatura e comandos adicionais: [referência técnica](docs/referencia-tecnica.md).

[Abrir a execução verificada no GitHub Actions](https://github.com/brunobredadeveloper/atelie-breda/actions/runs/38277398538). A conclusão dessa execução é **success**; consulte os artefatos e a revisão de código em [evidências](docs/evidencias.md).

## Limites do produto

Sem backend ou autenticação. Compra única na loja é proposta de monetização; não há cobrança ativa/IAP. Evidências Playwright são da versão web, não de gestos nativos. Build iOS disponível para simulador; não instala em iPhone físico.

## Para quem revisa o portfólio

Famílias e equipes que avaliam produtos React Native para Android e iOS. As [decisões de engenharia](docs/engenharia.md) conectam responsabilidades, arquivos e testes. O [roteiro funcional](docs/fluxos.md) ajuda a avaliar comportamento, falhas e preservação de dados. Funcionalidade planejada não é apresentada como implementada.

## Próximos passos

- Validar os percursos no dispositivo real e registrar os resultados.
- Revisar acessibilidade, interrupções e falhas de armazenamento/rede aplicáveis.
- Concluir requisitos de distribuição, suporte e segurança antes de uso comercial.

Código, mídias e dependências mantêm seus respectivos termos. Consulte os créditos e os avisos existentes no repositório.
