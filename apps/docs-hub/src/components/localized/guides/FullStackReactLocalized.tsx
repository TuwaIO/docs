'use client';

import { Callout, Tabs } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function FullStackReactLocalized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const P = mdx.p ?? 'p';
  const Ul = mdx.ul ?? 'ul';
  const Li = mdx.li ?? 'li';
  const Hr = mdx.hr ?? 'hr';
  const A = mdx.a ?? 'a';
  const Code = mdx.code ?? 'code';
  const Table = mdx.table ?? 'table';
  const Thead = mdx.thead ?? 'thead';
  const Tbody = mdx.tbody ?? 'tbody';
  const Tr = mdx.tr ?? 'tr';
  const Th = mdx.th ?? 'th';
  const Td = mdx.td ?? 'td';

  if (locale === 'uk') {
    return (
      <>
        <H1>Створення Full-Stack React застосунку на базі TUWA SDK</H1>
        <P>
          Цей посібник крок за кроком описує створення Next.js додатку на базі{' '}
          <A href="https://sdk.docs.tuwa.io/">TUWA SDK</A>. За підсумком ви отримаєте:
        </P>
        <Ul>
          <Li>
            Підключення гаманців за допомогою модальних вікон Nova Connect на базі безкастодіального клієнта Satellite
            Connect.
          </Li>
          <Li>
            Вхід через SIWX: підключений гаманець підписує повідомлення CAIP-122, а ваш сервер зберігає сесію в куці{' '}
            <Code>HttpOnly</Code>.
          </Li>
          <Li>Сховище транзакцій Pulsar разом з модальними вікнами та тостами Nova Transactions.</Li>
          <Li>Next.js Server Action, який достовірно ідентифікує авторизований гаманець.</Li>
        </Ul>
        <P>
          Усе імпортується з єдиного пакету <Code>@tuwaio/sdk</Code> та плагіна потрібної мережі. Продовженням цього
          посібника є <A href="/guides/quasar-transaction-sync">синхронізація транзакцій із Quasar</A>. Готовими
          прикладами архітектури є стартові шаблони <strong>nextjs-evm</strong> та <strong>nextjs-tuwa-quasar</strong> (
          <A href="/guides/starter-templates">Starter Templates</A>).
        </P>
        <Callout type="info">
          Кроки, що відрізняються залежно від мережі, мають вкладки <strong>EVM</strong> та <strong>Solana</strong>.
          Вкладки синхронізовані: оберіть мережу один раз, і всі кроки адаптуються автоматично. Для одночасної підтримки
          обох мереж перегляньте розділ про EVM та Solana разом.
        </Callout>

        <Hr />

        <H2 id="before-you-start">Перед початком</H2>
        <Ul>
          <Li>
            <strong>Next.js 16 з App Router та React 19.2 або новіше.</strong> Приклади використовують клієнтські модулі{' '}
            <Code>&apos;use client&apos;</Code> та аліас імпорту <Code>@/</Code> для каталогу <Code>src/</Code>.
          </Li>
          <Li>
            <strong>URL вашого додатку</strong> в змінній <Code>NEXT_PUBLIC_APP_URL</Code> (наприклад{' '}
            <Code>http://localhost:3000</Code>): сервер приймає повідомлення авторизації виключно для цього домену.
          </Li>
        </Ul>

        <Hr />

        <H2 id="step-1-install-the-packages">Крок 1: Встановлення пакетів</H2>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={0} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={1} />
            <P>
              Менеджери pnpm (8+), npm (7+) та Bun автоматично встановлюють peer-залежності Wallet Standard для{' '}
              <Code>@tuwaio/solana-sdk</Code> (<Code>@wallet-standard/app</Code>, <Code>base</Code>,{' '}
              <Code>features</Code>, <Code>react</Code>, <Code>ui</Code> та <Code>ui-registry</Code>); для Yarn додайте
              їх в команду вручну.
            </P>
          </Tabs.Tab>
        </Tabs>
        <P>
          Пакет <Code>@tuwaio/sdk</Code> надає базові пакети TUWA та спільні бібліотеки; додаток мережі містить
          специфічні для неї інструменти. Підключіть таблицю стилів Nova один раз у глобальному CSS-файлі вашого
          додатку:
        </P>
        <CodeSnippet index={2} />

        <Hr />

        <H2 id="step-2-configure-the-network">Крок 2: Налаштування мережі</H2>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <P>
              Створіть конфігурацію <Code>@wagmi/core</Code> один раз поза компонентами. Функція{' '}
              <Code>createDefaultTransports</Code> використовує публічні RPC-ендпоінти чейнів viem з обмеженням частоти;
              для продакшну вказуйте власні RPC. З опцією <Code>ssr: true</Code> wagmi очікує відновлення стану
              браузером та реєстрації встановлених розширень (MetaMask, Rabby тощо); компонент{' '}
              <Code>EVMConnectorsWatcher</Code> із Кроку 5 робить це автоматично, тому провайдер{' '}
              <Code>WagmiProvider</Code> з бібліотеки <Code>wagmi</Code> <strong>не потрібен</strong>.
            </P>
            <CodeSnippet index={3} />
            <P>
              Не використовуйте розробницький конектор <Code>impersonated</Code> у додатку з SIWX: імітований гаманець
              не може підписати повідомлення авторизації, тому Nova Connect автоматично відключить його.
            </P>
          </Tabs.Tab>
          <Tabs.Tab>
            <P>
              Вкажіть URL RPC для кожного кластера, який використовує додаток (<Code>mainnet</Code>, <Code>devnet</Code>
              , <Code>testnet</Code>). Публічні ендпоінти <Code>api.*.solana.com</Code> мають рейт-ліміти; у продакшні
              використовуйте власний RPC.
            </P>
            <CodeSnippet index={4} />
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="step-3-add-the-siwx-routes">Крок 3: Додавання маршрутів SIWX</H2>
        <P>
          Сервер генерує nonce, перевіряє криптографічні підписи та зберігає сесії. Для розробки використовуйте сховище
          в пам&apos;яті:
        </P>
        <CodeSnippet index={5} />
        <P>
          Один Next.js Route Handler обслуговує ендпоінти <Code>/api/siwx/nonce</Code>, <Code>/api/siwx/verify</Code>,{' '}
          <Code>/api/siwx/session</Code> та <Code>/api/siwx/logout</Code>:
        </P>
        <CodeSnippet index={6} />
        <P>
          Для продакшн-сховищ на базі Redis, параметрів <Code>allowedChainIds</Code> та часу життя сесії див.{' '}
          <A href="https://siwx.docs.tuwa.io/packages/siwx-server">@tuwaio/siwx-server</A>. Детальніше про механіку
          входу читайте в посібнику з <A href="/guides/multi-chain-auth-siwx-caip122">мультичейн-автентифікації</A>. В
          EVM смарт-контрактні гаманці (Safe, Coinbase Smart Wallet) потребують клієнта для кожного чейну в{' '}
          <Code>verifyOptions.publicClient</Code>; посібник із{' '}
          <A href="/guides/siwx-jwt-external-auth">зовнішньої автентифікації</A> демонструє це разом із маршрутами JWT
          для Coinbase CDP.
        </P>

        <Hr />

        <H2 id="step-4-create-the-transaction-store">Крок 4: Створення сховища транзакцій</H2>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={7} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={8} />
          </Tabs.Tab>
        </Tabs>
        <P>
          Сховище зберігає транзакції в <Code>localStorage</Code> та відстежує стан кожної у фоновому режимі до
          досягнення фінального статусу в блокчейні. Використовуйте власний тип замість базового{' '}
          <Code>Transaction</Code>, щоб строго типізувати корисне навантаження <Code>payload</Code>, як показано в
          посібнику з{' '}
          <A href="/guides/react-transaction-tracking#step-4-create-the-transaction-store">
            відстеження транзакцій у React
          </A>
          .
        </P>

        <Hr />

        <H2 id="step-5-render-the-providers">Крок 5: Рендеринг провайдерів</H2>
        <P>
          Ініціалізуйте адаптер Satellite та параметри SIWX поза компонентом, щоб вони створювалися лише один раз.{' '}
          <Code>NovaConnectProvider</Code> отримує конфігурацію <Code>siwx</Code>: він запитує підпис у кожного
          підключеного гаманця, відключає гаманець у разі відмови та скидає сесію при розриві з&apos;єднання. Не
          передавайте <Code>siwx</Code> у компонент-watcher.
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={9} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={10} />
          </Tabs.Tab>
        </Tabs>
        <P>
          Підключіть провайдери в кореневому макеті, а кнопку підключення розмістіть у будь-якому клієнтському місці:
        </P>
        <CodeSnippet index={11} />
        <CodeSnippet index={12} />
        <P>
          Відкрийте додаток, підключіть гаманець і підпишіть повідомлення: кнопка відобразить адресу підключеного
          гаманця, а на сервері з&apos;явиться дійсна криптографічна сесія.
        </P>
        <P>
          Satellite Connect автоматично відновлює підключення останнього гаманця після перезавантаження. За
          замовчуванням прапорець <Code>rememberWallet</Code> зберігає цей гаманець у <Code>localStorage</Code>, доки
          користувач не натисне Відключити. Шаблони та сайти TUWA передають{' '}
          <Code>rememberWallet=&#123;false&#125;</Code> у <Code>SatelliteConnectProvider</Code>: гаманець зберігається
          лише в <Code>sessionStorage</Code> (до закриття вкладки), якщо користувач не відмітить чекбокс
          &quot;Запам&apos;ятати цей гаманець&quot; у модальному вікні Nova Connect.
        </P>

        <Hr />

        <H2 id="step-6-send-a-tracked-transaction">Крок 6: Відправка відстежуваної транзакції</H2>
        <P>
          Відправка транзакції працює стандартно: сформуйте виклик смарт-контракту (EVM) або інструкцію програми
          (Solana) і передайте результат у метод <Code>executeTxAction</Code> вашого сховища. Використовуйте Кроки 2, 3,
          6 та 7 із{' '}
          <A href="/guides/react-transaction-tracking#step-2-describe-the-contract-or-program">
            посібника з відстеження транзакцій
          </A>
          , змінивши шляхи імпорту:
        </P>
        <Table>
          <Thead>
            <Tr>
              <Th>У посібнику</Th>
              <Th>З єдиним TUWA SDK</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Code>@tuwaio/pulsar-core</Code>
              </Td>
              <Td>
                <Code>@tuwaio/sdk/pulsar</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>@tuwaio/pulsar-react</Code>
              </Td>
              <Td>
                <Code>@tuwaio/sdk/pulsar</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>@tuwaio/orbit-core</Code>
              </Td>
              <Td>
                <Code>@tuwaio/sdk/orbit</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>@tuwaio/nova-connect/components</Code>
              </Td>
              <Td>
                <Code>@tuwaio/sdk/nova-connect/components</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>@tuwaio/nova-connect/satellite</Code>
              </Td>
              <Td>
                <Code>@tuwaio/sdk/nova-connect/satellite</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>@tuwaio/pulsar-evm</Code>
              </Td>
              <Td>
                <Code>@tuwaio/evm-sdk/pulsar</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>@tuwaio/pulsar-solana</Code>
              </Td>
              <Td>
                <Code>@tuwaio/solana-sdk/pulsar</Code>
              </Td>
            </Tr>
          </Tbody>
        </Table>
        <P>
          Транзакція миттєво з&apos;являється у спливаючих тостах Nova та в модальному вікні історії, зберігаючись після
          перезавантаження вкладки. Оновлюйте дані за допомогою хука <Code>useTxFinished</Code>, який гарантовано
          спрацює навіть для транзакцій, що фіналізувалися під час перезавантаження сторінки.
        </P>

        <Hr />

        <H2 id="step-7-read-the-session-on-the-server">Крок 7: Читання сесії на сервері</H2>
        <P>
          Next.js Server Action або API-маршрут може легко перевірити, хто саме авторизований, перш ніж виконувати
          мутацію. Функція <Code>isSessionMatchingTarget</Code> надійно порівнює адресу з підтвердженої серверної сесії
          із цільовою адресою:
        </P>
        <CodeSnippet index={13} />
        <Callout type="warning">
          Ніколи не довіряйте об&apos;єкту сесії, надісланому браузером у тілі запиту: стан SIWX із{' '}
          <Code>@tuwaio/sdk/siwx</Code> на фронтенді є виключно станом UI. Лише криптографічна кука, прочитана на
          сервері, є юридичним і технічним доказом автентифікації.
        </Callout>

        <Hr />

        <H2 id="evm-and-solana-together">🌐 EVM та Solana разом</H2>
        <P>
          Додаток з одночасною підтримкою обох мереж встановлює обидва аддони та поєднує конфігурації: обидва
          налаштування в <Code>appConfig.ts</Code>, обидва адаптери Pulsar у масиві <Code>adapter</Code> сховища, а в{' '}
          <Code>Providers.tsx</Code> — обидва адаптери Satellite, обидва компоненти-watcher та списки мереж:
        </P>
        <CodeSnippet index={14} />
        <P>
          Створюйте масив адаптерів поза компонентом, аналогічно до одиночного адаптера. Стартовий шаблон{' '}
          <strong>nextjs-tuwa-quasar</strong> містить цю конфігурацію у готовому до запуску вигляді разом із Quasar
          Sync.
        </P>

        <Hr />

        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            Синхронізуйте історію транзакцій із Quasar для доступу з будь-якого пристрою:{' '}
            <A href="/guides/quasar-transaction-sync">Посібник із синхронізації з Quasar</A>.
          </Li>
          <Li>
            Передавайте сесію в Coinbase CDP або власні бекенди як стандартизований JWT токен:{' '}
            <A href="/guides/siwx-jwt-external-auth">Зовнішня автентифікація з SIWX JWT</A>.
          </Li>
          <Li>
            Зберігайте дані гаманця в базі даних Supabase під захистом Row Level Security:{' '}
            <A href="/guides/siwx-supabase">Supabase RLS із SIWX</A>.
          </Li>
          <Li>
            Кастомізуйте теми, кольори та тексти модальних вікон:{' '}
            <A href="https://stories.tuwa.io/">Nova UI Kit Storybook</A>.
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>基于 TUWA SDK 构建端到端全栈 Web3 React 应用</H1>
      <P>
        本系统化指南将带领您基于官方 <A href="https://sdk.docs.tuwa.io/">TUWA SDK</A> 从零搭建一个现代化 Next.js App
        Router 全栈应用。完成后您将拥有：
      </P>
      <Ul>
        <Li>通过 Nova Connect 弹窗组件与底层的 Satellite Connect 无头状态机，实现轻量、免绑定的钱包连接；</Li>
        <Li>
          集成基于 CAIP-122 标准的 SIWX 身份认证：用户签名链无关消息，服务端在安全签名的 <Code>HttpOnly</Code> Cookie
          中保存权威会话；
        </Li>
        <Li>通过 Pulsar 交易状态机与 Nova Transactions 组合实现零配置的多链交易跟踪与吐司弹窗反馈；</Li>
        <Li>编写类型安全的 Next.js Server Actions，零数据库依赖即可安全校验调用方钱包权限。</Li>
      </Ul>
      <Callout type="info">
        网络差异步骤提供 <strong>EVM</strong> 与 <strong>Solana</strong>{' '}
        选项卡。选项卡全局同步：选择一次即可跨步骤生效。
      </Callout>

      <Hr />

      <H2 id="before-you-start">准备工作</H2>
      <Ul>
        <Li>
          <strong>Next.js 16 (App Router) 与 React 19.2 或更高版本。</strong>示例使用{' '}
          <Code>&apos;use client&apos;</Code> 指令及 <Code>@/</Code> 路径别名。
        </Li>
        <Li>
          <strong>配置应用根域名</strong>于 <Code>NEXT_PUBLIC_APP_URL</Code>（如 <Code>http://localhost:3000</Code>
          ）：服务端仅接受针对该域名的签名认证请求。
        </Li>
      </Ul>

      <Hr />

      <H2 id="step-1-install-the-packages">步骤 1：安装 SDK 与导入全局设计系统样式</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={0} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={1} />
          <P>pnpm (8+)、npm (7+) 与 Bun 会自动安装 Wallet Standard 对等依赖；使用 Yarn 时请手动补全命令。</P>
        </Tabs.Tab>
      </Tabs>
      <P>在全局 CSS 样式入口引入 Nova UI Kit 核心变量与样式定义：</P>
      <CodeSnippet index={2} />

      <Hr />

      <H2 id="step-2-configure-the-network">步骤 2：配置链端连接池与 RPC 传输通道</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <P>
            在组件树外创建一次 <Code>@wagmi/core</Code> 配置。借助步骤 5 的 <Code>EVMConnectorsWatcher</Code>，
            <strong>完全无需引入 WagmiProvider 或 React Query</strong>：
          </P>
          <CodeSnippet index={3} />
        </Tabs.Tab>
        <Tabs.Tab>
          <P>为应用所支持的每个 Solana 集群列出 RPC 端点地址：</P>
          <CodeSnippet index={4} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-3-add-the-siwx-routes">步骤 3：添加服务端 SIWX 认证路由</H2>
      <P>服务端负责下发随机 Nonce、验证密码学签名并维护 Session 凭证：</P>
      <CodeSnippet index={5} />
      <P>单个 Next.js Route Handler 即可统一处理全部认证生命周期端点：</P>
      <CodeSnippet index={6} />

      <Hr />

      <H2 id="step-4-create-the-transaction-store">步骤 4：初始化 Local-First 交易存储库</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={7} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={8} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-5-render-the-providers">步骤 5：注入 Web3 顶层 Provider 组合</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={9} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={10} />
        </Tabs.Tab>
      </Tabs>
      <P>在根布局组件与首页渲染 Provider 与连接按钮：</P>
      <CodeSnippet index={11} />
      <CodeSnippet index={12} />

      <Hr />

      <H2 id="step-6-send-a-tracked-transaction">步骤 6：发送并追踪区块链交易</H2>
      <P>
        发送交易的方式保持不变：构造智能合约调用（EVM）或程序指令（Solana），将返回的 Promise 传入 Store 的{' '}
        <Code>executeTxAction</Code>。参考
        <A href="/guides/react-transaction-tracking#step-2-describe-the-contract-or-program">交易追踪指南</A>的第
        2、3、6 和 7 步，仅需调整包导入路径：
      </P>
      <Table>
        <Thead>
          <Tr>
            <Th>分包导入（指南示例）</Th>
            <Th>统一 TUWA SDK 导入</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Code>@tuwaio/pulsar-core</Code>
            </Td>
            <Td>
              <Code>@tuwaio/sdk/pulsar</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>@tuwaio/pulsar-react</Code>
            </Td>
            <Td>
              <Code>@tuwaio/sdk/pulsar</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>@tuwaio/orbit-core</Code>
            </Td>
            <Td>
              <Code>@tuwaio/sdk/orbit</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>@tuwaio/nova-connect/components</Code>
            </Td>
            <Td>
              <Code>@tuwaio/sdk/nova-connect/components</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>@tuwaio/nova-connect/satellite</Code>
            </Td>
            <Td>
              <Code>@tuwaio/sdk/nova-connect/satellite</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>@tuwaio/pulsar-evm</Code>
            </Td>
            <Td>
              <Code>@tuwaio/evm-sdk/pulsar</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>@tuwaio/pulsar-solana</Code>
            </Td>
            <Td>
              <Code>@tuwaio/solana-sdk/pulsar</Code>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <P>
        交易发出后将立即展示在 Nova 弹出的 Toast 通知与历史模态框中，即使刷新页面也会被可靠追踪。借助{' '}
        <Code>useTxFinished</Code> Hook 监听终态完成事件，即可驱动业务数据刷新。
      </P>

      <Hr />

      <H2 id="step-7-read-the-session-on-the-server">步骤 7：在服务端 Server Actions 中读取身份凭证</H2>
      <CodeSnippet index={13} />
      <Callout type="warning">
        切勿轻信前端传入的会话状态：前端 SIWX 仅为 UI 状态，只有服务端直接读取验证过的 HttpOnly Cookie
        才是权威所有权证明。
      </Callout>

      <Hr />

      <H2 id="evm-and-solana-together">🌐 EVM 与 Solana 双链协同</H2>
      <CodeSnippet index={14} />

      <Hr />

      <H2 id="next-steps">📚 后续指引</H2>
      <Ul>
        <Li>
          将交易同步至 Quasar Cloud 实现多设备持久化：<A href="/guides/quasar-transaction-sync">Quasar 同步指南</A>。
        </Li>
        <Li>
          使用 JWT 与 JWKS 接入外部认证系统：<A href="/guides/siwx-jwt-external-auth">SIWX JWT 外部认证</A>。
        </Li>
        <Li>
          通过 Supabase RLS 进行行级权限管控：<A href="/guides/siwx-supabase">Supabase RLS 指南</A>。
        </Li>
      </Ul>
    </>
  );
}
