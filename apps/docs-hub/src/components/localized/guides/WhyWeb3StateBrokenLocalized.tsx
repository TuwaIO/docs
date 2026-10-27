'use client';

import { Mermaid } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

const LIFECYCLE_FLOWCHART_UK = `flowchart TD
    Start([Користувач ініціює дію]) --> Init[Ініціалізація]
    Init --> Prompt[Запит: Очікування підпису]

    Prompt -->|Користувач відхилив / Помилка RPC| Aborted([Перервано: Відхилено користувачем])
    Prompt -->|Підписано та надіслано<br/>Хеш отримано| Mempool[У мемпулі: Очікує в нодах]

    Mempool -->|Speed-Up: Той самий Nonce<br/>+ Вищий газ| Replaced([Замінено: Новий хеш заміни])

    Mempool -->|Скасування: Переказ 0 ETH<br/>на власну адресу| Cancelled([Скасовано: Nonce використано])

    Mempool -->|Стрибок Base Fee<br/>або розрив Nonce| Dropped[Випало: Dropped]
    Dropped --> Failed([Невдача: Видалено з мемпулу])

    Mempool ==>|Включено до блоку| Processed[Оброблено: Оптимістичний блок 0]

    Processed -->|Status 0: Помилка виконання<br/>Out of Gas / Require Failed| Reverted([Reverted: Збій ончейн])
    Processed ==>|Status 1: Успішне виконання<br/>Перевірка глибини блоків| Confirmed[Підтверджено: Захист від реорганізації]
    Confirmed ==>|Фінальність Proof-of-Stake| Finalized([Фіналізовано: Незмінний стан])

    classDef default fill:#111827,stroke:#6366f1,stroke-width:1.5px,color:#f8fafc;
    classDef success fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5;
    classDef danger fill:#4c0519,stroke:#f43f5e,stroke-width:1.5px,color:#fff1f2;
    classDef warning fill:#451a03,stroke:#f59e0b,stroke-width:1.5px,color:#fffbeb;
    classDef neutral fill:#0f172a,stroke:#475569,stroke-width:1.5px,color:#cbd5e1;

    class Start,Init,Prompt neutral;
    class Finalized success;
    class Aborted,Reverted,Failed danger;
    class Cancelled,Replaced,Dropped warning;
    class Mempool,Processed,Confirmed default;`;

const LIFECYCLE_FLOWCHART_ZH = `flowchart TD
    Start([用户发起操作]) --> Init[初始化中]
    Init --> Prompt[提示: 等待钱包签名]

    Prompt -->|用户拒绝 / RPC 错误| Aborted([已中止: 用户拒绝])
    Prompt -->|已签名并广播<br/>获取交易哈希| Mempool[进入内存池: 节点排队中]

    Mempool -->|加速交易: 相同 Nonce<br/>+ 更高 Gas| Replaced([已替换: 触发替换哈希])

    Mempool -->|取消交易: 0金额<br/>自转账| Cancelled([已取消: Nonce 已消耗])

    Mempool -->|Base Fee 暴涨<br/>或 Nonce 空缺| Dropped[已掉包: Dropped]
    Dropped --> Failed([失败: 被逐出内存池])

    Mempool ==>|被区块打包| Processed[已处理: 乐观区块 0]

    Processed -->|Status 0: 执行回滚<br/>Out of Gas / Require 失败| Reverted([已回滚: 链上执行失败])
    Processed ==>|Status 1: 有效执行<br/>区块确认深度校验| Confirmed[已确认: 抗分叉重组]
    Confirmed ==>|PoS 共识终局性| Finalized([已终结: 状态不可篡改])

    classDef default fill:#111827,stroke:#6366f1,stroke-width:1.5px,color:#f8fafc;
    classDef success fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ecfdf5;
    classDef danger fill:#4c0519,stroke:#f43f5e,stroke-width:1.5px,color:#fff1f2;
    classDef warning fill:#451a03,stroke:#f59e0b,stroke-width:1.5px,color:#fffbeb;
    classDef neutral fill:#0f172a,stroke:#475569,stroke-width:1.5px,color:#cbd5e1;

    class Start,Init,Prompt neutral;
    class Finalized success;
    class Aborted,Reverted,Failed danger;
    class Cancelled,Replaced,Dropped warning;
    class Mempool,Processed,Confirmed default;`;

export function WhyWeb3StateBrokenLocalized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const H3 = mdx.h3 ?? 'h3';
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
        <H1>Чому керування станом Web3-транзакцій зламане (і чому useState — це антипатерн)</H1>
        <P>
          Більшість Web3-фронтендів ставляться до операцій із блокчейном так само, як до звичайних HTTP-запитів{' '}
          <Code>POST</Code>: вони викликають RPC, вішають спіннер завантаження на локальний <Code>useState</Code>{' '}
          React-компонента і сподіваються, що користувач нікуди не перейде, доки мережа не поверне хеш транзакції.
        </P>
        <CodeSnippet index={0} />
        <P>
          Цей підхід є хибним у самій своїй основі. Він миттєво ламається, як тільки стикається з реальною механікою
          розподілених мереж: перевантаженням мемпулу, стрибками комісій за газ, скиданням нонсів, прискоренням
          транзакцій усередині гаманця (Speed-Up / Replace), зміною вкладок або маршрутів додатку.
        </P>

        <Hr />

        <H2 id="1-the-distributed-state-mismatch">1. Невідповідність розподіленого стану</H2>
        <P>У класичній клієнт-серверній архітектурі Web2 запит має синхронний, бінарний життєвий цикл:</P>
        <CodeSnippet index={1} />
        <P>
          <strong>Транзакція в блокчейні — це не HTTP-запит.</strong> Це асинхронний, багатофазний перехід стану у
          децентралізованій одноранговій (P2P) мережі:
        </P>
        <div className="my-6 overflow-x-auto">
          <Mermaid chart={LIFECYCLE_FLOWCHART_UK} />
        </div>

        <Hr />

        <H2 id="2-four-production-failure-modes-of-usestate">2. Чотири продакшн-збої useState</H2>
        <H3 id="failure-mode-1-the-component-unmount-bug">Збій 1: Розмонтування компонента</H3>
        <P>
          Якщо користувач ініціював транзакцію і перейшов на іншу сторінку додатку, компонент із <Code>useState</Code>{' '}
          розмонтовується. Проміс <Code>waitForTransactionReceipt</Code> втрачається, інтерфейс «забуває» про
          транзакцію, а користувач повторно тисне кнопку та двічі списує кошти.
        </P>

        <H3 id="failure-mode-2-the-mempool-replacement-trap-speed-ups-and-cancels">
          Збій 2: Пастка заміни в мемпулі (пришвидшення та скасування)
        </H3>
        <P>
          Користувач натискає «Speed Up» у MetaMask, надсилаючи нову транзакцію <Code>T2</Code> із тим самим нонсом{' '}
          <Code>N</Code> і вищим пріоритетом, що генерує абсолютно інший хеш:
        </P>
        <CodeSnippet index={2} />
        <P>У наївному коді компонента розробники просто очікують квитанцію початкового хешу:</P>
        <CodeSnippet index={3} />
        <P>
          Ваш компонент продовжує очікувати старий хеш, якого більше ніколи не буде включено в блок, і назавжди зависає
          в нескінченному завантаженні. Pulsar вирішує це, перехоплюючи подію <Code>onReplaced</Code> на рівні адаптера
          та оновлюючи запис у центральному сховищі.
        </P>

        <H3 id="failure-mode-3-cross-tab--browser-reload-amnesia">Збій 3: Амнезія вкладок та перезавантаження</H3>
        <P>
          Локальний стан React ізольований у пам&apos;яті конкретної вкладки браузера. Якщо користувач перезавантажить
          сторінку або відкриє додаток у кількох вкладках, стан непідтверджених транзакцій безповоротно втрачається.
        </P>

        <H3 id="failure-mode-4-soft-confirmations-finality--blockhash-expiry">
          Збій 4: Софт-підтвердження, фінальність та експірація блохешу
        </H3>
        <P>
          Більшість примітивних рішень вважають транзакцію завершеною одразу після першого включення в блок (block 0).
          На швидких мережах на кшталт Solana або L2 реорганізація блоку анулює таку транзакцію. У Solana транзакція
          повинна відстежуватися до статусу <Code>finalized</Code>, а у випадку відсутності підтвердження — перевірятися
          за <Code>lastValidBlockHeight</Code>:
        </P>
        <Table>
          <Thead>
            <Tr>
              <Th>Етап</Th>
              <Th>Статус у Solana</Th>
              <Th>Статус в EVM Rollup</Th>
              <Th>Чи безпечно вважати завершеною?</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>Оптимістичний</strong>
              </Td>
              <Td>
                <Code>processed</Code>
              </Td>
              <Td>Квитанція L2 Sequencer</Td>
              <Td>⚠️ Можливий re-org</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Безпечний консенсус</strong>
              </Td>
              <Td>
                <Code>confirmed</Code>
              </Td>
              <Td>Публікація батчу в L1</Td>
              <Td>✅ Висока впевненість</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Незмінний</strong>
              </Td>
              <Td>
                <Code>finalized</Code>
              </Td>
              <Td>Фіналізований стан L1</Td>
              <Td>🔒 Математично незворотно</Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="3-the-solution-decoupled-local-first-state-machines">
          3. Рішення: відокремлені local-first стейт-машини
        </H2>
        <P>
          Для побудови стійких Web3-фронтендів відстеження транзакцій{' '}
          <strong>ніколи не повинно жити в React-компонентах</strong>. Воно має працювати в автономній безголовій
          (headless) стейт-машині поза деревом DOM:
        </P>
        <CodeSnippet index={4} />
        <P>Чотири фундаментальні правила надійної архітектури транзакцій:</P>
        <Ul>
          <Li>
            <strong>Персистентне сховище як єдине джерело правди:</strong> серіалізація в localStorage перед очікуванням
            мережі.
          </Li>
          <Li>
            <strong>Відстеження заміни за нонсом:</strong> перехоплення <Code>onReplaced</Code> та збереження нового
            хешу.
          </Li>
          <Li>
            <strong>Автоматичне відновлення пулу:</strong> підхоплення незавершених транзакцій після перезавантаження
            сторінки.
          </Li>
          <Li>
            <strong>Пасивні селектори UI:</strong> компоненти лише підписуються на зрізи стану без керування промісами.
          </Li>
        </Ul>

        <Hr />

        <H2 id="4-implementation-in-the-tuwa-ecosystem">4. Реалізація в екосистемі TUWA</H2>
        <H3 id="step-1-define-strongly-typed-transaction-unions">
          Крок 1: Визначення строго типізованих юніонів транзакцій
        </H3>
        <CodeSnippet index={5} />

        <H3 id="step-2-initialize-the-persistent-pulsar-store">Крок 2: Ініціалізація персистентного сховища Pulsar</H3>
        <P>Створіть екземпляр headless-сховища з мультичейн-адаптерами та local-first персистентністю:</P>
        <CodeSnippet index={6} />
        <P>Server Action для верифікації SIWX сесії та викликів Quasar SDK на бекенді:</P>
        <CodeSnippet index={7} />

        <H3 id="step-3-dispatching-write-actions-via-executetxaction">
          Крок 3: Відправка дій запису через executeTxAction
        </H3>
        <P>Замість вбудовування викликів гаманця всередину компонента, винесіть дію у чисту @wagmi/core функцію:</P>
        <CodeSnippet index={8} />
        <CodeSnippet index={9} />

        <H3 id="step-4-resuming-active-trackers-on-page-reload">Крок 4: Відновлення трекерів після перезавантаження</H3>
        <CodeSnippet index={10} />

        <H3 id="step-5-passive-ui-subscriptions-via-selectors">Крок 5: Пасивні підписки UI через селектори</H3>
        <CodeSnippet index={11} />

        <H3 id="step-6-reactions-that-survive-a-reload">Крок 6: Реакції, стійкі до перезавантаження</H3>
        <CodeSnippet index={12} />

        <Hr />

        <H2 id="5-architectural-comparison-usestate-vs-pulsar">5. Порівняння: useState проти Pulsar</H2>
        <Table>
          <Thead>
            <Tr>
              <Th>Сценарій</Th>
              <Th>Нативний useState</Th>
              <Th>TUWA Pulsar</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>Зміна сторінки</strong>
              </Td>
              <Td>❌ Проміс знищується при розмонтуванні</Td>
              <Td>✅ Живе незалежно від DOM у центральному сховищі</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Прискорення / Скасування</strong>
              </Td>
              <Td>❌ Зависає або викидає помилку на новому хеші</Td>
              <Td>
                ✅ Перехоплює <Code>onReplaced</Code>, фіксує <Code>Replaced</Code>, зберігає{' '}
                <Code>replacedTxHash</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Перезавантаження браузера</strong>
              </Td>
              <Td>❌ Стан очікування втрачається; скидається до idle</Td>
              <Td>✅ Автоматично продовжує відстеження пулу при монтуванні</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Реакція після оновлення</strong>
              </Td>
              <Td>❌ Код ланцюжка промісу більше не виконується</Td>
              <Td>
                ✅ <Code>onTxFinished</Code> та <Code>useTxFinished</Code> спрацьовують один раз для кожної завершеної
                транзакції навіть після перезавантаження
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Синхронізація вкладок</strong>
              </Td>
              <Td>❌ Вкладки повністю десинхронізовані</Td>
              <Td>✅ Миттєва синхронізація через storage events між усіма вкладками</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Мультичейн (EVM + Solana)</strong>
              </Td>
              <Td>❌ Спагеті з кастомних несумісних хуків</Td>
              <Td>✅ Єдиний інтерфейс адаптерів для EVM та кластерів Solana</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Обробка Re-Org та Revert</strong>
              </Td>
              <Td>❌ Викидає сиру неформатовану помилку в компонент</Td>
              <Td>
                ✅ Структурований <Code>TransactionStatus</Code> із нормалізованим об&apos;єктом помилки
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Софт-підтвердження (Solana)</strong>
              </Td>
              <Td>
                ❌ Один boolean: завершено на <Code>confirmed</Code> або довге очікування <Code>finalized</Code>
              </Td>
              <Td>
                ✅ <Code>confirmationStatus</Code> сигналізує <Code>confirmed</Code>, доки транзакція очікує;{' '}
                <Code>Success</Code> на <Code>finalized</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Втрачена транзакція (Solana)</strong>
              </Td>
              <Td>❌ Зависає в pending до довільного таймауту</Td>
              <Td>
                ✅ Фіксує помилку після експірації blockhash (<Code>lastValidBlockHeight</Code>) з причиною в{' '}
                <Code>error</Code>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="conclusion">Висновки</H2>
        <P>
          Спроба трактувати ончейн-транзакції як прості асинхронні проміси породжує критичні баги в продакшні.
          Відокремлення виконання від дерева React, персистентне local-first збереження та активний моніторинг мемпулу
          забезпечують детерміновану надійність додатків на базі екосистеми TUWA.
        </P>

        <Hr />

        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="https://pulsar.docs.tuwa.io/">Документація Pulsar</A>: низькорівневі API трекерів та адаптерів.
          </Li>
          <Li>
            <A href="/guides/react-transaction-tracking">Відстеження транзакцій у React</A>: покроковий практичний
            посібник.
          </Li>
          <Li>
            <A href="/guides/quasar-transaction-sync">Синхронізація транзакцій із Quasar</A>: хмарний індексатор.
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>为什么 Web3 交易状态管理充满缺陷（以及为什么 useState 是反模式）</H1>
      <P>
        绝大多数 Web3 前端将链上交易视同普通 HTTP <Code>POST</Code> 请求：调用 RPC，在组件的 <Code>useState</Code>{' '}
        中设置加载状态，并祈祷用户在交易确认前不要离开当前页面。
      </P>
      <CodeSnippet index={0} />
      <P>这种模式存在根本性设计缺陷，在真实网络拥堵、矿工费激增或加速交易时会立即崩溃。</P>

      <Hr />

      <H2 id="1-the-distributed-state-mismatch">1. 分布式网络的状态失配</H2>
      <P>在传统 Web2 客户端-服务器架构中，请求遵循同步的二元生命周期：</P>
      <CodeSnippet index={1} />
      <P>区块链交易并非简单的请求响应，而是分布式的多阶段状态跃迁：</P>
      <div className="my-6 overflow-x-auto">
        <Mermaid chart={LIFECYCLE_FLOWCHART_ZH} />
      </div>

      <Hr />

      <H2 id="2-four-production-failure-modes-of-usestate">2. useState 的四大致命生产级故障</H2>
      <H3 id="failure-mode-1-the-component-unmount-bug">故障 1：组件卸载导致追踪丢失</H3>
      <P>页面跳转销毁组件实例与未决 Promise，造成状态丢失与重复扣款。</P>

      <H3 id="failure-mode-2-the-mempool-replacement-trap-speed-ups-and-cancels">故障 2：加速与替换交易陷阱</H3>
      <P>用户在钱包中点击 Speed Up，以相同 Nonce 发送更高 Gas 的新交易，产生全新的交易哈希：</P>
      <CodeSnippet index={2} />
      <P>而在简单的组件代码中，开发者仅等待初始哈希的收据：</P>
      <CodeSnippet index={3} />
      <P>
        组件仍苦等旧 Hash 陷入永久加载。Pulsar 在适配器层拦截 <Code>onReplaced</Code> 事件并持久化替换哈希。
      </P>

      <H3 id="failure-mode-3-cross-tab--browser-reload-amnesia">故障 3：多标签页与刷新健忘症</H3>
      <P>React 内存状态随刷新灰飞烟灭，多标签页无法共享交易进度。</P>

      <H3 id="failure-mode-4-soft-confirmations-finality--blockhash-expiry">故障 4：软确认与区块高度失效</H3>
      <P>初次出块不代表最终确认，Solana 等高速链或 Rollup 必须校验至 finalized 或处理超时判定：</P>
      <Table>
        <Thead>
          <Tr>
            <Th>阶段</Th>
            <Th>Solana 状态</Th>
            <Th>EVM Rollup 状态</Th>
            <Th>是否足以判定成功？</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>乐观阶段</strong>
            </Td>
            <Td>
              <Code>processed</Code>
            </Td>
            <Td>L2 排序器收据 (Sequencer Receipt)</Td>
            <Td>⚠️ 存在重组可能</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>共识安全</strong>
            </Td>
            <Td>
              <Code>confirmed</Code>
            </Td>
            <Td>L1 批次已提交 (Batch Submission)</Td>
            <Td>✅ 极高可信度</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>不可篡改</strong>
            </Td>
            <Td>
              <Code>finalized</Code>
            </Td>
            <Td>L1 最终确认状态 (Finalized)</Td>
            <Td>🔒 数学上完全不可逆</Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="3-the-solution-decoupled-local-first-state-machines">3. 架构解法：本地优先的状态机</H2>
      <CodeSnippet index={4} />

      <Hr />

      <H2 id="4-implementation-in-the-tuwa-ecosystem">4. TUWA 生态实操落地</H2>
      <H3 id="step-1-define-strongly-typed-transaction-unions">步骤 1：定义强类型业务交易联合类型</H3>
      <CodeSnippet index={5} />

      <H3 id="step-2-initialize-the-persistent-pulsar-store">步骤 2：初始化持久化 Pulsar Store</H3>
      <P>实例化包含跨链适配器与 Local-First 持久化能力的无头状态机：</P>
      <CodeSnippet index={6} />
      <P>在服务端 Server Actions 中完成 SIWX 会话校验与 Quasar 引擎转发：</P>
      <CodeSnippet index={7} />

      <H3 id="step-3-dispatching-write-actions-via-executetxaction">步骤 3：通过 executeTxAction 派发写操作</H3>
      <P>将具体的合约写操作抽象为纯粹的 @wagmi/core 动作函数：</P>
      <CodeSnippet index={8} />
      <CodeSnippet index={9} />

      <H3 id="step-4-resuming-active-trackers-on-page-reload">步骤 4：页面重载时恢复活跃轮询池</H3>
      <CodeSnippet index={10} />

      <H3 id="step-5-passive-ui-subscriptions-via-selectors">步骤 5：基于选择器的响应式 UI 订阅</H3>
      <CodeSnippet index={11} />

      <H3 id="step-6-reactions-that-survive-a-reload">步骤 6：具备抗刷新能力的状态副作用</H3>
      <CodeSnippet index={12} />

      <Hr />

      <H2 id="5-architectural-comparison-usestate-vs-pulsar">5. 架构对比：useState 与 Pulsar</H2>
      <Table>
        <Thead>
          <Tr>
            <Th>场景</Th>
            <Th>简单 useState</Th>
            <Th>TUWA Pulsar</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>路由跳转</strong>
            </Td>
            <Td>❌ 组件销毁导致 Promise 丢失</Td>
            <Td>✅ 独立于 DOM 常驻全局 Store</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>加速与取消交易</strong>
            </Td>
            <Td>❌ 停留在旧 Hash 挂起或报错</Td>
            <Td>
              ✅ 拦截 <Code>onReplaced</Code>，标记 <Code>Replaced</Code> 并持久化新 Hash
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>浏览器页面刷新</strong>
            </Td>
            <Td>❌ 内存状态直接归零至 idle</Td>
            <Td>✅ 挂载时自动恢复持久化池追踪</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>刷新后的回调响应</strong>
            </Td>
            <Td>❌ 原生链式 Promise 彻底丢失不执行</Td>
            <Td>
              ✅ <Code>onTxFinished</Code> 与 <Code>useTxFinished</Code> 在页面重载后依然保证每笔完成交易执行一次
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>多标签页一致性</strong>
            </Td>
            <Td>❌ 标签页彼此完全孤立脱节</Td>
            <Td>✅ 通过 storage events 跨标签页秒级同步</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>多链兼容 (EVM + Solana)</strong>
            </Td>
            <Td>❌ 各自为政的面条式适配 Hook</Td>
            <Td>✅ 统一抽象的适配器接口与类型系统</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Re-Org 链重组与回滚</strong>
            </Td>
            <Td>❌ 抛出未捕获的原始 RPC 异常</Td>
            <Td>
              ✅ 结构化 <Code>TransactionStatus</Code> 与标准化错误模型
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>软确认机制 (Solana)</strong>
            </Td>
            <Td>❌ 单一布尔值：过早确认或长时间傻等</Td>
            <Td>
              ✅ <Code>confirmationStatus</Code> 呈报 <Code>confirmed</Code>，终态于 <Code>finalized</Code> 标记{' '}
              <Code>Success</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>丢单判定 (Solana)</strong>
            </Td>
            <Td>❌ 永久处于 pending 状态直至超时</Td>
            <Td>
              ✅ 超越 <Code>lastValidBlockHeight</Code> 立即准确判定过期失败
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="conclusion">总结</H2>
      <P>彻底将交易生命周期从 React 视图层剥离，是构建抗脆弱 Web3 应用的核心分水岭。</P>

      <Hr />

      <H2 id="next-steps">📚 后续指引</H2>
      <Ul>
        <Li>
          <A href="/guides/react-transaction-tracking">React 交易跟踪指南</A>：一步步接入 Pulsar。
        </Li>
      </Ul>
    </>
  );
}
