# Arquitetura do Ateliê Breda

Domain: entidades imutáveis Artwork, Stroke, Point, catálogo vetorial e regras de validação. Não importa React, React Native, AsyncStorage, Expo ou rede. Contratos pequenos ArtworkRepository, PreferencesRepository, Clock, IdGenerator delimitam as dependências.

Application: StudioViewModel é o ViewModel do MVVM. Publica um snapshot imutável via subscribe/getSnapshot e recebe eventos da View. Orquestra histórico, galeria, rascunho e autorização temporária; não acessa APIs nativas diretamente. Operações de escrita são serializadas para evitar uma gravação antiga ultrapassar uma nova.

Infrastructure: LocalArtworkRepository e LocalPreferencesRepository adaptam AsyncStorage aos contratos. Decodificação valida dados e limita tamanho, quantidade e formato. Falha na abertura impede sobrescrever uma galeria existente.

Presentation: telas React Native observam o ViewModel usando useSyncExternalStore. ArtCanvas transforma gestos em coordenadas lógicas e SVG; captura PNG, haptics, lifecycle e compartilhamento são integrações de interface. Composition root monta as dependências por construtor.

## SOLID e patterns aplicados

- Single Responsibility: renderizador não persiste; repositório não navega; catálogo não conhece Android/iOS.
- Open/Closed: BrushStrategy e catálogo recebem novos pincéis/desenhos sem alterar as regras de armazenamento.
- Liskov: repositórios em memória dos testes respeitam os mesmos contratos dos adapters.
- Interface Segregation: arte, preferências, tempo e IDs possuem interfaces separadas.
- Dependency Inversion: ViewModel depende de portas TypeScript; adapters dependem das portas, não o contrário.
- Command/Memento: ArtHistory mantém snapshots limitados de operações, com undo/redo e invalidação da ramificação futura.
- Strategy: opacidade, espessura e cores dos pincéis.
- Repository/Adapter: armazenamento local.
- Observer: snapshots para useSyncExternalStore.
- Factory/Composition Root: criação do ViewModel e injeção explícita.

Não introduzimos classes vazias ou factories para cada botão apenas para aumentar a contagem de patterns. O código atual agrupa casos de uso pequenos no ViewModel; a extração em serviços separados será útil quando houver sincronização ou módulos com ciclos próprios.

## Limites importantes

180 traços por criação, 450 pontos por traço, 80 carimbos, 40 criações na galeria, histórico de 40 estados. Os desenhos usam coordenadas 0–1000 e não dependem da resolução da tela. Arco-íris agrupa segmentos por cor para reduzir elementos SVG. Os limites preservam o conteúdo: ao atingir capacidade, a gravação falha com orientação; não elimina o desenho mais antigo.

O preenchimento trabalha com regiões vetoriais definidas no catálogo; não usa flood fill de bitmap. A borracha cobre os traços com a cor do papel. Desenho por toque é visual: os controles possuem rótulos acessíveis, mas não prometemos equivalência não visual da pintura.

## Navegação

Expo Router registra as telas em src/app. O ViewModel emite a intenção de rota sem importar o router; o layout adapta essa intenção para router.replace. O provider mantém galeria, rascunho e diálogos durante trocas de tela. A tela de responsáveis verifica autorização também na renderização, e URLs diretas não desbloqueiam a área.
