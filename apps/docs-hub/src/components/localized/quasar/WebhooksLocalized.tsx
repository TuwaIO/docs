'use client';

import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function WebhooksLocalized({ locale }: { locale: Locale }) {
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
        <H1>Вебхуки (Webhooks)</H1>
        <P>
          Коли транзакція, синхронізована з Quasar, досягає термінального статусу, Quasar надсилає захищений HTTP{' '}
          <Code>POST</Code>-запит на всі зареєстровані ендпоінти вашого додатку. Кожен запит підписується унікальним
          секретом ендпоінта за алгоритмом HMAC-SHA256, що дозволяє вашому бекенду безпечно оновлювати замовлення,
          баланси та надсилати сповіщення без постійного опитування блокчейну (polling).
        </P>
        <Hr />
        <H2 id="register-an-endpoint">🛠️ Реєстрація ендпоінта</H2>
        <P>
          У панелі керування перейдіть у розділ <strong>Webhooks</strong> та додайте ендпоінт для відповідного додатку:
        </P>
        <Table>
          <thead>
            <Tr>
              <Th>Поле</Th>
              <Th>Призначення та правила</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <strong>URL</strong>
              </Td>
              <Td>
                Куди Quasar надсилатиме сповіщення. Обов&apos;язково за протоколом <Code>https://</Code>, за винятком
                адреси <Code>localhost</Code> для локальної розробки.
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Events</strong>
              </Td>
              <Td>
                Маска <Code>*</Code> (всі події), або окремі події: <Code>transaction:success</Code>,{' '}
                <Code>transaction:failed</Code>, <Code>transaction:replaced</Code>.
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Transaction type filter</strong>
              </Td>
              <Td>
                <Code>*</Code> для всіх типів операцій або точний тип транзакції з вашого Pulsar store (наприклад,{' '}
                <Code>SWAP</Code>, <Code>BRIDGE</Code>, <Code>STAKE</Code>).
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Active</strong>
              </Td>
              <Td>Неактивні ендпоінти не отримують нових доставок і спроб повтору.</Td>
            </Tr>
          </tbody>
        </Table>
        <P>
          Quasar генерує <strong>секрет підпису (signing secret)</strong>: рядок із префіксом <Code>whsec_</Code> та 64
          шістнадцятковими символами (32 криптографічні випадкові байти). Він зберігається в зашифрованому вигляді. Один
          додаток може мати до 500 ендпоінтів.
        </P>
        <Hr />
        <H2 id="the-request">📨 Формат запиту та корисне навантаження</H2>
        <CodeSnippet index={0} />
        <CodeSnippet index={1} />
        <Table>
          <thead>
            <Tr>
              <Th>Поле тіла</Th>
              <Th>Опис даних</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <Code>txKey</Code>, <Code>hash</Code>
              </Td>
              <Td>Унікальний ключ транзакції в Pulsar та її ончейн-хеш у мережі (якщо він уже відомий).</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>status</Code>, <Code>action</Code>
              </Td>
              <Td>
                Фінальний статус: <Code>Success</Code>, <Code>Failed</Code> або <Code>Replaced</Code>; також дублюється
                у заголовку <Code>x-quasar-event</Code>.
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>txType</Code>
              </Td>
              <Td>Тип операції згідно з вашою бізнес-логікою в Pulsar.</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>chainId</Code>
              </Td>
              <Td>
                Мережа виконання у форматі CAIP-2: наприклад, <Code>&quot;1&quot;</Code> для Ethereum, або{' '}
                <Code>&quot;solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp&quot;</Code> для Solana mainnet.
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>timestamp</Code>
              </Td>
              <Td>Час Unix (в секундах), коли було сформовано вебхук.</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>metadata</Code>
              </Td>
              <Td>
                Повний вихідний об&apos;єкт <Code>payload</Code>, переданий клієнтом у Pulsar.
              </Td>
            </Tr>
          </tbody>
        </Table>
        <Hr />
        <H2 id="verify-the-signature">🔐 Верифікація підпису HMAC</H2>
        <P>
          Заголовок <Code>x-quasar-signature</Code> містить шістнадцятковий HMAC-SHA256 від сирого тіла HTTP-запиту,
          підписаний вашим <Code>whsec_...</Code>. Розраховуйте підпис строго над сирим текстом до парсингу в JSON та
          порівнюйте у сталий час:
        </P>
        <CodeSnippet index={2} />
        <Callout type="info">
          Відповідайте успішним статусом <Code>2xx</Code> якомога швидше: Quasar очікує відповіді максимум 10 секунд.
          Тривалі операції (відправку листів, генерацію звітів) виносьте у фонові черги. Обробник повинен бути
          ідемпотентним за парою <Code>(txKey, status)</Code>.
        </Callout>
        <Hr />
        <H2 id="retries-and-delivery-logs">🔁 Повтори доставок та аудит</H2>
        <Ul>
          <Li>
            Якщо доставка не вдалася (таймаут, помилка мережі чи статус, відмінний від <Code>2xx</Code>), система
            автоматично повторює запит до 5 разів з експоненційним інтервалом (від 1 хвилини).
          </Li>
          <Li>
            Усі спроби фіксуються в журналі <strong>Webhook Deliveries</strong> у панелі керування. Будь-які секретні
            ключі автоматично маскуються в тілі відповідей.
          </Li>
          <Li>Ви можете вручну повторити невдалу доставку прямо зі списку записів у панелі.</Li>
          <Li>
            Кожна доставка списує лише 1 одиницю квоти (лише за першу спробу, повтори безкоштовні; дивіться{' '}
            <A href="/quasar/quotas-and-limits">Квоти та ліміти</A>).
          </Li>
        </Ul>
        <Hr />
        <H2 id="local-development">💻 Локальна розробка без ngrok</H2>
        <P>
          Хмарний Quasar не має прямого доступу до вашого <Code>localhost</Code>. Для локального тестування додайте
          ендпоінт із адресою <Code>http://localhost:3000/api/webhooks/quasar</Code>. Quasar Cloud автоматично
          зберігатиме події для локального тунелю <strong>local relay</strong> утиліти CLI <Code>quasar-sdk</Code>, яка
          отримує їх через захищений потік Server-Sent Events і пересилає на ваш локальний сервер з оригінальними
          заголовками підпису:
        </P>
        <CodeSnippet index={3} />
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>Webhook 回调通知 (Webhooks)</H1>
      <P>
        当同步至 Quasar 的交易在链上达成终态（成功、失败或被加速替换）时，Quasar 会自动向您应用配置的 Webhook
        终端节点发起加密签名的 HTTP <Code>POST</Code> 请求。每个请求均采用独立的 Endpoint 密钥进行 HMAC-SHA256
        验签，使得您的后端可以在无需轮询链上节点的前提下，实现确定性的订单核销与余额变更。
      </P>
      <Hr />
      <H2 id="register-an-endpoint">🛠️ 注册与管理 Webhook 节点</H2>
      <P>登录开发者控制台，在对应应用的 Webhooks 面板下添加订阅节点：</P>
      <Table>
        <thead>
          <Tr>
            <Th>配置字段</Th>
            <Th>规范要求与参数说明</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <strong>URL</strong>
            </Td>
            <Td>
              接收回调的 HTTP 地址。生产环境强制要求 <Code>https://</Code>，本地调试允许配置单一 <Code>localhost</Code>{' '}
              节点。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Events</strong>
            </Td>
            <Td>
              支持全选 <Code>*</Code>，或针对性订阅：<Code>transaction:success</Code>, <Code>transaction:failed</Code>,{' '}
              <Code>transaction:replaced</Code>。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Transaction type filter</strong>
            </Td>
            <Td>
              <Code>*</Code> 匹配全量业务类型，或填入在 Pulsar 中定义的具体业务指令（如 <Code>SWAP</Code>,{' '}
              <Code>MINT</Code> 等）。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Active</strong>
            </Td>
            <Td>停用后将立即挂起所有新事件派发与失败重试。</Td>
          </Tr>
        </tbody>
      </Table>
      <P>
        系统将为该节点生成独有的 <strong>签名密钥 (Signing Secret)</strong>：以 <Code>whsec_</Code> 开头的 64
        位十六进制字符串（32 字节随机密钥），且端到端加密存储。每个应用最多可创建 500 个接收节点。
      </P>
      <Hr />
      <H2 id="the-request">📨 回调请求规范与载荷结构</H2>
      <CodeSnippet index={0} />
      <CodeSnippet index={1} />
      <Table>
        <thead>
          <Tr>
            <Th>载荷字段</Th>
            <Th>语义解析</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <Code>txKey</Code>, <Code>hash</Code>
            </Td>
            <Td>Pulsar 交易唯一幂等键以及对应的链上交易哈希（若已产出）。</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>status</Code>, <Code>action</Code>
            </Td>
            <Td>
              最终状态：<Code>Success</Code>, <Code>Failed</Code> 或 <Code>Replaced</Code>；同时同步在{' '}
              <Code>x-quasar-event</Code> 响应头中。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>txType</Code>
            </Td>
            <Td>同步时客户端声明的业务类型字符串。</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>chainId</Code>
            </Td>
            <Td>
              CAIP-2 标准网络标识符，例如 EVM 的 <Code>&quot;1&quot;</Code> 或 Solana 主网的{' '}
              <Code>&quot;solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp&quot;</Code>。
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>timestamp</Code>
            </Td>
            <Td>Webhook 投递任务生成的 Unix 时间戳（秒）。</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>metadata</Code>
            </Td>
            <Td>Pulsar 客户端在发起交易时携带的完整业务 Payload。</Td>
          </Tr>
        </tbody>
      </Table>
      <Hr />
      <H2 id="verify-the-signature">🔐 服务端 HMAC 验签与幂等处理</H2>
      <P>
        HTTP 请求头 <Code>x-quasar-signature</Code> 是基于完整原始 Body 计算的 HMAC-SHA256 签名。在解析 JSON
        之前，必须针对原始字节执行恒定时间 (Constant-Time) 比对，防止时序攻击：
      </P>
      <CodeSnippet index={2} />
      <Callout type="info">
        请在 10 秒超时窗口内尽快返回 <Code>2xx</Code> 确认状态；耗时任务请推入异步队列。业务处理逻辑请务必依据{' '}
        <Code>(txKey, status)</Code> 实现幂等消费。
      </Callout>
      <Hr />
      <H2 id="retries-and-delivery-logs">🔁 自动重试与投递审计日志</H2>
      <Ul>
        <Li>因网络超时或返回非 2xx 状态码失败的投递，系统将进行最多 5 次指数退避重试（起始间隔 1 分钟）。</Li>
        <Li>控制台 Webhook Deliveries 页面记录全量请求流水，敏感关键词（如 secret, key, token）将自动脱敏。</Li>
        <Li>在调试或故障恢复后，可在控制台日志条目上点击一键重新投递。</Li>
        <Li>
          每次投递仅在首次尝试时消耗 1 个配额点数，后续重试完全免费（参见{' '}
          <A href="/quasar/quotas-and-limits">配额与速率限制</A>）。
        </Li>
      </Ul>
      <Hr />
      <H2 id="local-development">💻 本地无公网 IP 调试 (Local Relay)</H2>
      <P>
        Quasar Cloud 无法直连本地 <Code>localhost</Code>。您可以在控制台配置唯一的本地节点（例如{' '}
        <Code>http://localhost:3000/api/webhooks/quasar</Code>），并通过官方 CLI 的 SSE 中继服务实现无缝转发：
      </P>
      <CodeSnippet index={3} />
    </>
  );
}
