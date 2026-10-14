# Evidências e distribuição — Ateliê Breda

Consulta realizada em **14/10/2026**. Esta página separa o que existe no código, o que foi executado e o que ainda precisa de validação física.

## Execução consultada

- [GitHub Actions #38277398538](https://github.com/brunobredadeveloper/atelie-breda/actions/runs/38277398538)
- Revisão executada: `d086331371996b8aa5f653d381b54a39e2326184`.
- Workflow: **Atelie Breda checks and Android APK**.
- Conclusão retornada pelo GitHub: **success**.

Alterações documentais posteriores não equivalem a uma nova compilação do aplicativo.

## Artefatos encontrados

- `atelie-breda-android-apk` — ID `11760715378`; disponível na consulta; sujeito à expiração pelo GitHub.
- `atelie-breda-ios-simulator` — ID `11760598690`; disponível na consulta; sujeito à expiração pelo GitHub.

Para baixar: abra a execução, vá a **Artifacts**, baixe o ZIP e extraia o conteúdo. O GitHub pode exigir login. APK é para Android; bundle JavaScript, relatório e ZIP de fontes não são instaladores. Builds iOS de simulador ou sem assinatura não instalam diretamente no iPhone.

## Capturas

Nenhuma captura foi incorporada nesta rodada: não havia imagem verificada disponível no conjunto consultado. Os fluxos estão documentados sem substituir evidência por mockup.

## Avaliação física pendente

Testes automatizados e compilação não substituem avaliação de acessibilidade, interrupções, recursos do aparelho e instalação/distribuição pelo titular. Sem backend ou autenticação. Compra única na loja é proposta de monetização; não há cobrança ativa/IAP. Evidências Playwright são da versão web, não de gestos nativos. Build iOS disponível para simulador; não instala em iPhone físico.

[Fluxos e checklist](fluxos.md) · [README](../README.md)
