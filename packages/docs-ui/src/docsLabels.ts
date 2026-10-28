import type { TuwaLocale } from './locale';
import type { PolicySlug } from './policies';

/**
 * Texts of the interface of a TUWA documentation site (the Nextra chrome, the footer, the language switch and the
 * note on pages that stay in English), shared by the project sites and the docs hub so every site words them the same
 * way. Page content is not part of it: each site keeps its own translated pages.
 */
export interface DocsLabels {
  /** Accessible name of the language switch in the navbar. */
  selectLanguage: string;
  /** The parts of the Nextra layout, passed to its props by `DocsLayout`. */
  nextra: {
    /** Title of the table of contents. */
    onThisPage: string;
    /** The button below the table of contents. */
    scrollToTop: string;
    /** The link to the source of the page on GitHub. */
    editThisPage: string;
    /** The link to a new GitHub issue about the page. */
    feedback: string;
    /** Text before the date of the last change of the page. */
    lastUpdated: string;
    /** Placeholder of the search field. */
    searchPlaceholder: string;
    /** Shown when the search finds nothing. */
    searchEmpty: string;
    /** Shown when the search index cannot be loaded. */
    searchError: string;
    /** Shown while the search index loads. */
    searchLoading: string;
    /** The light option of the theme switch. */
    themeLight: string;
    /** The dark option of the theme switch. */
    themeDark: string;
    /** The system option of the theme switch. */
    themeSystem: string;
  };
  /** The texts of the docs-ui `Footer` (its `labels` prop). */
  footer: {
    /** Description of TUWA. */
    description: string;
    /** License notice. */
    license: string;
    /** Accessible name of the policies nav. */
    policiesAriaLabel: string;
    /** The link to all policies. */
    allPolicies: string;
    /** Copyright text after the year. */
    copyright: string;
    /** Titles of the policies. */
    policyTitles: Record<PolicySlug, string>;
  };
  /**
   * The note above a page that has no translation in the active language: on the project sites these are the package
   * READMEs and the generated API reference, which stay in English.
   */
  englishOnly: string;
  /**
   * Sidebar titles that every documentation site uses, by their English title (`Introduction`, `Packages`, `Guides`,
   * `Overview`). Empty for English.
   */
  sidebar: Record<string, string>;
}

const en: DocsLabels = {
  selectLanguage: 'Select language',
  nextra: {
    onThisPage: 'On This Page',
    scrollToTop: 'Scroll to top',
    editThisPage: 'Edit this page',
    feedback: 'Question? Give us feedback',
    lastUpdated: 'Last updated on',
    searchPlaceholder: 'Search documentation…',
    searchEmpty: 'No results found.',
    searchError: 'Failed to load search index.',
    searchLoading: 'Loading…',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
  },
  footer: {
    description:
      'The modular, headless-first Web3 infrastructure. Build self-custodial applications on open-source, portable building blocks.',
    license: 'Licensed under Apache 2.0. Open source and free to use.',
    policiesAriaLabel: 'Policies',
    allPolicies: 'All policies',
    copyright: 'All rights reserved.',
    policyTitles: {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      cookie: 'Cookie Policy',
      refund: 'Refund Policy',
      security: 'Security Policy',
      dpa: 'Data Processing Addendum',
    },
  },
  englishOnly:
    'This page is in English only: package READMEs and the API reference are generated from the source code and are not translated.',
  sidebar: {},
};

const uk: DocsLabels = {
  selectLanguage: 'Оберіть мову',
  nextra: {
    onThisPage: 'На цій сторінці',
    scrollToTop: 'Прокрутити вгору',
    editThisPage: 'Редагувати цю сторінку',
    feedback: 'Є запитання? Залиште відгук',
    lastUpdated: 'Востаннє оновлено',
    searchPlaceholder: 'Пошук у документації…',
    searchEmpty: 'Нічого не знайдено.',
    searchError: 'Не вдалося завантажити пошуковий індекс.',
    searchLoading: 'Завантаження…',
    themeLight: 'Світла',
    themeDark: 'Темна',
    themeSystem: 'Системна',
  },
  footer: {
    description:
      'Модульна, headless-first Web3-інфраструктура. Будуйте self-custodial застосунки на базі відкритих компонентів.',
    license: 'Ліцензовано під Apache 2.0. Відкритий код та безкоштовне використання.',
    policiesAriaLabel: 'Політики',
    allPolicies: 'Усі політики',
    copyright: 'Усі права захищено.',
    policyTitles: {
      terms: 'Умови використання',
      privacy: 'Політика конфіденційності',
      cookie: 'Політика файлів cookie',
      refund: 'Політика повернення коштів',
      security: 'Політика безпеки',
      dpa: 'Доповнення щодо обробки даних',
    },
  },
  englishOnly:
    'Ця сторінка доступна лише англійською: README пакетів і довідник API генеруються з вихідного коду й не перекладаються.',
  sidebar: {
    Introduction: 'Вступ',
    Packages: 'Пакети',
    Guides: 'Посібники',
    Overview: 'Огляд',
  },
};

const zhCN: DocsLabels = {
  selectLanguage: '选择语言',
  nextra: {
    onThisPage: '本页目录',
    scrollToTop: '返回顶部',
    editThisPage: '编辑此页',
    feedback: '有疑问？向我们反馈',
    lastUpdated: '最后更新于',
    searchPlaceholder: '搜索文档…',
    searchEmpty: '未找到匹配结果。',
    searchError: '加载搜索索引失败。',
    searchLoading: '正在加载…',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
  },
  footer: {
    description: '模块化、无头优先的 Web3 基础设施。借助开源且高度可移植的底层构建块，打造真正的自托管应用。',
    license: '基于 Apache 2.0 协议开源。完全免费使用。',
    policiesAriaLabel: '法律与安全政策',
    allPolicies: '全部政策',
    copyright: '保留所有权利。',
    policyTitles: {
      terms: '服务条款',
      privacy: '隐私政策',
      cookie: 'Cookie 政策',
      refund: '退款政策',
      security: '安全政策',
      dpa: '数据处理附录 (DPA)',
    },
  },
  englishOnly: '本页仅提供英文版：软件包 README 与 API 参考由源代码生成，不提供翻译。',
  sidebar: {
    Introduction: '简介',
    Packages: '软件包',
    Guides: '指南',
    Overview: '概览',
  },
};

/**
 * The {@link DocsLabels} of every {@link TuwaLocale}. `DocsLayout` and `LocalizedPage` (`@tuwaio/docs-ui/nextra`) read
 * them; the docs hub builds its own dictionaries on them.
 */
export const docsLabels: Readonly<Record<TuwaLocale, DocsLabels>> = { en, uk, 'zh-CN': zhCN };
