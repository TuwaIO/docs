import { docsLabels } from '@tuwaio/docs-ui';

import type { DocsHubLabels } from '../types';

/**
 * Ukrainian localization dictionary for the TUWA Documentation Hub.
 */
export const uk: DocsHubLabels = {
  nav: {
    mainScreen: 'Головна',
    guides: 'Посібники',
    quasar: 'Quasar',
    comparisons: 'Порівняння',
    configurator: 'Конфігуратор',
    playground: 'Пісочниця',
    theme: 'Тема',
    language: 'Мова',
    selectLanguage: docsLabels.uk.selectLanguage,
    toggleTheme: 'Перемкнути тему',
    openMenu: 'Відкрити меню навігації',
    closeMenu: 'Закрити меню навігації',
    mobileNavAria: 'Розділи документації',
  },
  // The interface texts of every TUWA documentation site (@tuwaio/docs-ui)
  footer: docsLabels.uk.footer,
  common: {
    packageManager: 'Пакетний менеджер',
    copy: 'Копіювати',
    copied: 'Скопійовано',
    copyCommand: 'Скопіювати команду',
    copyCode: 'Скопіювати код',
    close: 'Закрити',
    yes: 'Так',
    partial: 'Частково',
    no: 'Ні',
  },
  home: {
    hero: {
      badge: 'Інтерактивна Web3 документація',
      titlePrefix: 'TUWA',
      titleHighlight: 'Документація',
      description:
        'Open-source TypeScript пакети для EVM і Solana: підключення гаманців, вхід за стандартом CAIP-122 та відстеження транзакцій, з опціональними React-компонентами та хмарним або self-hosted бекендом.',
      searchAria: 'Пошук по всій документації TUWA',
      searchButton: 'Пошук по всій документації…',
      explorePackages: 'Огляд пакетів',
      tryPlayground: 'Спробувати в Пісочниці',
    },
    timeline: {
      titlePrefix: 'Архітектура',
      titleHighlight: 'Екосистеми',
      subtitle:
        'Кожен етап спирається на попередній. Встановіть увесь стек через @tuwaio/sdk або оберіть окремий пакет.',
      stages: {
        1: {
          label: 'Етап 1 — Базова автентифікація та примітиви',
          subtitle: 'Автентифікація CAIP-122 та мультичейн-утиліти для EVM і Solana',
        },
        2: {
          label: 'Етап 2 — Стан та підключення',
          subtitle: 'Підключення гаманців та відстеження транзакцій',
        },
        3: {
          label: 'Етап 3 — Бекенд та синхронізація',
          subtitle: 'Керована хмара або self-hosted бекенд Quasar',
        },
        4: {
          label: 'Етап 4 — Інтерфейс користувача',
          subtitle: 'React-компоненти для Satellite та Pulsar',
        },
        5: {
          label: 'Етап 5 — Рівень інтеграції SDK',
          subtitle: 'Єдиний клієнтський SDK та мережеві адаптери',
        },
      },
    },
    entries: {
      siwx: {
        tagline: 'Модуль та адаптери автентифікації CAIP-122',
      },
      orbit: {
        tagline: 'Мультичейн-утиліти для EVM та Solana',
      },
      satellite: {
        tagline: 'Headless-сховище стану підключення гаманців для EVM та Solana',
      },
      pulsar: {
        tagline: 'Відстеження транзакцій, що зберігається після перезавантаження',
      },
      quasar: {
        tagline: 'Керована хмара · Індексація та синхронізація транзакцій',
      },
      'quasar-community': {
        tagline: 'Self-hosted бекенд та адмін-панель · Apache-2.0',
      },
      nova: {
        tagline: 'Дизайн-система та бібліотека React-компонентів',
      },
      sdk: {
        tagline: 'Єдиний клієнтський SDK та мережеві адаптери для EVM і Solana',
      },
    },
    docCard: {
      cloudAndSelfHosted: 'Хмара та self-hosted',
      onePackage: '1 пакет',
      packagesCount: '{count} пакети(ів)',
      readDocs: 'Читати документацію',
      tryLiveAdmin: 'Демо-адмінка',
      showPackages: 'Показати пакети {title}',
      hidePackages: 'Сховати пакети {title}',
    },
    packagePreview: {
      installLabel: 'Встановити {name}',
      copyInstallTitle: 'Скопіювати команду встановлення для {name}',
      peerDepsTitle: 'Деталі та peer-залежності пакета {name}',
      deprecated: 'застарілий',
      standalone: 'Окремі пакети',
      peersCount: '+{count} peer',
      peersCountPlural: '+{count} peers',
      lighterInstallPrefix: 'Потрібен лише {scope}? Встановіть',
      lighterInstallConjunction: 'або',
    },
    packageDialog: {
      deprecatedPrefix: 'Застарілий пакет:',
      install: 'Встановлення',
      copyInstallTitle: 'Скопіювати команду встановлення',
      peersHint:
        'Обов’язкові peer-залежності вже включено до команди. Пакети, які вже є у вашому проєкті, оновляться лише за потреби.',
      lighterEntryHeading: 'Потрібна лише одна частина?',
      guidesHeading: 'Посібники',
      dependenciesHeading: 'Залежності',
      includedWith: 'Входить до складу',
      peerDependenciesHeading: 'Peer-залежності',
      noRuntimeDeps: 'Жодних runtime- або peer-залежностей — працює скрізь, де працює TypeScript.',
      optional: 'опціонально',
      viewOnNpm: 'Переглянути на npm',
      packageDescriptions: {
        '@tuwaio/evm-sdk':
          'L9 EVM-доповнення для TUWA SDK: реекспортує EVM-пакети Orbit Utils, SIWX, Satellite Connect, Pulsar та Nova Connect через підшляхи.',
        '@tuwaio/nova-connect':
          'L7 пакет підключення гаманців у складі Nova UI Kit (TUWA): кнопка підключення, модальні вікна гаманців і акаунту, вибір мережі та вхід SIWX для EVM і Solana з англійською, українською та китайською локалізаціями.',
        '@tuwaio/nova-core':
          'L6 ядро Nova UI Kit (TUWA): CSS-змінні теми --tuwa-*, діалогові вікна, іконки мереж і гаманців, а також спільні хуки й утиліти.',
        '@tuwaio/nova-transactions':
          'L7 пакет транзакцій Nova UI Kit (TUWA): спливаючі сповіщення (toasts), модальне вікно відстеження з пришвидшенням і скасуванням та історія транзакцій Pulsar.',
        '@tuwaio/orbit-core':
          'L1 ядро Orbit Utils (TUWA): мультичейн-типи без залежностей і прив’язки до фреймворку, помічники CAIP-2, CAIP-10 і CAIP-19, утиліти конекторів і адрес, нормалізація помилок та SSR-безпечне збереження сесій.',
        '@tuwaio/orbit-evm':
          'L2 EVM-пакет Orbit Utils (TUWA): кешовані клієнти viem, перемикання мереж, резолвінг ENS та смарт-акаунти ERC-4337 (Solady з бандлером і пеймастером Pimlico) на базі viem та @wagmi/core.',
        '@tuwaio/orbit-solana':
          'L2 Solana-пакет Orbit Utils (TUWA): кешовані RPC-клієнти @solana/kit, виявлення гаманців Wallet Standard, утиліти кластерів і експлорерів та пошук імен і аватарів SNS.',
        '@tuwaio/pulsar-core':
          'L3 ядро Pulsar (TUWA): headless-сховище транзакцій зі збереженням у localStorage, контрактом адаптера мережі, валідацією метаданих та хуками серверної синхронізації для EVM і Solana.',
        '@tuwaio/pulsar-evm':
          'L4 EVM-пакет Pulsar (TUWA): адаптер і трекери для стандартних транзакцій, операцій ERC-4337, мультипідписів Safe та релеїв Gelato з підтримкою пришвидшення і скасування на базі viem і @wagmi/core.',
        '@tuwaio/pulsar-react':
          'L4 React-пакет Pulsar (TUWA): хук useInitializeTransactionsPool відновлює відстеження незавершених транзакцій після перезавантаження сторінки, а useTxFinished реагує на кожну завершену транзакцію.',
        '@tuwaio/pulsar-solana':
          'L4 Solana-пакет Pulsar (TUWA): адаптер транзакцій для гаманців Wallet Standard, трекер підписів та помічник підписання і відправлення на базі @solana/kit.',
        '@tuwaio/quasar-sdk':
          'L5 клієнт Quasar (TUWA): API-клієнт для Quasar Cloud і self-hosted вузлів Quasar (синхронізація та історія транзакцій Pulsar), а також CLI quasar-sdk для пересилання вебхуків на localhost.',
        '@tuwaio/satellite-core':
          'L3 ядро Satellite Connect (TUWA): headless Zustand-сховище без прив’язки до фреймворку для підключення гаманців EVM і Solana з автопідключенням останнього гаманця та станом SIWX.',
        '@tuwaio/satellite-evm':
          'L4 EVM-пакет Satellite Connect (TUWA): адаптер гаманців і спостерігач з’єднань для конекторів wagmi, перевірка смарт-контрактних акаунтів та помічники конфігурації wagmi на базі @wagmi/core і viem.',
        '@tuwaio/satellite-react':
          'L4 React-пакет Satellite Connect (TUWA): провайдер, хук сховища та компоненти-спостерігачі для EVM і Solana, що синхронізують підключення з гаманцями та сесіями SIWX.',
        '@tuwaio/satellite-siwe-next-auth':
          'Рівень 4 (L4) екосистеми TUWA. Застарілий адаптер серверної автентифікації сесій для застосунків Next.js. Замінений сучасним мультичейн-стеком SIWX.',
        '@tuwaio/satellite-solana':
          'L4 Solana-пакет Satellite Connect (TUWA): адаптер Wallet Standard, спостерігач з’єднань і підписувач повідомлень для гаманців Solana на базі @solana/kit.',
        '@tuwaio/sdk':
          'L8 ядро TUWA SDK: єдиний пакет для React-застосунків, що реекспортує Orbit Utils, SIWX, Satellite Connect, Pulsar та Nova UI Kit через підшляхи разом із таблицями стилів. Додайте @tuwaio/evm-sdk або @tuwaio/solana-sdk для потрібної мережі.',
        '@tuwaio/siwx-core':
          'L1 ядро SIWX (TUWA): конструктор, парсер і валідатор повідомлень входу CAIP-122 із політиками верифікації, перевіркою сесій, нонсами та типізованими помилками для EVM і Solana.',
        '@tuwaio/siwx-evm':
          'L2 EVM-пакет SIWX (TUWA): підписувач CAIP-122 для гаманців wagmi і viem, а також верифікація EIP-191 (EOA), EIP-1271 (смарт-гаманці) та ERC-6492 (ще не розгорнуті смарт-гаманці) на базі viem і @wagmi/core.',
        '@tuwaio/siwx-react':
          'L2 React-пакет SIWX (TUWA): хуки useSiwx та useSiwxSession зі сховищем сесій Zustand для входу за стандартом CAIP-122 і помічниками Satellite Connect.',
        '@tuwaio/siwx-server':
          'L2 серверний пакет SIWX (TUWA): серверна верифікація входу CAIP-122 для EVM і Solana, сховища одноразових нонсів і сесій, утиліти HttpOnly cookie, обробники Next.js App Router та JWT/JWKS для зовнішніх провайдерів автентифікації.',
        '@tuwaio/siwx-solana':
          'L2 Solana-пакет SIWX (TUWA): підписувач CAIP-122 для гаманців Wallet Standard і @solana/kit та верифікація підписів ed25519 через Web Crypto на базі @solana/kit.',
        '@tuwaio/solana-sdk':
          'L9 Solana-доповнення для TUWA SDK: реекспортує Solana-пакети Orbit Utils, SIWX, Satellite Connect, Pulsar та Nova Connect через підшляхи.',
      },
      packageDeprecations: {
        '@tuwaio/satellite-siwe-next-auth': 'Використовуйте замість нього @tuwaio/siwx-react та @tuwaio/siwx-server.',
      },
      lighterDescriptions: {
        '@tuwaio/sdk':
          '@tuwaio/sdk об’єднує всі проєкти TUWA для React, включно з Nova UI Kit. Якщо вам потрібне лише підключення гаманців, відстеження транзакцій або вхід без решти модулів, встановіть відповідні пакети напряму:',
        '@tuwaio/evm-sdk':
          '@tuwaio/evm-sdk працює в парі з @tuwaio/sdk. Якщо ви не використовуєте @tuwaio/sdk, встановіть EVM-пакет потрібного рівня напряму:',
        '@tuwaio/solana-sdk':
          '@tuwaio/solana-sdk працює в парі з @tuwaio/sdk. Якщо ви не використовуєте @tuwaio/sdk, встановіть Solana-пакет потрібного рівня напряму:',
      },
    },
    quickStart: {
      titlePrefix: 'Почніть розробку за',
      titleHighlight: 'лічені хвилини',
      subtitle:
        'Оберіть пакети під свій застосунок, зберіть повноцінний React dApp або розгорніть Quasar на власному сервері.',
      cards: {
        choosePackages: {
          title: 'Оберіть свої пакети',
          description:
            'Вирішіть між єдиним @tuwaio/sdk та окремими пакетами для підключення гаманців, входу SIWX, відстеження транзакцій і Nova UI.',
          cta: 'Підібрати стек',
        },
        fullStackReact: {
          title: 'Full-Stack React застосунок',
          description:
            'Підключайте гаманці, авторизуйте через SIWX, відстежуйте транзакції з Pulsar і синхронізуйте з Quasar в одному Next.js застосунку для EVM або Solana.',
          cta: 'Зібрати застосунок',
        },
        selfHostQuasar: {
          title: 'Self-Hosting Quasar',
          description:
            'Запустіть Quasar Community Edition (Apache-2.0) на власному сервері через Docker Compose: PostgreSQL, Redis, воркери відстеження та вебхуки.',
          cta: 'Розгорнути вузол',
        },
      },
      allGuidesPrefix: 'Шукаєте окремий посібник із входу SIWX, відстеження транзакцій або синхронізації з Quasar?',
      browseAllGuides: 'Переглянути всі посібники',
      aiBanner: {
        badge: 'ШІ-асистенти',
        title: 'Працюєте з Claude Code, Cursor або Windsurf?',
        description:
          'Передайте своєму ШІ-агенту файл TUWA_AGENTS.md: один документ із правильними імпортами, налаштуванням сторів, маршрутами SIWX та правилами синхронізації Quasar для всіх пакетів TUWA.',
        copyUrl: 'Копіювати URL',
        copied: 'Скопійовано',
        copyTitle: 'Скопіювати пряме посилання на TUWA_AGENTS.md',
        viewOnGithub: 'Відкрити на GitHub',
      },
    },
    compactConfigurator: {
      badge: 'Інтерактивно',
      title: 'Налаштуйте свій стек',
      description: 'Оберіть фреймворк, мережі та функції, щоб отримати команду встановлення та файли налаштування.',
      openWithFiles: 'Відкрити з усіма {count} файлами налаштування',
      install: 'Встановлення',
      filesGenerated: 'Згенеровані файли для цього стеку ({count})',
      viewCode: 'Переглянути код',
    },
  },
  comparisons: {
    badge: 'Інтерактивне порівняння',
    titlePrefix: 'TUWA та',
    titleHighlight: 'Альтернативи',
    description:
      'TUWA охоплює підключення гаманців, автентифікацію, відстеження транзакцій і серверний бекенд. Жоден окремий інструмент не закриває всі ці рівні водночас, тому ця сторінка порівнює TUWA з рішеннями, які інакше довелося б комбінувати — включно з осями, де керовані платформи сильніші за своєю архітектурою.',
    verifiedPrefix:
      'Кожна оцінка обчислюється на основі наведених нижче критеріїв із посиланнями на першоджерела. Остання перевірка:',
    methodologyLink: 'Читати методологію ↓',
    radar: {
      sectionTitle: 'Радарне порівняння',
      sectionDescription:
        'Оберіть до трьох продуктів для порівняння з TUWA за шістьма осями. Оцінка на кожній осі — це частка виконаних критеріїв у таблиці нижче (часткове виконання дає половину бала).',
      compareLabel: 'Порівняти з TUWA (до {max})',
      chartLabel: 'Радарне порівняння TUWA та обраних продуктів за шістьма осями',
      axisColumn: 'Вісь',
      favorsHostedNote:
        '* Керовані платформи гаманців та RPC отримують вищі бали за Онбординг і Покриття мереж за задумом: TUWA підключає гаманці, які вже є у користувачів, і фокусується на EVM та Solana.',
    },
    matrix: {
      sectionTitle: 'Критерії та джерела',
      sectionDescription:
        'Кожна клітинка містить оцінку «Так», «Частково» або «Ні» з поясненням і пронумерованим посиланням на документацію, сторінку тарифів або ліцензію.',
      allAxes: 'Усі осі ({count})',
      criterionColumn: 'Критерій',
      licenseRow: 'Ліцензія',
      pricingRow: 'Тарифи',
      sourceLabel: 'джерело',
    },
    chooseInstead: {
      sectionTitle: 'Коли варто обрати інший інструмент',
      sectionDescription:
        'Кожен конкурент вирішує реальну задачу. Ось випадки, коли він підійде краще за TUWA, і чим саме відрізняється підхід TUWA.',
      vsTuwa: 'проти TUWA:',
      pickWhen: 'Обирайте {name}, коли',
      howTuwaDiffers: 'Чим відрізняється TUWA',
    },
    methodology: {
      sectionTitle: 'Методологія та виправлення',
      howScoresWorkTitle: 'Як рахуються бали',
      howScoresWorkP1:
        'Кожна з шести осей радара складається з трьох критеріїв. Продукт отримує 1 бал за «Так», 0.5 за «Частково» і 0 за «Ні»; оцінка осі дорівнює сумі балів, поділеній на 3, у відсотках.',
      howScoresWorkP2:
        '«Частково» означає, що функція охоплює лише частину продукту: наприклад, події транзакцій доступні лише для вбудованих гаманців самого вендора, або клієнтська бібліотека без власного бекенду все одно залежить від пропрієтарного релея.',
      whyOnboardingTitle: 'Чому TUWA має 0% за Онбординг',
      whyOnboardingP1:
        'Дві з шести осей — Онбординг і Покриття мереж — грають на користь керованих платформ вбудованих гаманців та RPC. Це зроблено свідомо: порівняння, де TUWA перемагає на кожній осі, не допомогло б вам зробити чесний технічний вибір.',
      whyOnboardingP2:
        'TUWA створено для self-custodial застосунків, куди користувачі приходять із власними гаманцями EVM або Solana. Якщо ваші користувачі ще не мають гаманців, Privy, Dynamic, Reown AppKit або thirdweb створені саме для цього.',
      reportErrorTitle: 'Повідомити про неточність',
      reportErrorP1:
        'Конкуренти часто випускають нові функції та змінюють тарифи. Кожен факт у таблиці посилається на сторінку, за якою його перевіряли; якщо дані застаріли або містять неточність, створіть issue, і ми оновимо таблицю.',
      openIssue: 'Створити issue з посиланням на джерело',
      transparencyTitle: 'Примітка щодо прозорості.',
      transparencyText:
        'Цю сторінку підтримує команда TUWA. Назви продуктів є торговельними марками відповідних власників.',
    },
    cta: {
      configureStack: 'Налаштувати свій стек',
      readOverview: 'Читати огляд посібників',
    },
    segments: {
      connectors: { label: 'UI підключення гаманців' },
      embedded: { label: 'Вбудовані гаманці та автентифікація' },
      platforms: { label: 'Платформи гаманців і транзакцій' },
      indexing: { label: 'Індексація' },
    },
    axes: {
      custody: { label: 'Некастодіальність', question: 'Чи залишаються ключі та дані користувачів у них і у вас?' },
      openness: {
        label: 'Відкритість',
        question: 'Чи можна прочитати, форкнути й запустити кожен компонент без вендора?',
      },
      cost: {
        label: 'Вартість при масштабуванні',
        question: 'Чи залишається рахунок стабільним зі зростанням бази користувачів?',
      },
      lifecycle: {
        label: 'Життєвий цикл транзакцій',
        question: 'Чи відстежується кожна транзакція застосунку до фінального стану?',
      },
      onboarding: {
        label: 'Онбординг',
        question: 'Чи можуть користувачі без гаманця увійти та здійснювати транзакції?',
      },
      chains: { label: 'Покриття мереж', question: 'Скільки сімейств блокчейнів підтримується?' },
    },
    criteria: {
      'own-wallets': {
        label: 'Користувачі підписують власними гаманцями',
        description: 'Браузерні, мобільні та апаратні гаманці підключаються через стандартні протоколи.',
      },
      'no-vendor-keys': {
        label: 'Жодного управління ключами на боці вендора',
        description: 'Продукт не створює гаманців, ключі яких зберігаються в MPC, TEE або анклавах вендора.',
      },
      'no-vendor-accounts': {
        label: 'Облікові записи залишаються у вас',
        description: 'Вендор не веде власних облікових записів для кожного вашого користувача.',
      },
      'oss-client': {
        label: 'Клієнт під ліцензією OSI',
        description: 'SDK у вашому застосунку опубліковано під відкритою ліцензією, схваленою OSI.',
      },
      'oss-backend': {
        label: 'Відкритий бекенд або робота без нього',
        description:
          'Кожен сервер, від якого залежить продукт, має відкритий код і підтримує self-hosting, або сервер не потрібен.',
      },
      'no-vendor-key': {
        label: 'Працює без ключа вендора',
        description: 'Production-налаштування не вимагає project ID, app ID або API-ключа з панелі вендора.',
      },
      'free-to-ship': {
        label: 'Безкоштовний запуск у production',
        description: 'Production-застосунок можна запустити без платного тарифу.',
      },
      'no-mau-billing': {
        label: 'Відсутність тарифікації за MAU',
        description: 'Рахунок не зростає пропорційно до кількості активних користувачів або гаманців на місяць.',
      },
      'free-self-host': {
        label: 'Безкоштовний self-hosted шлях',
        description: 'Увесь продукт працює в production на ваших серверах без ліцензійних відрахувань.',
      },
      'tracks-to-final': {
        label: 'Відстеження транзакцій до фінального стану',
        description: 'Транзакція, відправлена застосунком, відстежується до успіху, помилки або заміни.',
      },
      'survives-reload': {
        label: 'Незавершені транзакції переживають перезавантаження',
        description: 'Відстеження автоматично відновлюється після оновлення сторінки.',
      },
      'status-webhooks': {
        label: 'Вебхуки зміни статусу',
        description: 'Ваш сервер отримує сповіщення, коли транзакція змінює свій статус.',
      },
      'email-social': {
        label: 'Вхід через email або соцмережі',
        description: 'Користувачі можуть увійти за допомогою email, телефону або акаунту соцмережі.',
      },
      'embedded-wallets': {
        label: 'Гаманці для користувачів без гаманця',
        description: 'Нові користувачі отримують гаманець без необхідності встановлювати розширення.',
      },
      'gas-or-onramp': {
        label: 'Спонсорування газу або фіатний онрамп',
        description:
          'Застосунок може оплачувати газ за користувачів або дозволяє купувати криптовалюту прямо в інтерфейсі.',
      },
      evm: {
        label: 'Мережі EVM',
        description: 'Ethereum та EVM-сумісні мережі.',
      },
      solana: {
        label: 'Solana',
        description: 'Solana mainnet та devnet.',
      },
      'other-chains': {
        label: 'Інші сімейства блокчейнів',
        description: 'Принаймні одне сімейство поза EVM та Solana, наприклад Bitcoin, Sui або TON.',
      },
    },
    products: {
      tuwa: {
        summary:
          'Headless open-source пакети для входу, підключення гаманців і відстеження транзакцій, плюс бекенд Quasar.',
        license: 'Apache-2.0',
        pricingText:
          'Клієнтські пакети безкоштовні. Quasar Cloud: безкоштовна публічна бета, 1 000 безкоштовних одиниць квоти на організацію. Community Edition: безкоштовно.',
        chooseWhen: '',
        tuwaDifference: '',
        facts: {
          'own-wallets':
            'Гаманці EIP-6963 через wagmi, гаманці Wallet Standard на Solana, WalletConnect та Safe{Wallet}.',
          'no-vendor-keys': 'TUWA не створює гаманців і ніколи не торкається приватних ключів.',
          'no-vendor-accounts':
            'Сесії живуть на вашому сервері (siwx-server). Quasar Cloud зберігає транзакції, які синхронізує ваш застосунок; Community Edition зберігає їх на ваших серверах.',
          'oss-client': 'Apache-2.0.',
          'oss-backend': 'Quasar Community Edition має ліцензію Apache-2.0 і запускається через Docker Compose.',
          'no-vendor-key':
            'Лише WalletConnect, якщо ви його вмикаєте, потребує безкоштовного Reown project ID. Self-hosted Quasar не потребує жодного ключа TUWA.',
          'free-to-ship':
            'Клієнтські пакети безкоштовні; Quasar Cloud безкоштовний під час публічної бети (1 000 одиниць квоти на організацію).',
          'no-mau-billing':
            'Quasar Cloud рахує одиниці квоти за відстежені транзакції та доставлені вебхуки, а не за користувачів.',
          'free-self-host': 'Community Edition: безкоштовно, Apache-2.0.',
          'tracks-to-final':
            'Pulsar відстежує EVM-транзакції (стандартні, ERC-4337 і Safe) та транзакції Solana до станів Success, Failed або Replaced.',
          'survives-reload':
            'Пул транзакцій зберігається в localStorage, а трекери відновлюють роботу після перезавантаження.',
          'status-webhooks': 'Quasar надсилає підписані вебхуки, коли транзакція досягає фінального стану.',
          'email-social': 'За архітектурою: TUWA підключає гаманці, які вже є у користувачів.',
          'embedded-wallets': 'За архітектурою: жодних кастодіальних, MPC чи анклавних гаманців.',
          'gas-or-onramp':
            'Pulsar відстежує транзакції ERC-4337 та релеїв Gelato, але TUWA не спонсорує газ і не має вбудованого онрампу.',
          evm: 'Побудовано на wagmi та viem.',
          solana: 'Побудовано на @solana/kit та Wallet Standard.',
          'other-chains': 'Starknet, Tron, Bitcoin та TON заплановані в дорожній карті (Фаза 8).',
        },
      },
      rainbowkit: {
        summary: 'React-модалка підключення гаманців для EVM-застосунків на базі wagmi.',
        license: 'MIT',
        pricingText: 'Безкоштовно (MIT). Для WalletConnect потрібен безкоштовний project ID від Reown.',
        chooseWhen:
          'Ваш застосунок працює лише з EVM, і вам потрібна добре знайома модалка підключення з мінімальним налаштуванням.',
        tuwaDifference:
          'Satellite Connect зберігає з’єднання в headless-сховищі для EVM та Solana, а Pulsar супроводжує кожну транзакцію до Success, Failed або Replaced, а не лише до першого підтвердження.',
        facts: {
          'own-wallets': 'Гаманці підключаються через конектори wagmi та WalletConnect.',
          'no-vendor-keys': 'Немає вбудованих гаманців.',
          'no-vendor-accounts': 'Клієнтська бібліотека: жодних облікових записів користувачів.',
          'oss-client': 'MIT.',
          'oss-backend': 'Власного бекенду немає; сесії WalletConnect проходять через релей Reown.',
          'no-vendor-key': 'getDefaultConfig вимагає projectId із WalletConnect Cloud (Reown).',
          'free-to-ship': 'MIT, безкоштовно.',
          'no-mau-billing': 'Немає оплати за використання.',
          'free-self-host': 'Бібліотека не має серверної частини.',
          'tracks-to-final':
            'Зареєстровані транзакції показуються до підтвердження; заміна транзакцій не задокументована.',
          'survives-reload': 'Останні транзакції зберігаються в localStorage.',
          'status-webhooks': 'Лише клієнтська частина.',
          'email-social': 'Не надається.',
          'embedded-wallets': 'Не надається.',
          'gas-or-onramp': 'Не надається.',
          evm: 'Побудовано на wagmi.',
          solana: 'Лише EVM.',
          'other-chains': 'Лише EVM.',
        },
      },
      connectkit: {
        summary: 'React-модалка підключення для EVM від Family на базі wagmi з опціональними Family Accounts.',
        license: 'BSD-2-Clause',
        pricingText:
          'Безкоштовно (BSD-2-Clause), включно з Family Accounts. Для WalletConnect потрібен безкоштовний Reown project ID.',
        chooseWhen:
          'Вам потрібна кастомізована EVM-модалка та реєстрація через email або телефон за допомогою Family Accounts.',
        tuwaDifference:
          'TUWA ніколи не створює сторонній акаунт для ваших користувачів, підтримує Solana разом із EVM і додає відстеження транзакцій (Pulsar) та self-hosted бекенд (Quasar).',
        facts: {
          'own-wallets': 'Гаманці підключаються через конектори wagmi та WalletConnect.',
          'no-vendor-keys':
            'Family Accounts (увімкнені за замовчуванням, вимикаються через enableFamily: false) — це гаманці на інфраструктурі Family.',
          'no-vendor-accounts':
            'Користувачі, які реєструються через Family Accounts, отримують акаунт у сервісі Family.',
          'oss-client': 'BSD-2-Clause.',
          'oss-backend':
            'Власного бекенду немає; Family Accounts та WalletConnect працюють на серверах Family і Reown.',
          'no-vendor-key': 'Параметр walletConnectProjectId є обов’язковим.',
          'free-to-ship': 'Безкоштовно; інтеграція Family Accounts також безкоштовна.',
          'no-mau-billing': 'Немає оплати за використання.',
          'free-self-host': 'Бібліотека не має власного сервера для хостингу.',
          'tracks-to-final': 'Не задокументовано.',
          'survives-reload': 'Не задокументовано.',
          'status-webhooks': 'Лише клієнтська частина.',
          'email-social': 'Реєстрація через email або телефон за допомогою Family Accounts.',
          'embedded-wallets': 'Family Accounts, захищені ключем доступу (passkey) або паролем.',
          'gas-or-onramp': 'Не задокументовано.',
          evm: 'Побудовано на wagmi.',
          solana: 'Лише EVM.',
          'other-chains': 'Лише EVM.',
        },
      },
      appkit: {
        summary: 'Модалка підключення з входом через email і соцмережі, онрампом і свопами від команди WalletConnect.',
        license: 'Reown Community License',
        pricingText:
          'Безкоштовно до 500 MAU та 2.5M RPC-запитів на місяць; Pro від $89/міс (7 500 MAU), далі $0.05 за кожного MAU.',
        chooseWhen:
          'Вам потрібні вхід через email і соцмережі, онрамп і підтримка Bitcoin від одного вендора, а умови ліцензії Reown підходять вашому масштабу.',
        tuwaDifference:
          'TUWA поширюється під Apache-2.0 без лімітів використання та обов’язкового шлюзу і не стягує жодної плати за користувача.',
        facts: {
          'own-wallets': 'Браузерні та мобільні гаманці через WalletConnect.',
          'no-vendor-keys': 'Email- та соціальні гаманці створюються й захищаються сервісом Magic.',
          'no-vendor-accounts': 'Користувачі email, соцмереж та SIWX враховуються як MAU в панелі Reown.',
          'oss-client':
            'Код доступний під Reown Community License (не є ліцензією OSI); права на модифікації передаються Reown.',
          'oss-backend': 'Ліцензія вимагає, щоб кожне використання підключалося до пропрієтарного шлюзу Reown.',
          'no-vendor-key': 'Потрібен projectId з панелі Reown; стандартний ID із CLI працює лише на localhost.',
          'free-to-ship': 'Тариф Starter: безкоштовно до 500 MAU та 2.5M RPC-запитів на місяць.',
          'no-mau-billing':
            'Платні плани тарифікуються за MAU; понад 500 MAU або 2.5M RPC-запитів на місяць потрібна комерційна ліцензія.',
          'free-self-host': 'Використання мережі Reown є обов’язковим.',
          'tracks-to-final': 'Не входить до функцій AppKit.',
          'survives-reload': 'Не входить до функцій AppKit.',
          'status-webhooks': 'Не входить до функцій AppKit.',
          'email-social': 'Вхід через email та соціальні мережі.',
          'embedded-wallets': 'Universal Wallets від Magic.',
          'gas-or-onramp': 'Фіатний онрамп та свопи на EVM.',
          evm: 'Мережі EVM.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin.',
        },
      },
      privy: {
        summary: 'Вбудовані гаманці та автентифікація користувачів як керований хмарний сервіс.',
        license: 'Apache-2.0 SDK, керований сервіс',
        pricingText:
          'Безкоштовно до 499 MAU; Scale $299/міс (500–2 499 MAU); понад 10 000 MAU — $2 000 + $0.05 за MAU.',
        chooseWhen:
          'Більшість ваших користувачів не мають криптогаманця, і вам потрібні вхід через email/соцмережі, вбудовані гаманці, спонсорування газу та багато мереж у форматі керованого сервісу.',
        tuwaDifference:
          'TUWA залишає користувачів із їхніми власними гаманцями, а ваші сесії — на вашому сервері (SIWX, CAIP-122), без оплати за кожного користувача та без довіри стороннім анклавам.',
        facts: {
          'own-wallets': 'Гаманці Ethereum і Solana можуть входити поряд із вбудованими гаманцями.',
          'no-vendor-keys': 'Вбудовані гаманці захищені апаратними анклавами (TEE) на інфраструктурі Privy.',
          'no-vendor-accounts': 'Кожен користувач є користувачем Privy і тарифікується як MAU.',
          'oss-client': '@privy-io/react-auth опубліковано під Apache-2.0 без публічного репозиторію.',
          'oss-backend': 'Лише керований хмарний сервіс.',
          'no-vendor-key': 'Потрібен appId із панелі керування Privy.',
          'free-to-ship': 'Безкоштовно до 499 MAU.',
          'no-mau-billing': '$299/міс від 500 MAU; $0.05 за кожного MAU понад 10 000.',
          'free-self-host': 'Лише керований сервіс.',
          'tracks-to-final': 'Події transaction.broadcasted та transaction.confirmed для транзакцій гаманців Privy.',
          'survives-reload': 'Не задокументовано.',
          'status-webhooks': 'Для гаманців Privy; на сторінці тарифів вебхуки вказані в плані Enterprise.',
          'email-social': 'Email, SMS, passkey, соцмережі та будь-який OAuth-провайдер.',
          'embedded-wallets': 'Вбудовані гаманці для кожного користувача.',
          'gas-or-onramp': 'Спонсорування газу через пеймастер та онрамп із карток або банків.',
          evm: 'Ethereum та EVM-мережі.',
          solana: 'Solana та SVM-мережі.',
          'other-chains': 'Bitcoin, Cosmos, TON, Sui, Tron та інші мережі на різних рівнях підтримки.',
        },
      },
      dynamic: {
        summary: 'Автентифікація та вбудовані MPC-гаманці як керований хмарний сервіс.',
        license: 'MIT SDK, керований сервіс',
        pricingText: 'Безкоштовно до 1 000 MAU, далі $0.05 за MAU; $249/міс до 5 000 MAU.',
        chooseWhen:
          'Вам потрібні вбудовані гаманці на найширшому переліку мереж із корпоративними політиками та делегованим доступом у форматі керованого сервісу.',
        tuwaDifference:
          'TUWA ніколи не зберігає частку приватного ключа: користувачі підписують власними гаманцями, сесії залишаються на вашому сервері, а плата за користувача відсутня.',
        facts: {
          'own-wallets': 'Користувачі можуть увійти, підключивши власний гаманець.',
          'no-vendor-keys': 'Гаманці TSS-MPC: Dynamic зберігаєверну частку ключа і координує підписання.',
          'no-vendor-accounts': 'Кожен користувач є користувачем Dynamic і тарифікується як MAU.',
          'oss-client': '@dynamic-labs/sdk-react-core опубліковано під MIT без публічного репозиторію.',
          'oss-backend': 'Лише керований хмарний сервіс.',
          'no-vendor-key': 'Потрібен environmentId із панелі керування.',
          'free-to-ship': 'Безкоштовно до 1 000 MAU.',
          'no-mau-billing': '$0.05 за кожного MAU понад 1 000.',
          'free-self-host': 'Лише керований сервіс.',
          'tracks-to-final': 'wallet.activity повідомляє про підтверджену активність вбудованих гаманців.',
          'survives-reload': 'Не задокументовано.',
          'status-webhooks': 'Вебхуки wallet.activity для вбудованих гаманців.',
          'email-social': 'Реєстрація через email, SMS, соцмережі та passkey.',
          'embedded-wallets': 'Вбудовані MPC-гаманці.',
          'gas-or-onramp': 'Спонсорування газу для вбудованих гаманців.',
          evm: 'Усі EVM-мережі.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin, Sui, TON, Stellar, Tron та інші.',
        },
      },
      thirdweb: {
        summary: 'Універсальна платформа: in-app гаманці, API транзакцій, RPC, спонсорування газу та смарт-контракти.',
        license: 'Apache-2.0 SDK, хмарний бекенд',
        pricingText:
          'Тарифи від $99/міс; гаманці користувачів — $0.015 за MAU після першої 1 000; 2.5% комісії за спонсорований газ у mainnet.',
        chooseWhen:
          'Вам потрібен один вендор для in-app гаманців, серверних гаманців, спонсорування газу, RPC та деплою контрактів, і підписка вписується у ваш бюджет.',
        tuwaDifference:
          'Pulsar відстежує транзакції з будь-якого гаманця в браузері, а Quasar додає історію та вебхуки як у хмарі, так і у безкоштовній Apache-2.0 Community Edition.',
        facts: {
          'own-wallets': 'Зовнішні гаманці поряд із внутрішніми in-app гаманцями.',
          'no-vendor-keys':
            'In-app гаманці генеруються і використовуються всередині AWS Nitro Enclaves під управлінням thirdweb.',
          'no-vendor-accounts': 'Користувачі in-app гаманців тарифікуються за MAU.',
          'oss-client': 'Apache-2.0.',
          'oss-backend': 'Self-hosted Engine v2 (Apache-2.0) заархівовано; Transactions працює у thirdweb Cloud.',
          'no-vendor-key': 'Client ID у браузері та секретний ключ на сервері.',
          'free-to-ship': 'Платні плани починаються від $99/міс.',
          'no-mau-billing': '$0.015 за кожного MAU користувацького гаманця після першої 1 000.',
          'free-self-host': 'Engine v2 заархівовано.',
          'tracks-to-final': 'Транзакції, відправлені через Transactions API від thirdweb, із таймлайнами.',
          'survives-reload': 'Не задокументовано.',
          'status-webhooks': '1 000 доставок включено, далі $0.10 за кожні 1 000.',
          'email-social': 'Вхід через email, телефон та соцмережі.',
          'embedded-wallets': 'In-app гаманці.',
          'gas-or-onramp': 'Спонсорування газу.',
          evm: 'Понад 2 500 EVM-мереж.',
          solana: 'Серверні гаманці та API для Solana.',
          'other-chains': 'Не задокументовано.',
        },
      },
      alchemy: {
        summary: 'Платформа RPC та даних із Wallet API для смарт-гаманців і спонсорування газу.',
        license: 'MIT SDK, хмарний бекенд',
        pricingText: 'Безкоштовно: 30M compute units на місяць; pay-as-you-go від $0.525 за 1M compute units.',
        chooseWhen:
          'Ви вже використовуєте RPC від Alchemy і потребуєте спонсорування газу та смарт-гаманців (EIP-7702) на EVM і Solana.',
        tuwaDifference:
          'Pulsar відстежує будь-яку транзакцію (а не лише виклики через один API), зберігає незавершені транзакції після перезавантаження, а Quasar можна запустити на власних серверах.',
        facts: {
          'own-wallets': 'Wallet API працюють із будь-яким гаманцем або системою управління ключами.',
          'no-vendor-keys':
            'Власний підписувач Alchemy (Account Kit) застарів; ключі надаються вашим провайдером підпису.',
          'no-vendor-accounts': 'Вхід перенесено до провайдерів підпису; Wallet API працюють безпосередньо з адресами.',
          'oss-client': 'aa-sdk: MIT.',
          'oss-backend': 'RPC, бандлер і пеймастер є пропрієтарними хмарними сервісами.',
          'no-vendor-key': 'API-ключ у кожному URL запиту.',
          'free-to-ship': 'Безкоштовно: 30M compute units на місяць.',
          'no-mau-billing': 'Тарифікація за обчислювальні одиниці (compute units), а не за користувачів.',
          'free-self-host': 'Лише хмара.',
          'tracks-to-final': 'wallet_getCallsStatus — для викликів, відправлених через Wallet API.',
          'survives-reload': 'Не задокументовано.',
          'status-webhooks':
            'Вебхуки Address Activity та Custom повідомляють про ончейн-активність, а не про життєвий цикл конкретної відправленої транзакції.',
          'email-social': 'Вхід через Account Kit застарів; Alchemy рекомендує Privy.',
          'embedded-wallets': 'Вбудовані гаманці Account Kit застаріли; Alchemy рекомендує Privy.',
          'gas-or-onramp': 'Спонсорування газу на EVM, спонсорування комісій та ренти на Solana.',
          evm: 'Мережі EVM.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin, Sui, Aptos та інші через Chain API.',
        },
      },
      'the-graph': {
        summary: 'Децентралізований протокол, що індексує події смарт-контрактів у GraphQL API (сабграфи).',
        license: 'Apache-2.0 / MIT',
        pricingText:
          '100 000 безкоштовних запитів на місяць, далі $2 за 100 000; self-hosted Graph Node — безкоштовний.',
        chooseWhen:
          'Вам потрібно робити вибірки подій і стану смарт-контрактів серед усіх користувачів. Це задача індексації, відмінна від супроводу транзакцій вашого застосунку; багато команд використовують обидва інструменти разом.',
        tuwaDifference:
          'Quasar не індексує сторонні контракти: він відстежує конкретні транзакції, які користувачі чи ваш сервер відправляють із застосунку, зберігає їхню історію за гаманцем і надсилає вебхуки.',
        facts: {
          'own-wallets': 'Індексатор: він не підключає гаманці.',
          'no-vendor-keys': 'Не працює з ключами користувачів.',
          'no-vendor-accounts': 'Не веде облікових записів ваших користувачів.',
          'oss-client': 'graph-cli та graph-ts: Apache-2.0 або MIT.',
          'oss-backend': 'Graph Node: Apache-2.0, підтримує self-hosting.',
          'no-vendor-key':
            'Self-hosted Graph Node не потребує ключа; децентралізована мережа приймає API-ключ із Subgraph Studio.',
          'free-to-ship': '100 000 безкоштовних запитів на місяць.',
          'no-mau-billing': 'Оплата за кількість запитів.',
          'free-self-host': 'Graph Node має відкритий вихідний код.',
          'tracks-to-final': 'Індексує події контрактів, а не життєвий цикл транзакцій, які відправляє ваш застосунок.',
          'survives-reload': 'Не є клієнтським інструментом.',
          'status-webhooks': 'Обслуговує GraphQL-запити; немає вебхуків статусу відправлених транзакцій.',
          'email-social': 'Не його задача.',
          'embedded-wallets': 'Не його задача.',
          'gas-or-onramp': 'Не його задача.',
          evm: 'Ethereum та багато EVM-мереж.',
          solana: 'Solana.',
          'other-chains': 'Bitcoin, NEAR, Starknet, Stellar, TRON та інші.',
        },
      },
    },
  },
  configurator: {
    badge: 'Інтерактивно',
    titlePrefix: 'Конфігуратор',
    titleHighlight: 'Конфігуратор',
    description:
      'Оберіть фреймворк, блокчейни та функції, щоб отримати команду встановлення, готові файли налаштування й найближчий стартовий шаблон — або скопіюйте весь стек як промпт для ШІ-агента.',
    form: {
      framework: 'Фреймворк',
      chains: 'Блокчейни',
      chainsHint: 'Оберіть один або обидва',
      ui: 'Інтерфейс (UI)',
      uiVanillaHint: 'Headless-стори (Nova призначена для React)',
      uiNova: 'Nova UI Kit',
      uiHeadless: 'Власний UI (headless)',
      authBackend: 'Автентифікація та бекенд',
      siwxLabel: 'Вхід SIWX (CAIP-122)',
      siwxTooltipLabel: 'Про вхід SIWX',
      siwxTooltip:
        'Sign-In With X (CAIP-122): гаманець один раз підписує повідомлення, а ваш сервер встановлює сесійний HttpOnly cookie. Підтримує EOA, смарт-гаманці EIP-1271, ще не розгорнуті акаунти ERC-6492 та Solana ed25519.',
      quasarLabel: 'Синхронізація та вебхуки Quasar',
      quasarTooltipLabel: 'Про синхронізацію та вебхуки Quasar',
      quasarTooltip:
        'Синхронізує кожну транзакцію Pulsar із Quasar (Cloud або self-hosted Community Edition), щоб відстеження тривало на сервері, історія синхронізувалася між пристроями, а ваш бекенд отримував вебхуки з підписом HMAC-SHA256.',
      quasarHint: 'Автоматично вмикає SIWX: Quasar синхронізує транзакції авторизованих гаманців',
    },
    steps: {
      step1Title: '1. Ваш стек',
      copyShareLink: 'Скопіювати посилання на конфігурацію',
      linkCopied: 'Посилання скопійовано',
      tryInPlayground: 'Спробувати в Пісочниці',
      copyPromptForAi: 'Скопіювати промпт для ШІ',
      promptCopied: 'Промпт скопійовано',
      promptTitle: 'Скопіювати стек як промпт для Claude Code, Cursor або іншого ШІ-агента',
      step2Title: '2. Встановлення',
      devPackagesLabel: 'Інструменти та dev-залежності',
      copyDevPackages: 'Скопіювати команду встановлення dev-пакетів',
      step3Title: '3. Файли налаштування ({count})',
      setupFilesAria: 'Згенеровані файли налаштування',
      step4Title: '4. Запуск проєкту',
      closestTemplate: 'Найближчий стартовий шаблон',
      cloneWithTiged: 'Або склонуйте його через tiged',
      copyCloneCommand: 'Скопіювати команду клонування',
      guidesForStack: 'Посібники для цього стеку',
    },
    templateNotes: {
      'No template uses Vanilla TypeScript: the files below are the whole setup.':
        'Для Vanilla TypeScript окремий шаблон не потрібен: наведені вище файли містять усе налаштування.',
      'The closest template: EVM and Solana with Nova, without a server. The files below add the rest.':
        'Найближчий шаблон: EVM та Solana з Nova без сервера. Згенеровані вище файли додають решту функцій.',
      'Matches your stack: EVM and Solana with Nova Connect and Nova Transactions.':
        'Повністю відповідає вашому стеку: EVM та Solana з Nova Connect і Nova Transactions.',
      'The full stack: SIWX, Quasar sync and history, webhooks.':
        'Повний стек: вхід SIWX, синхронізація та історія Quasar, вебхуки.',
      'EVM only, with SIWX sign-in.': 'Лише EVM, із входом SIWX.',
      'Solana only, with SIWX sign-in and a Codama program.':
        'Лише Solana, із входом SIWX та клієнтом програми Codama.',
      'The closest template: it uses Nova; the files below replace it with your own UI.':
        'Найближчий шаблон: він використовує Nova, а наведені вище файли замінюють її на ваш власний UI.',
      'EVM and Solana with Nova Connect and Nova Transactions.': 'EVM та Solana з Nova Connect і Nova Transactions.',
    },
    commandLabels: {
      'Create the app': 'Створити застосунок',
      'Run the API next to Vite': 'Запустити API-сервер поряд із Vite',
      'Relay Quasar webhooks to localhost': 'Пересилати вебхуки Quasar на localhost',
    },
    guideTitles: {
      'Full-Stack React App': 'Full-Stack React застосунок',
      'Transaction Tracking in React': 'Відстеження транзакцій у React',
      'Satellite Connect without React': 'Satellite Connect без React',
      'Pulsar trackers standalone': 'Автономні трекери Pulsar',
      'Multi-Chain Auth with SIWX': 'Мультичейн-автентифікація з SIWX',
      'Sync Transactions to Quasar': 'Синхронізація транзакцій із Quasar',
      'Quasar Webhooks': 'Вебхуки Quasar',
      'TUWA_AGENTS.md': 'TUWA_AGENTS.md',
      'Sovereign Account Abstraction (ERC-4337)': 'Некастодіальна абстракція акаунтів (ERC-4337)',
      'Why Web3 Tx State is Broken': 'Чому стан Web3-транзакцій зламаний',
      'Self-Hosting': 'Self-Hosting (Community Edition)',
      Quasar: 'Quasar',
      'Choose Your Packages': 'Оберіть свої пакети',
    },
  },
  playground: {
    badge: 'Інтерактивно',
    titlePrefix: 'Пісочниця',
    titleHighlight: 'TUWA',
    description:
      'Запустіть Satellite Connect, SIWX, Pulsar, Nova UI Kit та Quasar прямо в браузері з симульованим гаманцем і блокчейном. Тестуйте підтвердження, реверти, пришвидшення, перезавантаження сторінки та перехід між пристроями, спостерігаючи за станом сторів і подіями.',
    controls: {
      stackHeading: '1. Стек',
      chains: 'Блокчейни',
      chainsHint: 'Оберіть один або обидва',
      ui: 'Інтерфейс (UI)',
      uiNova: 'Nova UI Kit',
      uiHeadless: 'Headless',
      authBackend: 'Автентифікація та бекенд',
      siwxLabel: 'Вхід SIWX',
      siwxInfoLabel: 'Про вхід SIWX',
      siwxInfo:
        'Просить гаманець підписати повідомлення CAIP-122 під час підключення (Nova) або за кнопкою (Headless). Симульований сервер перевіряє підпис, використовує одноразовий нонс і зберігає сесію.',
      quasarLabel: 'Синхронізація та історія Quasar',
      quasarInfoLabel: 'Про синхронізацію та історію Quasar',
      quasarInfo:
        'Синхронізує транзакції авторизованого гаманця із симульованим Quasar Cloud, завантажує хмарну історію при підключенні та надсилає підписаний вебхук у вкладку «Події» після фіналізації транзакції.',
      scenarioHeading: '2. Сценарій',
      txOutcome: 'Результат транзакції',
      outcomeInfoLabel: 'Про результати транзакцій',
      outcomeInfo:
        'Визначає, як симульований блокчейн завершить наступну транзакцію на сцені. Оберіть результат і натисніть Mint NFT, Swap або Stake.',
      outcomes: {
        succeed: { label: 'Успіх', hint: '3 підтвердження → Success' },
        fail: { label: 'Реверт', hint: 'Помилка ончейн → Failed' },
        replace: { label: 'Пришвидшення (EVM)', hint: 'Заміна новим хешем → Replaced' },
        cancel: { label: 'Скасування (EVM)', hint: 'Переказ 0 ETH собі з тим самим nonce → Replaced' },
        reject: { label: 'Відмова в гаманці', hint: 'Користувач відхиляє запит у гаманці' },
      },
      latency: 'Затримка підтвердження',
      fast: 'Швидко (~1.5 с)',
      realistic: 'Реалістично (~5 с)',
      multiDevice: 'Кілька пристроїв',
      multiDeviceInfoLabel: 'Про режим кількох пристроїв',
      multiDeviceInfo:
        'Симулює відкриття вашого dApp на другому ноутбуці чи телефоні з порожнім localStorage. Коли увімкнено Quasar, підключіться й увійдіть тим самим гаманцем, щоб побачити його хмарну історію та продовжити відстеження незавершених транзакцій.',
      openAnotherDevice: 'Відкрити на іншому пристрої',
      openAnotherDeviceHint:
        'Увімкніть Quasar, щоб побачити, як історія та незавершені транзакції переносяться на новий пристрій.',
      resetPlayground: 'Скинути пісочницю',
    },
    stage: {
      stageBadge: 'Сцена',
      simulatedLabel: 'Симульовані гаманці та мережа',
      reloadStage: 'Оновити сцену',
      reloadStageTitle: 'Перемонтувати сцену: незавершені транзакції відновляться з localStorage',
      walletModalLabel: 'Підтвердження в симульованому гаманці',
      walletExtension: 'Розширення гаманця',
      signInRequest: 'Запит на вхід',
      txRequest: 'Запит на транзакцію',
      messageToSign: 'Повідомлення для підпису',
      signingWith: 'Підписання симульованим гаманцем у мережі {family}.',
      reject: 'Відхилити',
      confirm: 'Підтвердити',
      sign: 'Підписати',
      novaHeaderSubtitle: 'Мінтіть, обмінюйте та стейкайте в симульованій мережі',
      novaConnectedHint:
        'Відправте транзакцію та спостерігайте, як Pulsar відстежує її у сповіщеннях, модальному вікні та історії.',
      novaConnectHint: 'Підключіть гаманець, щоб відправляти транзакції.',
      novaConnectAndSignInHint: 'Підключіть гаманець і увійдіть, щоб відправляти транзакції.',
      historyHeading: 'Історія',
      historyAria: 'Історія транзакцій',
      headlessSubtitle: 'Без Nova UI Kit: це власний інтерфейс застосунку поверх сторів Satellite, SIWX та Pulsar.',
      networkAria: 'Мережа',
      disconnect: 'Відключити',
      signedInWithSiwx: 'Авторизовано через SIWX',
      signOut: 'Вийти',
      signInWithSiwx: 'Увійти через SIWX',
      noTransactionsYet: 'Транзакцій ще немає.',
      syncedToQuasar: 'синхронізовано з Quasar',
      syncPending: 'очікує синхронізації',
      actions: {
        MINT: {
          label: 'Смінтити NFT',
          title: ['Мінтинг Orbit #42', 'Orbit #42 смінчено', 'Помилка мінтингу', 'Мінтинг замінено'],
          description: [
            'Мінтинг NFT із колекції TUWA Orbits',
            'Orbit #42 вже у вашому гаманці',
            'Транзакція мінтингу не пройшла',
            'Інша транзакція зайняла її місце',
          ],
        },
        SWAP: {
          label: 'Обмін (Swap)',
          title: ['Обмін 100 USDC', 'Обмін завершено', 'Помилка обміну', 'Обмін замінено'],
          description: [
            'Обмін 100 USDC на нативний токен мережі',
            '100 USDC успішно обміняно',
            'Транзакція обміну не пройшла',
            'Інша транзакція зайняла її місце',
          ],
        },
        STAKE: {
          label: 'Стейкінг (Stake)',
          title: ['Стейкінг 1.5 токенів', 'Застейкано', 'Помилка стейкінгу', 'Стейкінг замінено'],
          description: [
            'Блокування 1.5 токенів у пулі стейкінгу',
            '1.5 токенів успішно застейкано',
            'Транзакція стейкінгу не пройшла',
            'Інша транзакція зайняла її місце',
          ],
        },
      },
    },
    inspector: {
      tabsAria: 'Інспектор',
      tabs: {
        events: 'Події',
        state: 'Стан',
        customize: 'Кастомізація',
        code: 'Код',
      },
      events: {
        clear: 'Очистити',
        empty: 'Поки що порожньо: підключіть гаманець на сцені та відправте транзакцію.',
      },
      state: {
        quasarSource: 'хмарна історія (симуляція)',
        walletTitle: 'Розширення гаманця',
        walletSource: 'симуляція',
      },
      customize: {
        intro:
          'Nova UI Kit налаштовується пошарово — від CSS-змінних до ваших власних компонентів. Кожен перемикач вказує проп, який він змінює; готові файли доступні у вкладці «Код».',
        headlessNotice:
          'Headless-сцена використовує лише CSS-змінні теми. Перемкніть UI на Nova UI Kit, щоб побачити інші рівні кастомізації.',
        themeLayer: 'Тема',
        styleLayer: 'Стиль',
        componentsLayer: 'Компоненти',
        textsLayer: 'Тексти',
        behaviorLayer: 'Поведінка',
        languageLabel: 'Мова',
        connectTextLabel: 'Текст кнопки підключення',
        toastPositionLabel: 'Позиція спливаючих сповіщень',
        resetNova: 'Скинути до стандартних налаштувань Nova',
        copyCss: 'Копіювати CSS',
        cssCopied: 'CSS скопійовано',
        resetEdits: 'Скинути зміни',
        editedSuffix: 'змінено',
        themeGroups: {
          Surfaces: 'Поверхні',
          Text: 'Текст',
          Buttons: 'Кнопки',
          Statuses: 'Статуси',
          Shape: 'Форма та рамки',
        },
        themePresets: {
          'default-dark': {
            label: 'Default Dark',
            description: 'Стандартна темна тема Nova UI Kit.',
          },
          'clean-light': {
            label: 'Clean Light',
            description: 'Стандартна світла тема Nova UI Kit.',
          },
          cyberpunk: {
            label: 'Cyberpunk',
            description: 'Неонова маджента й ціан на глибокому фіолетовому тлі з гострими кутами.',
          },
          minimalist: {
            label: 'Minimalist',
            description: 'Монохромний цинк, колір лише для статусів і тонкі контури.',
          },
          'isometric-light': {
            label: 'Isometric Light',
            description: 'Чорне креслення на білому тлі з гострими кутами. Автоматично вмикає стиль Isometric.',
          },
          'isometric-dark': {
            label: 'Isometric Dark',
            description: 'Ізометричне креслення на темно-синьому тлі приглушеними лініями. Вмикає стиль Isometric.',
          },
        },
        styleKits: {
          nova: { label: 'Nova', description: 'Стандартні класи, з якими постачається Nova UI Kit.' },
          mono: {
            label: 'TUWA Mono',
            description: 'Моноширинний шрифт, окреслені поверхні та акцентні кільця на кожному елементі.',
          },
          iso: {
            label: 'Isometric',
            description: 'Креслення з об’ємними гранями для карток і кнопок та верхньою лінією на модальних вікнах.',
          },
        },
        flags: {
          historyIcons: 'Іконки за типом транзакції в історії',
          confirmationsBar: 'Шкала підтверджень у спливаючих сповіщеннях',
          emptyHistory: 'Ілюстрована порожня історія',
          withBalance: 'Баланс у кнопці підключення',
          withChain: 'Селектор мережі',
          popularWallet: 'Nebula Wallet у групі «Популярні»',
          legalLinks: 'Посилання на умови та конфіденційність',
          trackingModal: 'Модальне вікно відстеження після відправлення',
          autoCloseToasts: 'Автоматично закривати сповіщення через 5 секунд',
          logButtonClicks: 'Логувати кліки по кнопці підключення у вкладку «Події»',
        },
      },
      code: {
        introPart1: 'Сцена запускає ці стори TUWA та компоненти Nova із симульованими адаптерами замість ',
        introPart2: ' та ',
        introPart3:
          ' і їхніх аналогів для Solana. Ось цей самий стек для вашого реального застосунку зі справжніми гаманцями.',
        stackSetup: 'Налаштування стеку',
        setupFilesAria: 'Файли налаштування',
        novaCustomization: 'Кастомізація Nova',
        themeHeading: 'Тема',
        importThemeNote: 'Імпортуйте файл теми після базових стилів Nova.',
        passObjectsNote:
          'Передайте об’єкти з customization.tsx у провайдери та компоненти Nova, як показано в перших рядках файлу.',
        customizationFilesAria: 'Файли кастомізації',
        openInConfigurator: 'Відкрити в Конфігураторі стеку',
        openInStackblitz: 'Відкрити шаблон Vite у StackBlitz',
      },
    },
  },
  policies: {
    badge: 'Правова інформація та безпека',
    title: 'Політики',
    description:
      'Умови використання, повідомлення про конфіденційність, угода про обробку даних і політика безпеки для tuwa.io та Quasar Cloud. Кожен документ опубліковано на tuwa.io у форматах HTML, PDF та Markdown.',
    listAria: 'Документи політик',
    read: 'Читати',
    pdf: 'PDF',
    securityContactTitle: 'Контакт з питань безпеки:',
    securityContactText: 'повідомляйте про вразливості на',
    securityContactSuffix: '(область дії та цільовий час реакції описані в Політиці безпеки).',
    legalPrivacyTitle: 'Юридичні питання та приватність:',
    items: {
      terms: {
        title: 'Умови використання',
        description:
          'Правила використання сайтів і документації TUWA, Quasar Cloud, Quasar Community Edition та open-source пакетів.',
      },
      privacy: {
        title: 'Політика конфіденційності',
        description: 'Які дані збирає TUWA і навіщо, як вони захищаються та як отримати до них доступ або видалити їх.',
      },
      cookie: {
        title: 'Політика файлів cookie',
        description: 'Файли cookie та записи Local Storage, які використовують сайти TUWA та панель керування Quasar.',
      },
      refund: {
        title: 'Політика повернення коштів',
        description: 'Коли та як повертаються платежі за квоту Quasar Cloud.',
      },
      security: {
        title: 'Політика безпеки',
        description:
          'Як повідомити про вразливість, що TUWA зобов’язується зробити у відповідь і хто за що відповідає.',
      },
      dpa: {
        title: 'Доповнення щодо обробки даних',
        description:
          'Як ми обробляємо персональні дані користувачів вашого застосунку від вашого імені у Quasar Cloud.',
      },
    },
  },
  notFound: {
    heading: 'Сторінку не знайдено',
    description: 'За цією адресою немає жодної сторінки в центрі документації TUWA.',
    backToMain: 'На головну',
    browseGuides: 'Переглянути посібники',
    destinationsAria: 'Основні розділи документації',
    packageRefHeading: 'Шукаєте довідник конкретного пакета?',
    packageRefDescription: 'Кожна бібліотека TUWA має власний сайт із довідником API та прикладами:',
    destinations: {
      '/': {
        title: 'Головна',
        description: 'Огляд 5-рівневої архітектури екосистеми TUWA та всіх npm-пакетів.',
      },
      '/guides': {
        title: 'Посібники',
        description: 'Покрокові інструкції для React-застосунків, автентифікації SIWX та синхронізації з Quasar.',
      },
      '/quasar': {
        title: 'Quasar',
        description: 'Серверне відстеження транзакцій, вебхуки, довідник API та self-hosting.',
      },
      '/comparisons': {
        title: 'Порівняння',
        description: 'Порівняння TUWA з RainbowKit, AppKit, Privy, Dynamic, thirdweb, Alchemy та The Graph.',
      },
      '/configurator': {
        title: 'Конфігуратор',
        description: 'Оберіть фреймворк, мережі та функції для генерації готових файлів проєкту.',
      },
      '/playground': {
        title: 'Пісочниця',
        description: 'Запустіть повний стек TUWA в браузері із симульованими мережами EVM та Solana.',
      },
    },
  },
  ui: {
    latestReleasePrefix: 'Останній реліз',
    documentationTitle: 'Документація',
    deprecatedBadge: 'Застарілий',
    moreCount: '+{count} ще',
    requiredPeers: 'Обов’язкові peer-залежності',
    optionalPeersHeading: 'Опціональні peer-залежності (встановіть ті, які використовує ваш застосунок)',
    includesHeading: 'Включає (ре-експортовано)',
    usedBy: 'Використовується у',
    clickForDetails: 'Натисніть для деталей',
    clickForInstall: 'Натисніть для команди встановлення з peer-залежностями, посібниками та посиланнями',
    referenceLink: 'Довідник API',
    sourceLink: 'Вихідний код',
    includedInPrefix: 'Входить до складу',
    includedInAnd: ' та ',
    includedInSuffix: ': у застосунку на TUWA SDK імпортуйте його звідти замість окремого встановлення.',
    installsWithPeers:
      'Встановлює пакет разом із його {count} обов’язковими {peerWord} (включно з peer-залежностями пакетів TUWA). ',
    peerSingular: 'peer-залежністю',
    peerPlural: 'peer-залежностями',
    alsoNeedsFrameworkPeers: 'Також потребує {peers} у застосунку.',
    lighterDoesNotImport:
      'не імпортує {peers}: застосунок, який використовує лише цю точку входу, може їх не встановлювати.',
    lighterEntryDescriptions: {
      '@tuwaio/pulsar-evm/safe': 'лише трекер Safe',
    },
    quickStartSteps: {
      step1Title: 'Запустіть команду',
      step1Desc: 'Виконайте інтерактивну CLI-команду в директорії вашого проєкту.',
      step2Title: 'Оберіть шаблон',
      step2Desc: 'Оберіть шаблони React або Next.js для EVM, Solana чи мультичейну.',
      compareTemplates: 'Порівняти шаблони',
      step3Title: 'Починайте розробку',
      step3Desc: 'Запустіть локальний dev-сервер і створюйте некастодіальні Web3-застосунки.',
      aiAgentsBadge: 'ШІ-агенти',
      aiAgentsTitle: 'Посібник з інтеграції для ШІ-асистентів програмування',
    },
    comparisonsExtra: {
      verifiedBadge: 'Перевірено {date}',
      productsCount: '{count} продуктів',
      criteriaCount: '{count} критеріїв',
      radarIntro:
        'Оберіть продукт, щоб накласти його на TUWA. Натисніть на вісь, щоб побачити критерії, з яких складається її оцінка. TUWA — це набір пакетів, а не кастодіальний провайдер гаманців, тому кожен продукт порівнюється з тими проєктами TUWA, які виконують ту саму задачу:',
      criteriaIntro:
        'Усі {count} критеріїв, що лежать в основі радара, для всіх продуктів одночасно. Наведіть курсор на позначку, щоб побачити примітку; номер веде до першоджерела.',
      chooseInsteadIntro:
        'Жоден інструментарій не підходить для кожного застосунку. Ось випадки, коли інший продукт є кращим вибором, і чим TUWA відрізняється у виконанні тієї самої задачі.',
      methodologyIntro: 'Як обчислюються бали, що означають позначки та звідки походить кожен факт.',
      readyHeading: 'Готові спробувати?',
      startFromTemplate: 'Почати з шаблону',
      fullStackGuide: 'Full-Stack посібник',
      compareTuwaWith: 'Порівняти TUWA з',
      radarAxesAria: 'Осі радара',
      favorsHostedOnboarding:
        'Хмарні платформи лідирують тут за задумом: TUWA підключає гаманці, які вже є у користувачів, і ніколи не створює та не зберігає гаманці замість них.',
      favorsHostedChains:
        'Сервіси вбудованих гаманців наразі охоплюють більше сімейств блокчейнів. TUWA підтримує EVM та Solana; Starknet, Tron, Bitcoin і TON — наступні у дорожній карті.',
      tuwaCounterpartLabel: 'Відповідник у TUWA',
      scoringHeading: 'Підрахунок балів',
      scoringBodyPart1: 'Кожна вісь має {count} критеріїв «так/ні», наведених у таблиці вище. Продукт отримує ',
      scoringBodyPart2:
        ' балів на осі. Жодні ваги не коригуються вручну: сторінка автоматично обчислює кожну оцінку безпосередньо з фактів.',
      markMetLead: 'Виконано:',
      markMetBody: ' вендор офіційно документує це для продукту в цілому.',
      markPartialLead: 'Частково:',
      markPartialBody:
        ' лише для частини гаманців, транзакцій чи тарифних планів, або лише за умови вимкнення опціональної функції.',
      markNoLead: 'Не виконано:',
      markNoBody:
        ' відсутнє, виходить за межі призначення продукту або не задокументовано (на дату перевірки ми не знайшли згадки в документації вендора).',
      whatWeCompareHeading: 'Що саме ми порівнюємо',
      whatWeCompareBody:
        'Продукт оцінюється у тому вигляді, в якому вендор пропонує його за замовчуванням, включно з опціональними функціями. TUWA — це набір пакетів, тому кожен конкурент порівнюється з тими проєктами TUWA, що виконують ту саму задачу; радар показує весь стек. Дві осі — Онбординг та Покриття мереж — за задумом надають перевагу хмарним платформам, і ми зберігаємо їх для чесної картини.',
      transparencyPart1:
        'Цю сторінку підготувала команда TUWA. Кожен факт перевірено {date} за першоджерелами: документацією вендорів, ліцензіями на GitHub та npm і сторінками тарифів. Ми оновлюємо дані щокварталу. Усі дані зберігаються в ',
      transparencyFileLink: 'одному типізованому файлі',
      transparencyPart2: '; якщо щось застаріло або містить неточність, ',
      transparencyIssueLink: 'створіть issue',
      transparencyPart3: ', і ми це виправимо.',
      sourcesHeading: 'Джерела',
    },
    configuratorExtra: {
      subtitle:
        'Оберіть фреймворк, мережі та функції. Отримайте команду встановлення, усі файли налаштування та найближчий стартовий шаблон. Кожна з {count} комбінацій стеку автоматично перевіряється тайпчекером проти опублікованих пакетів.',
      frameworkHints: {
        next: 'App Router із серверними route-хендлерами',
        vite: 'Клієнтський застосунок; серверні частини працюють на будь-якому Fetch API рантаймі',
        vanilla: 'Без React: стори TUWA та ваш власний DOM-код',
      },
      chainsHintFull: 'Кожне сімейство мереж додає власний аддон; застосунок ніколи не бандлить зайвого.',
      uiHintVanilla: 'Nova UI Kit складається з React-компонентів; у Vanilla TS інтерфейс повністю ваш.',
      uiHintNova: 'Модальні вікна Nova Connect і тости Nova Transactions зі стилізацією через CSS-змінні.',
      uiHintHeadless: 'Ваші власні компоненти поверх сторів Satellite та Pulsar.',
      featuresLabel: 'Функції',
      featuresHintQuasar: 'Quasar синхронізує транзакції авторизованого гаманця, тому автоматично вмикає SIWX.',
      featuresHintDefault:
        'SIWX авторизує користувачів їхнім гаманцем (CAIP-122); Quasar додає міжпристроєву історію та вебхуки.',
      siwxChoice: 'Вхід SIWX',
      quasarChoice: 'Синхронізація Quasar',
      fastestStart: 'Найшвидший старт: готовий шаблон',
      starterTemplate: 'Стартовий шаблон',
      runCommandAndPick: 'Виконайте команду та оберіть ',
      orAddToExisting: 'Або додайте TUWA до нового чи існуючого застосунку на {framework}:',
      peersIncluded: 'Обов’язкові peer-залежності вже включено',
      sdkBringsProjects: '; пакет SDK сам підтягує проєкти TUWA',
      addFilesTitle: 'Додайте файли ({count})',
      runStepTitle: 'Запустіть',
      readNext: 'Читати далі',
    },
    playgroundExtra: {
      subnote:
        'Справжні стори TUWA та компоненти Nova працюють у вашому браузері на симульованих гаманцях та симульованому блокчейні: нічого не підписується і не відправляється в реальну мережу.',
      loadingAria: 'Завантаження Пісочниці',
      connectButtonGroup: 'Кнопка підключення',
      minimal: 'Мінімальна',
      full: 'Повна',
      nextTxGroup: 'Наступна транзакція',
      nextTxShort: 'Наст. tx',
      speedGroup: 'Швидкість',
      signaturesGroup: 'Підписи гаманця',
      approve: 'Підтверджувати',
      reject: 'Відхиляти',
      quasarGroup: 'Quasar',
      online: 'Онлайн',
      offline: 'Офлайн',
      pendingEvmGroup: 'Очікувана EVM-транзакція',
      speedUp: 'Пришвидшити',
      cancel: 'Скасувати',
      otherDeviceShort: 'Інший пристрій',
      resetShort: 'Скинути',
      resetTitle: 'Скинути Пісочницю: нова сесія з налаштуваннями за замовчуванням',
      setupButton: 'Налаштування',
      closeSetup: 'Закрити налаштування',
      scrollButton: 'Прокрутка',
      scrollTitle: 'Фіксована висота зі смугою прокрутки; потягніть за нижній кут для зміни розміру',
      outcomeLabels: {
        success: 'Успіх',
        revert: 'Реверт',
        replaced: 'Замінено',
        rejected: 'Відхилено',
      },
      outcomeHints: {
        success: 'Замайнено на EVM. На Solana — confirmed за секунду, потім finalized.',
        revert: 'Смарт-контракт (EVM) або програма (Solana) завершує транзакцію помилкою.',
        replaced: 'EVM: майниться інша транзакція з тим самим nonce. Solana: спливає термін дії blockhash.',
        rejected: 'Користувач відхиляє транзакцію у вікні гаманця.',
      },
      info: {
        chains:
          'Сімейства блокчейнів симульованого dApp, кожне зі своїми гаманцями та мережами. Одне завжди увімкнене.',
        ui: 'Nova UI Kit: готові модальні вікна підключення, кнопка та тости. Headless: власноруч написані компоненти на тих самих сторах.',
        features:
          'Вхід SIWX: після підключення гаманець підписує повідомлення і застосунок отримує сесію. Синхронізація Quasar: транзакції синхронізуються з симульованим Quasar і переносяться між пристроями (потребує SIWX).',
        theme:
          'CSS-змінні --tuwa-* для Nova на сцені. Вкладка Кастомізація › Тема дозволяє редагувати кожну змінну та скопіювати готовий CSS.',
        style:
          'Набори класів для кожного елемента Nova (customization.classNames): стандартна Nova, TUWA Mono або Isometric.',
        connectButton:
          'Повна: баланс і перемикач мережі поруч із кнопкою. Мінімальна: лише сама кнопка (withBalance та withChain вимкнені).',
        language:
          'Мова текстів і модальних вікон Nova UI Kit: англійська (EN), спрощена китайська (CN) або українська (UA).',
        outcome: 'Як завершиться наступна транзакція, яку ви відправите зі сцени.',
        speed: 'Скільки часу займає симуляція гаманця та мережі. Швидкий режим зменшує кожну затримку вчетверо.',
        signatures: 'Чи схвалює симульований гаманець наступний запит на підпис повідомлення (наприклад, вхід SIWX).',
        quasar:
          'Офлайн: синхронізація завершується помилкою, Pulsar зберігає транзакцію несинхронізованою і повторно надсилає її, коли Quasar знову онлайн.',
        pendingEvm:
          'Замінює останню очікувану EVM-транзакцію новою з тим самим nonce, як це робить гаманець: Пришвидшити надсилає її повторно, Скасувати відправляє порожню транзакцію. Оригінал отримує статус Replaced.',
      },
    },
    policiesExtra: {
      lastUpdated: 'Оновлено {date}',
      vulnTitle: 'Знайшли вразливість?',
      vulnBeforeLink: 'Напишіть на ',
      vulnAfterLink:
        ', вказавши пакет або сервіс, кроки для відтворення та вплив. Будь ласка, не розголошуйте інформацію публічно до виправлення.',
      legalTitle: 'Юридичні питання та приватність',
      legalBeforeLink: 'Напишіть на ',
      legalAfterLink: ', зокрема щодо запитів на доступ або видалення ваших персональних даних.',
    },
    notFoundExtra: {
      reportBrokenLink: 'Повідомити про неробоче посилання',
      hubSectionsHeading: 'Документаційний хаб',
      policiesTitle: 'Політики',
      policiesDescription: 'Умови використання, приватність та інші політики TUWA.',
    },
  },
  nextra: {
    ...docsLabels.uk.nextra,
    sidebar: {
      main: 'Головна',
      guides: 'Посібники',
      quasar: 'Quasar',
      comparisons: 'Порівняння',
      configurator: 'Конфігуратор',
      playground: 'Пісочниця',
      index: 'Огляд',
      'choose-packages': 'Оберіть свої пакети',
      'why-web3-transaction-state-is-broken': 'Чому стан Web3-транзакцій зламаний',
      'full-stack-react': 'Full-Stack React застосунок',
      'react-transaction-tracking': 'Відстеження транзакцій у React',
      'multi-chain-auth-siwx-caip122': 'Мультичейн-автентифікація з SIWX',
      'erc-4337-sovereign-account-abstraction': 'Некастодіальна абстракція акаунтів (ERC-4337)',
      'quasar-transaction-sync': 'Синхронізація транзакцій із Quasar',
      'siwx-jwt-external-auth': 'Зовнішня автентифікація з SIWX JWT',
      'siwx-supabase': 'Supabase RLS із SIWX',
      'starter-templates': 'Стартові шаблони',
      'apps-and-keys': 'Застосунки та ключі',
      webhooks: 'Вебхуки',
      'rpc-and-chains': 'RPC та мережі',
      'quotas-and-limits': 'Квоти та ліміти',
      api: 'Довідник API',
      'self-hosting': 'Self-Hosting (Community Edition)',
      'migrate-to-community': 'Перехід із Cloud на Community',
      policies: 'Політики TUWA',
    },
    guidesOverview: {
      title: 'Архітектурні креслення та інженерні розбори',
      p1: 'Тоді як документація окремих пакетів містить детальний довідник функцій та API, цей розділ присвячений високорівневій Web3-архітектурі, перевіреним у продакшені патернам та практичним рецептам інтеграції.',
      p2: 'Web3-інженерія зазнає краху, коли реалії розподілених реєстрів стикаються з наївними фронтенд-припущеннями: перевантаження мемпулу, динамічні стрибки газу, втрачені nonce, транзакції заміни (speed-up/cancel), фоновий тротлінг вкладок браузера та розмонтування React-компонентів. Описані тут рішення усувають ці системні проблеми за допомогою локально-орієнтованих, безголових (headless) і некастодіальних архітектурних патернів.',
      calloutTitle: 'Авторитетна специфікація для розробників та ШІ-агентів',
      calloutBeforeLink:
        'Базові правила системного дизайну, суворі межі ізоляції пакетів, міжрівневі контракти та обмеження для автономних агентів у всій екосистемі наведені у файлі ',
      calloutAfterLink: '. Це єдине джерело архітектурної істини як для інженерів, так і для ШІ-агентів.',
      deepDiveHeading: 'Глибокі інженерні розбори',
      deepDiveIntro:
        'Комплексні інженерні дослідження, спрямовані на усунення системних вразливостей у сучасних dApps:',
      deepDives: [
        {
          href: '/guides/multi-chain-auth-siwx-caip122',
          emoji: '🔐',
          title: 'Мультичейн-автентифікація з SIWX (CAIP-122 за межами EVM)',
          description:
            'Чому EIP-4361 обмежує сучасні мультичейн-застосунки, як CAIP-122 об’єднує автентифікацію EVM та Solana в єдиний криптографічний контур і як реалізувати безстанові сесії із захистом від повторного відтворення (anti-replay).',
          meta1Label: 'Фокус:',
          meta1Text: 'Протокол CAIP-122, міжмережева синхронізація сесій, перевірка підписів EIP-191/1271 та ed25519.',
          meta2Label: 'Ключове рішення:',
          meta2Text: 'Універсальна мультичейн-автентифікація на базі @tuwaio/siwx.',
        },
        {
          href: '/guides/why-web3-transaction-state-is-broken',
          emoji: '⚡',
          title: 'Чому керування станом Web3-транзакцій зламане (і чому useState — це антипатерн)',
          description:
            'Детальне дослідження того, чому моделювання блокчейн-записів через React useState призводить до втрати стану при розмонтуванні компонентів, «осиротілих» транзакцій пришвидшення та розсинхронізації сесій. Демонструє відокремлення виконання від дерева UI за допомогою безголових скінченних автоматів.',
          meta1Label: 'Фокус:',
          meta1Text: 'Механіка мемпулу, заміна транзакцій за nonce, синхронізація між вкладками.',
          meta2Label: 'Ключове рішення:',
          meta2Text: 'Відокремлений життєвий цикл транзакцій на базі @tuwaio/pulsar-core.',
        },
        {
          href: '/guides/erc-4337-sovereign-account-abstraction',
          emoji: '🛡️',
          title: 'Деконструкція ERC-4337: некастодіальна абстракція акаунтів без пропрієтарних WaaS',
          description:
            'Чому Account Abstraction не потребує закритої WaaS-платформи, як працює альтернативний мемпул і двофазний життєвий цикл userOpHash → txHash, та як будувати оптимізовані за газом некастодіальні смарт-акаунти із Solady, Orbit EVM, Pulsar і Quasar.',
          meta1Label: 'Фокус:',
          meta1Text:
            'Канонічний EntryPoint v0.7, контрфактичні акаунти Solady, бандлери/пеймастери Pimlico, двофазне відстеження UserOp.',
          meta2Label: 'Ключове рішення:',
          meta2Text:
            'Суверенні смарт-акаунти зі спонсоруванням газу на базі @tuwaio/orbit-evm, @tuwaio/pulsar-core та Quasar.',
        },
      ],
      stepByStepHeading: 'Покрокові посібники',
      stepByStepIntro: 'Практичні інструкції з налаштування, що поєднують декілька пакетів TUWA:',
      stepBySteps: [
        {
          href: '/guides/react-transaction-tracking',
          emoji: '🧭',
          title: 'Відстеження транзакцій у React за допомогою Pulsar',
          description:
            'Додайте Pulsar до React-застосунку для гаманця EVM або Solana: стор транзакцій у localStorage, адаптер мережі, відновлення трекінгу після перезавантаження сторінки та кнопка відправлення контракту чи програми (включно з варіантом смарт-акаунта ERC-4337).',
          meta1Label: 'Пакети:',
          meta1Text:
            '@tuwaio/pulsar-core, @tuwaio/pulsar-evm або @tuwaio/pulsar-solana, @tuwaio/pulsar-react, Nova Connect.',
        },
        {
          href: '/guides/full-stack-react',
          emoji: '🧱',
          title: 'Створення Full-Stack React застосунку з TUWA SDK',
          description:
            'Застосунок Next.js на @tuwaio/sdk для EVM або Solana: підключення гаманців із модальними вікнами Nova Connect, вхід SIWX із серверними сесіями, стор транзакцій Pulsar із модальними вікнами та тостами Nova Transactions і Server Action із перевіркою авторизованого гаманця.',
          meta1Label: 'Пакети:',
          meta1Text: '@tuwaio/sdk, @tuwaio/evm-sdk або @tuwaio/solana-sdk.',
        },
        {
          href: '/guides/quasar-transaction-sync',
          emoji: '☁️',
          title: 'Синхронізація транзакцій із Quasar',
          description:
            'Продовження full-stack застосунку: Server Actions, що викликають Quasar після перевірки сесії SIWX, стор Pulsar, який синхронізує кожну нову транзакцію, та спільна історія всіх пристроїв у модальних вікнах Nova.',
          meta1Label: 'Пакети:',
          meta1Text: '@tuwaio/quasar-sdk, @tuwaio/sdk.',
        },
        {
          href: '/guides/siwx-jwt-external-auth',
          emoji: '🔑',
          title: 'Передача сесії SIWX у зовнішню автентифікацію через JWT та JWKS',
          description:
            'Короткоживучий JWT для гаманця, авторизованого через SIWX, та публічні ключі JWKS для його перевірки, щоб кастомна автентифікація Coinbase CDP, інші провайдери та ваші власні сервіси довіряли одному входу.',
          meta1Label: 'Пакети:',
          meta1Text: '@tuwaio/sdk (/siwx/server, /siwx/server-next), @coinbase/cdp-hooks.',
        },
        {
          href: '/guides/siwx-supabase',
          emoji: '🗄️',
          title: 'Використання входу SIWX із Supabase Row Level Security',
          description:
            'Supabase довіряє токену SIWX як сторонньому провайдеру автентифікації, політики Row Level Security за адресою гаманця надають кожному гаманцю доступ лише до його власних рядків, а клієнт supabase-js передає токен із браузера та Server Actions.',
          meta1Label: 'Пакети:',
          meta1Text: '@tuwaio/sdk (/siwx, /siwx/server, /siwx/server-next), @supabase/supabase-js.',
        },
        {
          href: '/guides/starter-templates',
          emoji: '🚀',
          title: 'Стартові шаблони',
          description:
            'Готові застосунки Next.js та Vite із Cosmos Playground — підключення гаманців, відстеження транзакцій, вхід SIWX та синхронізація з Quasar вже з’єднані разом — а також CLI для швидкого створення проєкту.',
        },
      ],
      apiReferencesHeading: 'Довідники API пакетів',
      apiReferencesP1:
        'Шукаєте детальні довідники API, сигнатури хуків, визначення типів або інструкції зі встановлення окремих пакетів?',
      apiReferencesP2Before:
        'Усі спеціалізовані простори документації пакетів (@tuwaio/siwx, @tuwaio/orbit, @tuwaio/satellite, @tuwaio/pulsar, @tuwaio/nova-uikit, @tuwaio/sdk та @tuwaio/quasar-sdk) зібрані на ',
      apiReferencesMainScreenLink: 'Головному екрані',
      apiReferencesP2After:
        '. Перейдіть на головний портал, щоб дослідити інтерактивну карту рівнів та відкрити документацію потрібного пакета.',
      apiReferencesP3Before:
        'Quasar — застосунки та ключі, квоти, вебхуки, self-hosting Community Edition та довідник API — описаний у ',
      apiReferencesQuasarLink: 'розділі Quasar',
      apiReferencesP3After: ' цього хабу.',
      principlesHeading: 'Архітектурні принципи',
      principlesIntro: 'Кожне креслення у цьому репозиторії дотримується трьох непорушних інженерних принципів:',
      principles: [
        {
          lead: 'Некастодіальна та суверенна архітектура:',
          body: ' Фронтенди залишаються некастодіальними і не потребують закритих пропрієтарних WaaS-платформ. Клієнтські застосунки зберігають стійкий локальний стан і можуть підключати Quasar для міжпристроєвої індексації, доставки вебхуків та серверної оркестрації — як керовану хмару або як відкриту self-hosted Community Edition (Apache-2.0) — ніколи не беручи під контроль ключі користувачів.',
        },
        {
          lead: 'Безголове (Headless) розділення відповідальності:',
          body: ' Базова бізнес-логіка живе у фреймворк-незалежних сторах (satellite, pulsar) і низькорівневих протокольних адаптерах (orbit). Відображення живе у змінних UI-компонентах (nova). Зміни стилізації ніколи не загрожують роботі базових Web3-машин станів.',
        },
        {
          lead: 'Сувора типізація та нуль зайвого коду:',
          body: ' Нульова толерантність до типів any, застарілих бандлів @solana/web3.js v1 чи монолітних пакетів ethers.js. Лише сучасні, tree-shakeable високопродуктивні примітиви (viem, @solana/kit).',
        },
      ],
    },
    pageDescriptions: {
      'guides/choose-packages':
        'Як обрати між єдиним пакетом @tuwaio/sdk та окремими модулями для підключення гаманців, SIWX, Pulsar і Nova UI.',
      'guides/full-stack-react':
        'Повна інтеграція підключення гаманців, входу SIWX, відстеження Pulsar та синхронізації Quasar у Next.js для EVM та Solana.',
      'guides/react-transaction-tracking':
        'Як відстежувати транзакції EVM і Solana у React-застосунку за допомогою Pulsar та Nova UI Kit.',
      'guides/multi-chain-auth-siwx-caip122':
        'Автентифікація Sign-In With X (CAIP-122) для гаманців EVM та Solana з верифікацією на власному сервері.',
      'guides/why-web3-transaction-state-is-broken':
        'Чому моделювання блокчейн-записів через React useState ламається при розмонтуванні та заміні транзакцій, і як безголові машини станів вирішують цю проблему.',
      'guides/erc-4337-sovereign-account-abstraction':
        'Некастодіальні смарт-акаунти ERC-4337 із Solady, EntryPoint v0.7, бандлерами/пеймастерами Pimlico, Orbit EVM, Pulsar та Quasar.',
      'guides/quasar-transaction-sync':
        'Як синхронізувати клієнтські та серверні транзакції з Quasar через @tuwaio/quasar-sdk та перевіряти HMAC-вебхуки.',
      'guides/siwx-jwt-external-auth':
        'Випуск короткоживучих JWT та ендпоінта JWKS із сесії SIWX для зовнішніх провайдерів автентифікації та мікросервісів.',
      'guides/siwx-supabase':
        'Використання входу через гаманець SIWX із політиками Supabase Row Level Security та supabase-js.',
      'guides/starter-templates':
        'Готові стартові шаблони Next.js та Vite із Cosmos Playground та CLI для швидкого створення проєкту.',
      'quasar/apps-and-keys':
        'Організації, застосунки, секретні ключі (sk_live_...), ротація ключів і безпеки в Quasar Cloud та Community Edition.',
      'quasar/webhooks':
        'Підписані HMAC-SHA256 вебхуки Quasar, перевірка підпису x-quasar-signature, повторні спроби та локальне налагодження через CLI.',
      'quasar/rpc-and-chains':
        'Підтримувані мережі EVM та Solana (CAIP-2), власні RPC-ендпоінти та ключі Alchemy/QuickNode у Quasar.',
      'quasar/quotas-and-limits':
        'Як розраховуються одиниці квоти, ліміти публічної бети та обмеження частоти запитів (rate limits) у Quasar.',
      'quasar/api': 'Повний довідник HTTP-ендпоінтів Quasar Engine API для синхронізації, історії та моніторингу.',
      'quasar/self-hosting':
        'Розгортання Quasar Community Edition (Apache-2.0) на власному сервері через Docker Compose.',
      'quasar/migrate-to-community':
        'Експорт організації з Quasar Cloud у зашифрований архів .qex та імпорт у власний вузол Quasar Community Edition.',
    },
    headings: {
      'where-to-start': '🧭 З чого почати',
      'shared-rules-across-every-guide': '📐 Загальні правила для всіх посібників',
      'how-quasar-fits-in': '🔄 Місце Quasar в архітектурі',
      'finality-expiry-and-reconciliation': '⛓️ Фіналізація, експірація та звірка станів',
      'quasar-cloud-and-quasar-community': '☁️ Quasar Cloud та Quasar Community',
      'which-path-fits-your-stack': 'Який шлях підходить вашому стеку',
      'next-steps': '📚 Наступні кроки',

      // Quasar: Apps & Keys
      'create-an-app': '🛠️ Створення додатка',
      'secret-key-and-public-key': '🔑 Секретний та публічний ключі',
      'app-settings-that-restrict-requests': '🛡️ Налаштування безпеки та фільтрації',
      'isolation-between-apps': '🏢 Сувора ізоляція між додатками',

      // Quasar: Quotas & Limits
      'public-beta': '🧪 Публічна бета',
      'what-costs-quota': '🧮 Що витрачає квоту',
      'when-the-quota-is-used-up': '📉 Коли квота вичерпана',
      'other-limits': '🚦 Інші ліміти',

      // Quasar: Webhooks
      'register-an-endpoint': '🛠️ Реєстрація ендпоінта',
      'the-request': '📨 Формат запиту',
      'verify-the-signature': '🔐 Перевірка підпису',
      'retries-and-delivery-logs': '🔁 Повторні спроби та логи доставки',
      'local-development': '💻 Локальна розробка',

      // Quasar: Self-Hosting & Migration
      'point-the-sdk-at-your-node': '🔌 Підключення SDK до власної ноди',
      'export-the-organization': '📦 Експорт організації',
      'import-it-into-your-node': '📥 Імпорт у власну ноду',
      'switch-over': '🔁 Перемикання',
      'when-the-import-stops': '🧯 Якщо імпорт зупинився',

      // Guides Index
      'deep-dive-guides': 'Поглиблені технічні розбори',
      'multi-chain-authentication-with-siwx-caip-122-beyond-evm-silos':
        '🔐 Мультичейн-автентифікація з SIWX (CAIP-122 поза EVM-силосами)',
      'why-web3-transaction-state-management-is-broken-and-why-usestate-is-an-anti-pattern':
        '⚡ Чому управління станом Web3 зламане (і чому useState є антипатерном)',
      'demystifying-erc-4337-sovereign-account-abstraction-without-proprietary-waas':
        '🛡️ Деконструкція ERC-4337: некастодіальна абстракція акаунтів без WaaS',
      'step-by-step-guides': 'Покрокові інструкції',
      'track-transactions-in-react-with-pulsar': '🧭 Відстеження транзакцій у React з Pulsar',
      'build-a-full-stack-react-app-with-the-tuwa-sdk': '🧱 Full-Stack React застосунок на базі TUWA SDK',
      'sync-transactions-to-quasar': '☁️ Синхронізація транзакцій із Quasar',
      'hand-a-siwx-sign-in-to-external-auth-with-jwt-and-jwks':
        '🔑 Передача входу SIWX у зовнішні системи через JWT та JWKS',
      'use-a-siwx-sign-in-with-supabase-row-level-security':
        '🗄️ Використання входу SIWX із Supabase Row Level Security',
      'starter-templates': '🚀 Стартові шаблони',
      'package-api-references': 'Довідники API пакетів',
      'architectural-principles': 'Архітектурні принципи',

      // Guides Details
      'before-you-start': 'Перед початком',
      'step-1-install-the-packages': 'Крок 1: Встановлення пакетів',
      'step-2-configure-the-network': 'Крок 2: Налаштування мережі',
      'step-3-add-the-siwx-routes': 'Крок 3: Додавання маршрутів SIWX',
      'step-4-create-the-transaction-store': 'Крок 4: Створення сховища транзакцій',
      'step-5-render-the-providers': 'Крок 5: Рендеринг провайдерів',
      'step-6-send-a-tracked-transaction': 'Крок 6: Відправка відстежуваної транзакції',
      'step-7-read-the-session-on-the-server': 'Крок 7: Читання сесії на сервері',
      'evm-and-solana-together': '🌐 EVM та Solana разом',
      'step-2-describe-the-contract-or-program': 'Крок 2: Опис контракту чи програми',
      'step-3-create-an-action': 'Крок 3: Створення дії',
      'step-5-resume-tracking-after-a-reload': 'Крок 5: Відновлення відстеження після перезавантаження',
      'step-6-send-and-track-the-transaction': 'Крок 6: Відправка та відстеження транзакції',
      'step-7-react-to-finished-transactions': 'Крок 7: Реакція на завершення транзакцій',
      'step-1-install-the-quasar-client': 'Крок 1: Встановлення клієнта Quasar',
      'step-2-add-the-server-actions': 'Крок 2: Додавання Server Actions',
      'step-3-sync-from-the-transaction-store': 'Крок 3: Синхронізація зі сховища транзакцій',
      'eip-5792-batches': 'Батчі EIP-5792',
      'step-4-show-the-history': 'Крок 4: Відображення історії',
      'server-signed-transactions-withdrawals--payouts': 'Серверні транзакції (виведення та виплати)',
      'step-1-create-a-signing-key': 'Крок 1: Створення ключа підпису',
      'step-2-enable-jwt-in-the-route-handler': 'Крок 2: Увімкнення JWT в обробнику роуту',
      'step-3-connect-coinbase-cdp-custom-authentication': 'Крок 3: Підключення кастомної автентифікації Coinbase CDP',
      'step-4-trust-the-token-in-your-own-services': 'Крок 4: Довіра до токена у власних сервісах',
      'what-ends-up-in-the-token': 'Що міститься в токені',
      'security-and-key-rotation': 'Безпека та ротація ключів',
      'how-it-works': 'Як це працює',
      'siwx-or-the-supabase-web3-sign-in': 'SIWX чи вхід Web3 від Supabase?',
      'step-1-add-the-role-claim-to-the-token': 'Крок 1: Додавання role claim до токена',
      'step-2-register-your-jwks-with-supabase': 'Крок 2: Реєстрація JWKS у Supabase',
      'step-3-create-a-table-with-row-level-security': 'Крок 3: Створення таблиці з RLS',
      'step-4-create-the-supabase-client': 'Крок 4: Створення клієнта Supabase',
      'step-5-read-and-write-rows': 'Крок 5: Читання та запис рядків',
      'step-6-query-as-the-wallet-from-a-server-action': 'Крок 6: Запити від імені гаманця з Server Action',
      'what-supabase-reads-from-the-token': 'Що Supabase читає з токена',
      templates: '🚀 Шаблони',
      'create-a-project': '🛠️ Створення проєкту',
      '1-run-the-cli': '1. Запуск CLI',
      '2-configure-and-start': '2. Налаштування та запуск',
      '3-build-with-an-ai-agent': '3. Розробка за допомогою ШІ-агента',
      '1-the-architectural-problem-single-chain-silos': '1. Архітектурна проблема: одночейнові силоси',
      'critical-security-pitfalls-of-fragmented-auth': 'Критичні пастки безпеки фрагментованої автентифікації',
      '2-enter-caip-122-sign-in-with-x': '2. Стандарт CAIP-122 (Sign-In with X)',
      'the-authentication-lifecycle': 'Життєвий цикл автентифікації',
      '3-the-siwx-modular-architecture-packages--adapters': '3. Модульна архітектура SIWX: пакети та адаптери',
      '4-multi-chain-network-adapter-comparison': '4. Порівняння мультичейн-адаптерів',
      '5-end-to-end-implementation-in-the-tuwa-ecosystem': '5. Наскрізне впровадження в екосистемі TUWA',
      'step-1-client-side-multi-chain-sign-in': 'Крок 1: Клієнтський мультичейн-вхід',
      'programmatic-sign-in-button-with-satellite-connect': 'Програмна кнопка входу із Satellite Connect',
      'declarative-watcher-pattern-with-satellite-nova-uikit':
        'Декларативний патерн Watcher із Satellite та Nova UI Kit',
      'declarative-watcher-pattern-with-satellite--nova-uikit':
        'Декларативний патерн Watcher із Satellite та Nova UI Kit',
      'step-2-server-side-cryptographic-verification': 'Крок 2: Серверна криптографічна верифікація',
      'production-route-handler-atomic-redis-nonce-session-store':
        'Продакшн Route Handler (атомарний Redis Nonce та сесії)',
      'production-route-handler-atomic-redis-nonce--session-store':
        'Продакшн Route Handler (атомарний Redis Nonce та сесії)',
      'zero-infrastructure-stateless-route-handler-hmac-signed-token':
        'Stateless Route Handler без інфраструктури (HMAC-підписаний токен)',
      'step-3-guarding-server-actions--backend-dispatches': 'Крок 3: Захист Server Actions та бекенд-викликів',
      '6-technical-comparison-eip-4361-vs-caip-122-siwx': '6. Порівняння: EIP-4361 проти CAIP-122 (SIWX)',
      conclusion: 'Висновки',
      '1-the-distributed-state-mismatch': '1. Невідповідність розподіленого стану',
      '2-four-production-failure-modes-of-usestate': '2. Чотири продакшн-збої useState',
      'failure-mode-1-the-component-unmount-bug': 'Збій 1: Розмонтування компонента',
      'failure-mode-2-the-mempool-replacement-trap-speed-ups-and-cancels':
        'Збій 2: Пастка заміни в мемпулі (пришвидшення та скасування)',
      'failure-mode-3-cross-tab--browser-reload-amnesia': 'Збій 3: Амнезія вкладок та перезавантаження',
      'failure-mode-4-soft-confirmations-finality--blockhash-expiry':
        'Збій 4: Софт-підтвердження, фінальність та експірація блохешу',
      '3-the-solution-decoupled-local-first-state-machines': '3. Рішення: відокремлені local-first стейт-машини',
      '4-implementation-in-the-tuwa-ecosystem': '4. Реалізація в екосистемі TUWA',
      'step-1-define-strongly-typed-transaction-unions': 'Крок 1: Визначення строго типізованих юніонів транзакцій',
      'step-2-initialize-the-persistent-pulsar-store': 'Крок 2: Ініціалізація персистентного сховища Pulsar',
      'step-3-dispatching-write-actions-via-executetxaction': 'Крок 3: Відправка дій запису через executeTxAction',
      'step-4-resuming-active-trackers-on-page-reload': 'Крок 4: Відновлення трекерів після перезавантаження',
      'step-5-passive-ui-subscriptions-via-selectors': 'Крок 5: Пасивні підписки UI через селектори',
      'step-6-reactions-that-survive-a-reload': 'Крок 6: Реакції, стійкі до перезавантаження',
      '5-architectural-comparison-usestate-vs-pulsar': '5. Порівняння: useState проти Pulsar',
      '1-the-account-abstraction-spectrum-signer-vs-account': '1. Спектр абстракції акаунтів: підписувач проти акаунта',
      'deconstructing-the-waas-trade-off': 'Деконструкція компромісів WaaS',
      '2-the-two-phase-lifecycle-userophash-vs-txhash': '2. Двофазний життєвий цикл: userOpHash проти txHash',
      'the-dual-identifier-dilemma': 'Дилема подвійного ідентифікатора',
      'three-production-failure-modes-of-naive-frontends': 'Три збої наївних фронтендів у продакшні',
      '1-rpc-node-polling-vs-bundler-mempool-mismatch': '1. Опитування RPC проти мемпулу бандлера',
      '2-bundle-calldata-obfuscation': '2. Обфускація calldata у бандлі',
      '3-silent-execution-reverts-inside-entrypointhandleops':
        '3. Приховані помилки виконання всередині EntryPoint.handleOps',
      '3-smart-account-architectures-solady-vs-erc-7579-modular-accounts':
        '3. Архітектури смарт-акаунтів: Solady проти ERC-7579',
      'the-cryptographic-reality-of-solady--passkeys': 'Криптографічна реальність Solady та Passkeys',
      '4-implementation-canonical-viem-aa-vs-tuwa-open-source-stack': '4. Реалізація: канонічний Viem AA проти TUWA',
      '41-implementation-a-canonical-native-viem-viemaccount-abstraction':
        '4.1 Варіант A: Канонічний Viem (viem/account-abstraction)',
      '42-implementation-b-ergonomic-tuwa-stack-tuwaioorbit-evm--tuwaiopulsar-evm':
        '4.2 Варіант B: TUWA Stack (@tuwaio/orbit-evm та @tuwaio/pulsar-evm)',
      'step-1-orchestrating-the-smart-account-with-orbit-evm':
        'Крок 1: Оркестрація смарт-акаунта за допомогою Orbit EVM',
      'step-2-reactive-two-stage-tracking-with-pulsar': 'Крок 2: Реактивне двофазне відстеження з Pulsar',
      'part-a-pure-transaction-action-incrementpimlicots': 'Частина A: Чиста транзакційна дія (incrementPimlico.ts)',
      'part-b-reactive-ui-component-dispatch-counterbuttontsx':
        'Частина B: Диспетчеризація реактивного UI-компонента (CounterButton.tsx)',
      'how-pulsars-two-stage-pipeline-executes-under-the-hood': 'Як двоетапний пайплайн Pulsar працює під капотом',
      '5-cross-device-persistence-build-your-own-indexer-or-use-quasar':
        '5. Крос-девайсна персистентність: власний індексатор чи Quasar',
      'option-a-build-your-own-indexer-ponder--envio': 'Опція A: Власний індексатор (Ponder / Envio)',
      'option-b-non-custodial-sync-with-quasar-cloud-or-self-hosted': 'Опція B: Некастодіальна синхронізація з Quasar',
      '6-comprehensive-architectural-comparison-matrix': '6. Комплексна порівняльна матриця архітектур',
      'summary-designing-sovereign-smart-accounts': 'Підсумок: проєктування некастодіальних смарт-акаунтів',
    },
    guidesIndex: {
      title: 'Посібники',
      intro:
        'Кожен посібник крок за кроком розбирає задачу, що поєднує два або більше рівнів екосистеми TUWA, з повним кодом на TypeScript і React для EVM та Solana.',
      tableHeaders: {
        guide: 'Посібник',
        whatYouBuild: 'Що ви створите',
        layersUsed: 'Задіяні рівні',
      },
      rows: [
        {
          href: '/guides/choose-packages',
          title: 'Оберіть свої пакети',
          whatYouBuild:
            'Вибір між @tuwaio/sdk та окремими пакетами для підключення гаманців, входу SIWX, відстеження транзакцій і Nova UI',
          layersUsed: 'Усі етапи',
        },
        {
          href: '/guides/full-stack-react',
          title: 'Full-Stack React застосунок',
          whatYouBuild:
            'Підключення гаманця, вхід через SIWX, відстеження транзакцій із Pulsar та синхронізація з Quasar в одному Next.js застосунку',
          layersUsed: 'SIWX, Satellite, Pulsar, Quasar, Nova, SDK',
        },
        {
          href: '/guides/react-transaction-tracking',
          title: 'Відстеження транзакцій у React',
          whatYouBuild: 'Відстеження транзакцій EVM та Solana в React-застосунку за допомогою Pulsar та Nova UI',
          layersUsed: 'Orbit, Satellite, Pulsar, Nova',
        },
        {
          href: '/guides/multi-chain-auth-siwx-caip122',
          title: 'Мультичейн-автентифікація з SIWX',
          whatYouBuild: 'Sign-In With X (CAIP-122) для гаманців EVM та Solana з верифікацією на вашому сервері',
          layersUsed: 'Orbit, SIWX, Satellite, Nova',
        },
        {
          href: '/guides/quasar-transaction-sync',
          title: 'Синхронізація транзакцій із Quasar',
          whatYouBuild:
            'Синхронізація клієнтських і серверних транзакцій із Quasar через @tuwaio/quasar-sdk та перевірка HMAC-вебхуків',
          layersUsed: 'SIWX, Pulsar, Quasar, Nova',
        },
      ],
      whereToStartHeading: '🧭 З чого почати',
      whereToStart: {
        newAppLead: 'Створюєте новий React dApp?',
        newAppBeforeLink: 'Почніть із посібника ',
        newAppLink: 'Full-Stack React застосунок',
        newAppAfterLink: ' — він поєднує всі рівні в одному проєкті.',
        existingAppLead: 'Додаєте одну функцію до існуючого застосунку?',
        existingAppBeforeFirst: 'Оберіть спеціалізований посібник: ',
        existingAppFirstLink: 'Відстеження транзакцій у React',
        existingAppMiddle: ', ',
        existingAppSecondLink: 'Мультичейн-автентифікація з SIWX',
        existingAppAfterSecond: ' або ',
        existingAppThirdLink: 'Синхронізація транзакцій із Quasar',
        existingAppEnd: '.',
        notSureLead: 'Не впевнені, які саме пакети встановлювати?',
        notSureLink: 'Оберіть свої пакети',
        notSureAfterLink: ' містить точні команди встановлення для кожної комбінації.',
      },
      sharedRulesHeading: '📐 Загальні правила для всіх посібників',
      sharedRulesIntro:
        'Кожен посібник дотримується єдиних конвенцій, тому ви можете комбінувати фрагменти коду без конфліктів:',
      sharedRules: {
        sdkImportsLead: 'React-застосунки імпортують із підшляхів @tuwaio/sdk',
        sdkImportsBody:
          ' (@tuwaio/sdk/orbit, @tuwaio/sdk/siwx, @tuwaio/sdk/satellite, @tuwaio/sdk/pulsar, @tuwaio/sdk/nova-core, @tuwaio/sdk/nova-connect, @tuwaio/sdk/nova-transactions) та мережевих доповнень @tuwaio/evm-sdk/* і @tuwaio/solana-sdk/*. У кожному посібнику також вказані окремі пакети, якщо ви не використовуєте @tuwaio/sdk.',
        viemWagmiLead: 'Для EVM використовуються viem та @wagmi/core',
        viemWagmiBody:
          ' — жодних ethers.js, web3.js, RainbowKit, ConnectKit чи WagmiProvider (компонент EVMConnectorsWatcher із Satellite сам керує конфігурацією wagmi).',
        solanaKitLead: 'Для Solana використовуються @solana/kit та @tuwaio/orbit-solana',
        solanaKitBody: ' — жодних @solana/web3.js v1 чи gill.',
        noSecretsLead: 'Секретні ключі залишаються виключно на сервері',
        noSecretsBody: ' — QUASAR_SECRET_KEY та QUASAR_WEBHOOK_SECRET ніколи не передаються у змінні NEXT_PUBLIC_*.',
      },
    },
    quasarIndex: {
      title: 'Quasar',
      introPart1:
        ' — це серверний бекенд екосистеми TUWA (Етап 3, «Бекенд та синхронізація»). Pulsar відстежує транзакцію в браузері, поки відкрита вкладка; Quasar продовжує відстежувати ту саму транзакцію на сервері до фінального статусу, зберігає історію вашого застосунку для всіх пристроїв і сповіщає ваш бекенд підписаними вебхуками. Ваш сервер взаємодіє з ним через ',
      introPart2: '.',
      howFitsHeading: '🔄 Місце Quasar в архітектурі',
      howFitsIntro:
        'Quasar підтримує як транзакції, підписані гаманцем у браузері (депозити, свопи, виклики смарт-контрактів), так і транзакції, підписані вашим бекендом (виведення коштів, автоматичні виплати, серверні релеї) без потреби у браузерному localStorage.',
      bullets: {
        serverKeyLead: 'Ключ зберігається на вашому сервері.',
        serverKeyPart1:
          ' Браузер ніколи не звертається до Quasar із секретним ключем: для клієнтських транзакцій браузер викликає ваш сервер, який перевіряє володіння гаманцем (через сесію SIWX) і викликає Quasar; для серверних виплат ваш бекенд викликає Quasar напряму після відправлення транзакції в мережу. ',
        serverKeyLinkText: 'Посібник із синхронізації транзакцій Quasar',
        serverKeyPart2: ' описує обидва сценарії.',
        trackingTwiceLead: 'Двофазне відстеження.',
        trackingTwiceBody:
          ' Швидка фаза відстежує транзакцію одразу після синхронізації, а відкладена черга та щогодинний свіпер повторно перевіряють незавершені транзакції на випадок реорганізації блоків або затримок RPC-вузлів. Quasar підтримує всі трекери Pulsar: транзакції EVM, батчі EIP-5792, мультипідписи Safe, операції ERC-4337 та підписи Solana. Quasar Cloud наразі не відстежує мультипідписи Safe; вузол Community Edition підтримує їх повністю.',
        webhooksLead: 'Вебхуки',
        webhooksPart1:
          ' сповіщають ваш бекенд, коли транзакція досягає термінального статусу (Success, Failed або Replaced). ',
        webhooksSee: 'Див. розділ ',
        webhooksLinkText: 'Вебхуки',
      },
      finalityHeading: '⛓️ Фіналізація, експірація та звірка станів',
      finalityIntro:
        'Quasar і Pulsar використовують однакові правила трекерів у кожній мережі, щоб ваша база даних та вебхуки фіксували лише детерміновані фінальні стани:',
      finalityHeaders: {
        chainTracker: 'Мережа / Трекер',
        intermediate: 'Проміжні оновлення',
        terminalSuccess: 'Термінальний Success',
        terminalFailed: 'Термінальний Failed / Replaced',
      },
      finalityRows: {
        solana: {
          intermediate:
            "Записує confirmationStatus: 'confirmed' та slot один раз після голосування супербільшості валідаторів (економить IOPS БД та оновлює UI)",
          success: "Лише на рівні commitment finalized (confirmations: 'MAX')",
          failed:
            'Миттєвий Failed, якщо getSignatureStatuses повертає ончейн-помилку err на рівні confirmed; або Failed із помилкою простроченого blockhash, коли висота блоку кластера перевищує lastValidBlockHeight',
        },
        evm: {
          intermediate: 'Лічильник підтверджень під час очікування потрібної глибини блоків',
          success: "Чек зі status: 'success' після досягнення requiredConfirmations блоків",
          failed:
            "Failed при ончейн-реверті (status: 'reverted'); Replaced (із replacedTxHash), коли замість неї майниться транзакція пришвидшення або скасування з тим самим nonce",
        },
        eip5792: {
          intermediate:
            'Синхронізується за ID батчу (txKey); прив’язується до хешу виконання через quasar.pulsar.syncHash(txKey, hash)',
          success: 'Відстежується ончейн як стандартна EVM-транзакція після прикріплення хешу',
          failed:
            'Failed, якщо транзакція виконання ревертиться або якщо хеш не прикріплено протягом 1 години після синхронізації',
        },
        erc4337: {
          intermediate: 'Опитує бандлер щодо включення userOpHash',
          success: 'Транзакція бандла досягає фінальності з результатом success: true',
          failed: 'Failed, якщо бандлер відхиляє операцію або виконання UserOperation ревертиться ончейн',
        },
      },
      finalityNotes: {
        solanaLead: 'Solana lastValidBlockHeight та стійкість getTransaction:',
        solanaBody:
          ' функція signAndSendSolanaTx із @tuwaio/pulsar-solana автоматично зберігає lastValidBlockHeight; під час синхронізації серверної транзакції Solana передавайте lastValidBlockHeight у quasar.pulsar.syncCreate. Щойно висота блоку кластера (getBlockHeight) перевищує lastValidBlockHeight, а підпис досі невідомий мережі, транзакція фізично не може бути включена в блок і миттєво отримує статус Failed (expired) без очікування умовного таймауту. Після підтвердження трекер запитує fee, recentBlockhash та instructions через getTransaction (підтримуються legacy, v0 та v1); помилка RPC у getTransaction ніколи не скасовує вже фіналізований підпис.',
        nonCustodialLead: 'Некастодіальна межа та повторна трансляція (rebroadcasting):',
        nonCustodialBody:
          ' Ні Pulsar, ні Quasar ніколи не зберігають приватні ключі чи сирі підписані байти транзакцій. Якщо ваш бекенд підписує виведення коштів і повторно транслює ту саму підписану транзакцію в мережу до настання lastValidBlockHeight, зберігайте сирі підписані байти у своєму сервісі відправлення; повторний виклик quasar.pulsar.syncCreate із тим самим txKey є ідемпотентним (duplicate: true), поки Quasar веде підпис до finalized або закінчення терміну дії blockhash.',
        recoveryLead: 'Серверне відновлення та повторні спроби:',
        recoveryBody:
          ' Щогодинний свіпер повторно ставить у чергу незавершені транзакції, які зупинилися через збій RPC, а будь-яку транзакцію у статусі Failed/Replaced або таку, що перебуває в очікуванні понад 60 секунд, можна перезапустити з панелі керування або через POST /v1/engine/pulsar/sync/retry/:txKey.',
      },
      editionsHeading: '☁️ Quasar Cloud та Quasar Community',
      editionsIntro:
        'Quasar доступний у двох редакціях з однаковим ядром відстеження та однаковим API, тому @tuwaio/quasar-sdk працює з обома — змінюється лише baseUrl.',
      editionsHeaders: {
        cloud: 'Quasar Cloud',
        community: 'Quasar Community Edition',
      },
      editionsRows: [
        {
          label: 'Хостинг',
          cloud: 'Керується TUWA: API на https://api.tuwa.io, панель на quasar.tuwa.io',
          community: 'Ваші сервери через Docker Compose (TuwaIO/quasar-community, Apache-2.0)',
        },
        {
          label: 'Мультитенантність',
          cloud: 'Організації з учасниками та кількома застосунками в кожній',
          community: 'Однотенантний режим: один адміністратор',
        },
        {
          label: 'Вхід у панель',
          cloud: 'Акаунти з входом через гаманець SIWX та ключі доступу (passkeys)',
          community: 'Email, пароль та двофакторна автентифікація TOTP в адмінці Payload (/admin)',
        },
        {
          label: 'Квоти',
          cloud: 'Облік на організацію; безкоштовно під час публічної бети (1 000 одиниць квоти на кожну організацію)',
          community: 'Встановлені так високо, що не обмежують роботу окремого вузла',
        },
        {
          label: 'Провайдери RPC',
          cloud:
            'Ваші власні (обов’язково): RPC-ендпоінт, ключ Alchemy або QuickNode у налаштуваннях кожного застосунку',
          community: 'Ваші власні з опціональними резервними ключами та публічними ендпоінтами оператора',
        },
        {
          label: 'Email-сповіщення',
          cloud: 'Листи онбордингу та сповіщення про вичерпання квоти',
          community: 'Немає',
        },
      ],
      editionsNotePart1:
        'Quasar Cloud перебуває у статусі безкоштовної публічної бети: платна квота наразі недоступна, а під час бети функції та ліміти можуть змінюватися. Community Edition не містить входу через SIWX, passkeys, транзакційних листів і білінгу. Щоб перенести організацію з Quasar Cloud на власний сервер разом із ключами та історією, див. ',
      editionsMigrateLink: 'Перехід із Quasar Cloud на Community',
      editionsNotePart2: '; щоб розгорнути вузол з нуля — ',
      editionsSelfHostLink: 'Self-Hosting',
      whichPathHeading: 'Який шлях підходить вашому стеку',
      whichPaths: {
        serverlessLead: 'Serverless або edge-бекенди (Vercel, Cloudflare Workers):',
        serverlessBody:
          ' Використовуйте Quasar Cloud. Очікування ~13–15 секунд на фіналізацію блоку в Solana або підтвердження в EVM всередині serverless-функції спалює ліміти часу виконання й призводить до таймаутів, а підтримка повного Docker-стеку Quasar Community Edition (NestJS, BullMQ, Redis, Payload) є зайвим навантаженням для невеликої команди. Із Quasar Cloud ваш обробник робить один виклик quasar.pulsar.syncCreate, миттєво завершує роботу й отримує підписаний вебхук після фіналізації транзакції.',
        customWorkerLead: 'Власний фоновий воркер або cron із власною БД (без Quasar):',
        customWorkerBody:
          ' Якщо вам потрібен лише цикл опитування мережі та перевірки фінальності/експірації всередині вашого існуючого воркера, імпортуйте автономні headless-трекери напряму з @tuwaio/pulsar-solana (solanaFetcher + initializePollingTracker) або @tuwaio/pulsar-evm — жоден із них не потребує React, браузера чи localStorage.',
        selfHostedLead: 'Власна серверна інфраструктура:',
        selfHostedBody:
          ' Запускайте Quasar Community Edition через Docker Compose на власному VPS або виділеному сервері, коли вам потрібні повноцінний сервіс індексації, API міжпристроєвої історії, воркер вебхуків та адмін-панель на власній інфраструктурі.',
      },
      nextStepsHeading: '📚 Наступні кроки',
      nextSteps: {
        appsKeysPrefix: 'Створіть застосунок і отримайте ключі: ',
        appsKeysLink: 'Застосунки та ключі',
        syncPrefix: 'Синхронізуйте транзакції вашого React-застосунку: ',
        syncLink1: 'Посібник із синхронізації транзакцій Quasar',
        syncMiddle: ', або повний приклад у посібнику ',
        syncLink2: 'Full-Stack React застосунок',
        webhooksPrefix: 'Приймайте вебхуки, зокрема на localhost: ',
        webhooksLink: 'Вебхуки',
        apiPrefix: 'Перегляньте ендпоінти у ',
        apiLink1: 'Довіднику API',
        apiMiddle: ', а клієнтську бібліотеку — у ',
        apiLink2: 'довіднику @tuwaio/quasar-sdk',
      },
    },
  },
};
