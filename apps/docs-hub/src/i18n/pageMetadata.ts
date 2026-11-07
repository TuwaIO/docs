import type { TuwaLocale } from '@tuwaio/docs-ui/locale';

/**
 * The titles and descriptions for search engines of the pages that have no MDX file, in the languages of the URLs. They stay out
 * of the dictionaries, which reach the browser and hold only what the page shows.
 */
export const PAGE_METADATA: Partial<Record<TuwaLocale, Record<string, { title: string; description: string }>>> = {
  uk: {
    '/': {
      title: 'TUWA Docs Hub: модульна headless-інфраструктура Web3',
      description:
        'Центральна документація екосистеми TUWA для Web3: SIWX, Orbit, Satellite, Pulsar, Nova, Quasar (керована хмара або власний Community Edition) і TUWA SDK.',
    },
    '/comparisons': {
      title: 'TUWA порівняно з RainbowKit, Privy, Dynamic, thirdweb та іншими',
      description:
        'Як TUWA порівнюється з RainbowKit, ConnectKit, AppKit, Privy, Dynamic, thirdweb, Alchemy і The Graph за контролем над ключами, відкритістю та вартістю, з джерелами.',
    },
    '/configurator': {
      title: 'Конфігуратор стеку: підключіть TUWA до свого застосунку',
      description:
        'Оберіть Next.js, Vite або Vanilla TS, EVM або Solana, Nova UI або headless, SIWX і Quasar: отримайте команду встановлення, файли налаштування та стартовий шаблон.',
    },
    '/playground': {
      title: 'Інтерактивна пісочниця Web3',
      description:
        'Імітуйте підключення гаманців, порівнюйте headless-хуки з Nova UI Kit і дивіться відстеження транзакцій у реальному часі.',
    },
    '/policies': {
      title: 'Політики TUWA: умови, конфіденційність та інше',
      description:
        'Умови та політики екосистеми TUWA: вебсайти й документація, Quasar Cloud, Quasar Community Edition та пакети з відкритим кодом, з офіційними PDF.',
    },
  },
  'zh-CN': {
    '/': {
      title: 'TUWA Docs Hub:模块化 Headless Web3 基础设施',
      description:
        'TUWA Web3 生态系统的文档中心:SIWX、Orbit、Satellite、Pulsar、Nova、Quasar(托管云或自托管 Community Edition)以及 TUWA SDK。',
    },
    '/comparisons': {
      title: 'TUWA 与 RainbowKit、Privy、Dynamic、thirdweb 等的对比',
      description:
        'TUWA 与 RainbowKit、ConnectKit、AppKit、Privy、Dynamic、thirdweb、Alchemy 和 The Graph 在托管方式、开放性和成本方面的对比,并附来源。',
    },
    '/configurator': {
      title: '技术栈配置器:在您的应用中配置 TUWA',
      description:
        '选择 Next.js、Vite 或 Vanilla TS,EVM 或 Solana,Nova UI 或 Headless,以及 SIWX 和 Quasar:获取安装命令、配置文件和入门模板。',
    },
    '/playground': {
      title: '交互式 Web3 演练场',
      description: '模拟钱包连接,对比 Headless Hooks 与 Nova UI Kit,并预览实时交易追踪。',
    },
    '/policies': {
      title: 'TUWA 政策:条款、隐私及其他',
      description:
        'TUWA 生态系统的条款和政策:网站与文档、Quasar Cloud、Quasar Community Edition 和开源软件包,并附官方 PDF。',
    },
  },
};
