# Validação executada em 12/10/2026

- TypeScript strict, incluindo verificação de imports/parâmetros não usados: aprovado.
- Expo lint: aprovado, sem erros ou warnings.
- 10 testes automatizados de domínio/ViewModel: aprovados. Cobre undo/redo ramificado, limites e arquivos inválidos, catálogo, persistência e reabertura, falha de gravação, falha de abertura sem sobrescrita, acesso adulto/expiração, capacidade da galeria e limpeza reversível.
- Expo export: bundles Android Hermes, iOS Hermes e web gerados com sucesso no SDK 57.
- Prebuild: projetos Android e iOS gerados com sucesso; plugin de bundle debug verificado no Gradle gerado.
- Quatro percursos Playwright da interface WEB (390 × 844 e 360 × 640): desenhar com coordenadas verificadas, preencher regiões, manter canvas quadrado em tela compacta, salvar, galeria, persistência após reload e barreira de responsáveis com erro/acerto e tentativa de acesso direto à URL privada aprovados. Sem pageerror no percurso. Não equivale a testes de gestos/renderização nos sistemas nativos.
- Screenshots: capturadas da versão WEB React Native depois das transições, não são imagens de dispositivos Android ou iOS.

## Pendências

Build APK local avançou pela configuração dos plugins, mas falhou na resolução de dependências AndroidX: HTTP HEAD do repositório Google Maven retornou 403 Forbidden neste ambiente. O bloqueio inicial de proxy/foojay foi resolvido; o bloqueio final é o download de artefatos Android. Não há APK/AAB validado nesta entrega e nenhum resultado verde de GitHub Actions. Workflow pronto para executar após criar/publicar o repositório.

iOS: não foi feito build Xcode ou instalação física. TestFlight requer conta/equipe Apple e provisionamento. Exportação PNG, feedback tátil, limite de memória e comportamento de background devem ser validados nos aparelhos reais antes de release comercial.

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
