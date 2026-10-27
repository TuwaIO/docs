'use client';

import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function AppsKeysLocalized({ locale }: { locale: Locale }) {
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
  const Th = mdx.th ?? 'th';
  const Tr = mdx.tr ?? 'tr';
  const Td = mdx.td ?? 'td';

  if (locale === 'uk') {
    return (
      <>
        <H1>Додатки та ключі (Apps & Keys)</H1>
        <P>
          Кожна інтеграція з Quasar починається зі створення <strong>додатка (App)</strong>: саме він володіє
          синхронізованими транзакціями, точками підключення вебхуків та API-ключами. У Quasar Cloud додаток належить
          організації (до 30 додатків на кожну); версія Community Edition використовує єдиний робочий простір.
        </P>
        <Hr />
        <H2 id="create-an-app">🛠️ Створення додатка</H2>
        <P>
          У <A href="https://quasar.tuwa.io/">панелі керування Quasar</A> (або в панелі <Code>/admin</Code> вашої
          власної ноди) відкрийте розділ <strong>Apps</strong> та натисніть «Створити додаток». Оберіть середовище (
          <strong>environment</strong>):
        </P>
        <Ul>
          <Li>
            <strong>Live</strong> — для реального продакшн-трафіку. Ключі мають префікси <Code>sk_live_</Code> та{' '}
            <Code>pk_live_</Code>.
          </Li>
          <Li>
            <strong>Test</strong> — для розробки та тестування. Ключі починаються з <Code>sk_test_</Code> та{' '}
            <Code>pk_test_</Code>, а вартість синхронізації транзакцій удвічі менша, ніж у Live (дивіться{' '}
            <A href="/quasar/quotas-and-limits">Квоти та ліміти</A>).
          </Li>
        </Ul>
        <P>Обидва середовища відстежують транзакції за абсолютно однаковими алгоритмами та правилами консенсусу.</P>
        <Hr />
        <H2 id="secret-key-and-public-key">🔑 Секретний та публічний ключі</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Тип ключа</Th>
              <Th>Префікс</Th>
              <Th>Заголовок HTTP</Th>
              <Th>Дозволені операції</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <strong>Secret key</strong>
              </Td>
              <Td>
                <Code>sk_live_</Code>, <Code>sk_test_</Code>
              </Td>
              <Td>
                <Code>x-tuwa-secret-key</Code>
              </Td>
              <Td>Усі ендпоінти: синхронізація транзакцій, керування вебхуками, читання історії</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Public key</strong>
              </Td>
              <Td>
                <Code>pk_live_</Code>, <Code>pk_test_</Code>
              </Td>
              <Td>
                <Code>x-tuwa-public-key</Code>
              </Td>
              <Td>
                Тільки безпечні read-only запити без доступу до персональних даних (наприклад,{' '}
                <Code>GET /v1/engine/test-ping</Code>)
              </Td>
            </Tr>
          </tbody>
        </Table>
        <Ul>
          <Li>
            <strong>Зберігайте секретний ключ виключно на бекенді</strong> (змінна оточення, Next.js Server Action, API
            Route). Будь-хто, хто заволодіє секретним ключем, зможе синхронізувати транзакції від імені вашого додатку
            та витрачати його квоту. Пакет <Code>@tuwaio/quasar-sdk</Code> передає заголовок автоматично:
          </Li>
        </Ul>
        <CodeSnippet index={0} />
        <Ul>
          <Li>
            <strong>Публічний ключ призначений лише для читання</strong> і не надає доступу до даних ваших користувачів:
            будь-який <Code>POST</Code>-запит або запит історії з публічним ключем відхиляється зі статусом{' '}
            <Code>403 Forbidden</Code>. Читайте історію транзакцій на власному сервері за допомогою секретного ключа і
            показуйте користувачеві лише операції його власного верифікованого гаманця (перевіряйте сесію SIWX перед
            запитом).
          </Li>
          <Li>
            <strong>Безпечне збереження:</strong> Quasar зберігає секретні ключі у зашифрованому вигляді та шукає їх за
            криптографічним хешем SHA-256. Перегляд ключа в панелі керування вимагає введення пароля (та коду 2FA, якщо
            його ввімкнено).
          </Li>
          <Li>
            <strong>Ротація ключів:</strong> оновлення (рол) секретного ключа в налаштуваннях додатку миттєво генерує
            новий ключ і блокує старий. Одразу після цього оновіть змінні оточення на вашому продакшн-сервері.
          </Li>
        </Ul>
        <Hr />
        <H2 id="app-settings-that-restrict-requests">🛡️ Налаштування безпеки та фільтрації</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Параметр</Th>
              <Th>Ефект і поведінка</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <strong>Active</strong>
              </Td>
              <Td>
                Вимкнений додаток миттєво відхиляє будь-які вхідні запити до API зі статусом <Code>403 Forbidden</Code>.
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>IP allowlist</strong>
              </Td>
              <Td>
                Якщо список не порожній, дозволяються лише запити з указаних IP-адрес (решта отримують <Code>403</Code>
                ).
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Domain allowlist</strong>
              </Td>
              <Td>
                Якщо список не порожній, запити повинні містити заголовки <Code>Origin</Code> або <Code>Referer</Code>{' '}
                із дозволеного списку доменів. Запити типу Server-to-Server з <Code>@tuwaio/quasar-sdk</Code> таких
                заголовків не надсилають, тому для серверних додатків залишайте це поле порожнім.
              </Td>
            </Tr>
          </tbody>
        </Table>
        <P>
          У налаштуваннях додатку також вказуються ваші власні провайдери RPC та ключі (Alchemy, QuickNode, Pimlico,
          Gelato) для механізмів трекінгу. Quasar зберігає їх у зашифрованому вигляді та блокує будь-які приватні та
          loopback адреси вузлів.
        </P>
        <Callout type="important">
          <strong>У Quasar Cloud додайте RPC-провайдер перед початком синхронізації:</strong> RPC-ендпоінт для кожної
          мережі, ключ Alchemy або ключ QuickNode. Хмарна версія відстежує операції виключно через провайдери вашого
          додатку (ERC-4337 через Pimlico/bundler, Gelato через ваш ключ). Транзакція в мережі, для якої у додатку немає
          налаштованого провайдера, буде відхилена з помилкою <Code>422 Unprocessable Entity</Code> без збереження в
          базі. Спільнотна версія (Community Edition) додатково підтримує глобальні резервні RPC оператора та
          відстеження операцій Safe.
        </Callout>
        <Hr />
        <H2 id="isolation-between-apps">🏢 Сувора ізоляція між додатками</H2>
        <P>
          Quasar ідентифікує додаток за ключем у кожному запиті та взаємодіє виключно з транзакціями цього конкретного
          додатка: історія одного додатку ніколи не містить транзакцій іншого, навіть якщо вони належать до однієї
          організації. Доставка вебхуків додатково валідується за ідентифікаторами організації та додатку перед кожною
          відправкою.
        </P>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>应用与密钥管理 (Apps & Keys)</H1>
      <P>
        与 Quasar 的每一次系统集成均以 <strong>应用 (App)</strong> 为边界起点：应用独立拥有所有已同步的链上交易、Webhook
        终端配置和 API 凭据。在 Quasar Cloud 中，每个组织最多可创建 30 个应用；开源社区版 (Community Edition)
        则提供统一的单租户工作区。
      </P>
      <Hr />
      <H2 id="create-an-app">🛠️ 创建与配置应用</H2>
      <P>
        登录 <A href="https://quasar.tuwa.io/">Quasar 开发者控制台</A>（或私有节点的 <Code>/admin</Code> 后台），进入{' '}
        <strong>Apps</strong> 面板点击新建。选择对应的运行环境 (<strong>environment</strong>)：
      </P>
      <Ul>
        <Li>
          <strong>Live (生产环境)</strong>：承接真实主网业务流量，API 密钥前缀为 <Code>sk_live_</Code> 与{' '}
          <Code>pk_live_</Code>。
        </Li>
        <Li>
          <strong>Test (测试环境)</strong>：用于日常开发调试与测试网集成，密钥前缀为 <Code>sk_test_</Code> 与{' '}
          <Code>pk_test_</Code>，同步交易所消耗的配额费率仅为生产环境的一半（详情参见{' '}
          <A href="/quasar/quotas-and-limits">配额与速率限制</A>）。
        </Li>
      </Ul>
      <P>两种环境在交易状态机计算、确定性终态确认和 Webhook 调度逻辑上完全一致。</P>
      <Hr />
      <H2 id="secret-key-and-public-key">🔑 Secret Key 与 Public Key 的职责边界</H2>
      <Table>
        <thead>
          <Tr>
            <Th>密钥类型</Th>
            <Th>识别前缀</Th>
            <Th>HTTP 请求头</Th>
            <Th>接口访问权限</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <strong>Secret key (服务端私钥)</strong>
            </Td>
            <Td>
              <Code>sk_live_</Code>, <Code>sk_test_</Code>
            </Td>
            <Td>
              <Code>x-tuwa-secret-key</Code>
            </Td>
            <Td>全量接口：同步链上交易、Webhook 回调订阅、查询全局历史记录</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Public key (前端公钥)</strong>
            </Td>
            <Td>
              <Code>pk_live_</Code>, <Code>pk_test_</Code>
            </Td>
            <Td>
              <Code>x-tuwa-public-key</Code>
            </Td>
            <Td>
              严格只读，仅允许不涉及用户隐私的连通性探测接口（如 <Code>GET /v1/engine/test-ping</Code>）
            </Td>
          </Tr>
        </tbody>
      </Table>
      <Ul>
        <Li>
          <strong>务必将 Secret Key 保留在后端安全环境</strong>（环境变量、Next.js Server Action、API Route
          或微服务配置中心）。任何持有该密钥的客户端均可向您的应用注入交易并消耗账户配额。官方{' '}
          <Code>@tuwaio/quasar-sdk</Code> 会自动封装鉴权头：
        </Li>
      </Ul>
      <CodeSnippet index={0} />
      <Ul>
        <Li>
          <strong>Public Key 具备严格防泄露保护</strong>，无法读取任何用户的链上数据：携带 Public Key 发起的{' '}
          <Code>POST</Code> 写入或历史记录读取均会被 API 返回 <Code>403 Forbidden</Code> 拦截。请务必在自有后端使用
          Secret Key 查询数据，并严格比对 SIWX 会话仅向用户呈现其已签名的钱包历史。
        </Li>
        <Li>
          <strong>加密存储与哈希检索：</strong>Quasar 对 Secret Key 进行端到端加密存储，并通过 SHA-256
          哈希进行极速索引匹配。在控制台明文查看密钥必须通过账户密码及 2FA 双重身份验证。
        </Li>
        <Li>
          <strong>密钥紧急轮换 (Key Rolling)：</strong>
          在应用设置中点击轮换密钥将立即废弃旧密钥并派发新凭证。请在轮换后第一时间更新生产服务配置。
        </Li>
      </Ul>
      <Hr />
      <H2 id="app-settings-that-restrict-requests">🛡️ 应用访问策略与安全防御</H2>
      <Table>
        <thead>
          <Tr>
            <Th>防御配置</Th>
            <Th>防护机制与阻断行为</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <strong>Active (激活状态)</strong>
            </Td>
            <Td>
              一旦禁用该应用，所有携带该应用密钥的 API 请求将立即被拒绝并返回 <Code>403 Forbidden</Code>。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>IP allowlist (IP 白名单)</strong>
            </Td>
            <Td>
              启用后仅接收来自指定白名单 IP 地址的 API 调用，未授权来源直接阻断并返回 <Code>403</Code>。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Domain allowlist (域名白名单)</strong>
            </Td>
            <Td>
              配置后请求必须携带合法匹配的 <Code>Origin</Code> 或 <Code>Referer</Code> 头部。标准后端环境使用{' '}
              <Code>@tuwaio/quasar-sdk</Code> 发起的请求不包含此类浏览器头部，因此纯后端应用请保持该列表为空。
            </Td>
          </Tr>
        </tbody>
      </Table>
      <P>
        此外，应用设置中还用于登记您的链端 RPC 节点及第三方服务商凭据 (Alchemy, QuickNode, Pimlico, Gelato)。Quasar
        实施强加密存储，并在建立连接时严格拦截内网及本地回环 (loopback) 目标。
      </P>
      <Callout type="important">
        <strong>在 Quasar Cloud 中，必须先配置 RPC 提供商再同步交易：</strong>
        为您启用的链配置专用 RPC 节点或填入 Alchemy/QuickNode Key。云端引擎完全通过应用自身配置的节点拉取确认；ERC-4337
        需要 Pimlico Bundler 凭证，Gelato 自动化任务需要其专用 Key。如未配置链端提供商，API 将以{' '}
        <Code>422 Unprocessable Entity</Code> 拒绝同步且不存库。自建社区版支持运营商全局兜底 RPC 及 Safe 多签同步。
      </Callout>
      <Hr />
      <H2 id="isolation-between-apps">🏢 应用间多租户严格隔离</H2>
      <P>
        Quasar 在每个进入 API 网关的请求中直接反解应用标识，所有的读取与写入在数据库层面均被 <Code>appId</Code>{' '}
        严格限制：同一组织内不同应用的交易历史绝对物理隔离，互不可见。Webhook
        投递在分发时也严格比对归属组织与应用，杜绝越权风险。
      </P>
    </>
  );
}
