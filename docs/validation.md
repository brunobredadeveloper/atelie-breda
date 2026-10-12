# Validação executada em 12/10/2026

- TypeScript strict, incluindo verificação de imports/parâmetros não usados: aprovado.
- Expo lint: aprovado, sem erros ou warnings.
- 10 testes automatizados de domínio/ViewModel: aprovados. Cobre undo/redo ramificado, limites e arquivos inválidos, catálogo, persistência e reabertura, falha de gravação, falha de abertura sem sobrescrita, acesso adulto/expiração, capacidade da galeria e limpeza reversível.
- Expo export: bundles Android Hermes, iOS Hermes e web gerados com sucesso no SDK 57.
- Prebuild: projetos Android e iOS gerados com sucesso; plugin de bundle debug verificado no Gradle gerado.
- Quatro percursos Playwright da interface WEB (390 × 844 e 360 × 640): desenhar com coordenadas verificadas, preencher regiões, manter canvas quadrado em tela compacta, salvar, galeria, persistência após reload e barreira de responsáveis com erro/acerto e tentativa de acesso direto à URL privada aprovados. Sem pageerror no percurso. Não equivale a testes de gestos/renderização nos sistemas nativos.
- Screenshots: capturadas da versão WEB React Native depois das transições, não são imagens de dispositivos Android ou iOS.

## GitHub Actions e APK

Código validado: `d086331371996b8aa5f653d381b54a39e2326184`.

[Esteira Android aprovada](https://github.com/brunobredadeveloper/atelie-breda/actions/runs/38277398538): lint, TypeScript, dez testes de lógica, quatro percursos Playwright, exportação de bundles e compilação nativa APK concluídos com sucesso.

Artefato: `atelie-breda-android-apk`. APK 0.1.0, 64.825.471 bytes, ABIs arm64-v8a e x86_64, bundle JavaScript incorporado. SHA-256: `4df970a26d4c0b5bc58f49224635cea5184b4eb418ef34503b515accd8fb24f0`. O ZIP baixado corresponde ao digest publicado pelo GitHub Actions. Build em modo release com assinatura debug para testes internos; não é assinatura de produção.

## iOS e avaliação física

[Verificação iOS](https://github.com/brunobredadeveloper/atelie-breda/actions/runs/38277913933), na branch `ci/ios-verification`: mesmos fontes do app, com condição de workflow para executar o build de simulador. Validações, CocoaPods, compilação Xcode Release sem assinatura e publicação do artefato `atelie-breda-ios-simulator` concluídos com sucesso. O artefato é um aplicativo para simulador, não uma IPA instalável no iPhone.

Não houve instalação física. TestFlight requer conta/equipe Apple e provisionamento. Exportação PNG, feedback tátil, limite de memória e comportamento de background devem ser validados nos aparelhos reais antes de release comercial.

## Checklist de aceitação no celular

1. Abrir em modo avião, passar pelas boas-vindas, criar desenho livre, ponto único e traço longo.
2. Pincéis canetinha/lápis/arco-íris/borracha, três espessuras, nove cores e carimbos.
3. Preenchimento em regiões e sobreposição de pintura nos doze modelos.
4. Desfazer/refazer, limpeza e desfazer limpeza; não sair apagando a galeria.
5. Salvar, fechar e reabrir; recuperar rascunho e editar uma criação salva.
6. Texto ampliado e TalkBack/VoiceOver nos controles; telas pequenas, iPhone e iPad.
7. Movimento reduzido do sistema e preferência do responsável; vibração habilitada/desabilitada.
8. Exportação PNG pelo adulto, cancelamento do share sheet e volta da sessão bloqueada após background.
9. Cinco erros na barreira, cooldown, expiração de autorização e tentativa de excluir sem autorização.
10. Armazenamento cheio, arquivos inválidos e quarenta criações: falha explícita sem perder os anteriores.
