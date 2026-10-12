# Ateliê Breda 🎨

App React Native Android/iOS original da **breda_dev** para desenhar e colorir. Um ambiente infantil sem anúncios, sem cadastro e sem pressa, inspirado na facilidade de pintar com os dedos — sem copiar assets ou interface do aplicativo da referência.

## Produto implementado

- Abertura nativa de marca, boas-vindas e transições com respeito a movimento reduzido.
- Desenho livre com canetinha, lápis, arco-íris, borracha, nove cores, três espessuras e quatro papéis.
- Doze ilustrações vetoriais originais: gato, coelho, peixe, borboleta, flor, sol, árvore, arco-íris, foguete, casa, barco e sorvete.
- Pintura por toque em regiões, desenho livre sobre modelos e quatro carimbos.
- Undo/redo, limpeza reversível, rascunho automático e galeria local com reabertura.
- Estados de carregamento, salvamento, sucesso, erro e galeria vazia.
- Área de responsáveis, gerenciamento da galeria, preferências e exportação PNG com share sheet Android/iOS.
- Haptics opcionais, labels de acessibilidade e controles grandes.

**Monetização:** compra única do aplicativo na loja; conteúdo completo incluído. Não existe cobrança ativa na versão de teste nem integração IAP simulada. Consulte [publicação](docs/publication.md).

## Executar

Node 24 e npm. Expo SDK 57, React Native 0.86.3, Expo Router e TypeScript strict. Android 7+ e iOS 16.4+; builds iOS requerem Xcode 26.4+. Dependências fixadas pelo package-lock.json.

```sh
npm ci
npm run check
npx expo start
```

Expo Go compatível com SDK 57 permite avaliar em Android/iOS. Para experiência nativa completa, use development build ou APK; a exportação PNG depende dos módulos nativos. Nenhum serviço de backend ou Firebase é necessário para brincar.

```sh
npx expo prebuild --platform android --no-install
cd android
./gradlew :app:assembleRelease
```

A variante release inclui o bundle JS e funciona sem Metro. No build local/CI de teste, usa a chave debug gerada pelo template Expo; não é assinatura de produção. APK em android/app/build/outputs/apk/release/app-release.apk. Requer JDK 17, Android SDK/NDK compatíveis e espaço disponível. Não publique esse APK de teste na loja. Para produção use credenciais privadas próprias via EAS.

```sh
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile ios-simulator
npx eas-cli@latest build --platform all --profile production
```

EAS exige a conta Expo do titular e vínculo do projeto; builds para iPhone exigem credenciais Apple e provisionamento. IPA não instala como APK: use distribuição autorizada ou TestFlight. Build de simulador não roda no iPhone físico.

## Teste de interface

```sh
npx expo export --platform web
npx playwright install chromium
npm run test:ui
```

O Playwright avalia a versão web em dois tamanhos de tela; não substitui testes nativos.

## Arquitetura e validação

[MVVM, Clean Architecture, SOLID e patterns](docs/architecture.md). Domínio e ViewModel testados com repositórios substituíveis. [Status real de validação](docs/validation.md).

A [esteira Android passou](https://github.com/brunobredadeveloper/atelie-breda/actions/runs/38277398538), incluindo lint, TypeScript, dez testes de lógica, bundles Android/iOS/web, quatro percursos Playwright e APK nativo. Baixe o ZIP `atelie-breda-android-apk` nos artefatos dessa execução e extraia `app-release.apk`; o APK de testes usa assinatura debug. O [build nativo iOS de simulador também passou](https://github.com/brunobredadeveloper/atelie-breda/actions/runs/38277913933). Novos builds iOS em macOS podem ser executados via workflow_dispatch. O artefato de simulador não instala em iPhone físico; consulte a documentação de validação para as avaliações físicas ainda necessárias.

Identidade visual herdada da breda_dev. Vetores dos desenhos e código do produto originais; bibliotecas mantêm suas licenças. Nenhum dado pessoal ou imagem da criança da referência está incluído no app.
