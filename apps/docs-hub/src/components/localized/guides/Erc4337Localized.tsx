'use client';

import { Mermaid } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

const AA_LIFECYCLE_DIAGRAM_UK = `sequenceDiagram
  autonumber
  actor User as Клієнт-підписувач (EOA / Ключ)
  participant Core as Клієнтський застосунок (Viem / Orbit)
  participant Bundler as Pimlico Bundler (Альт. мемпул)
  participant EP as Канонічний EntryPoint v0.7
  participant Explorer as Блокчейн-експлорери та індексатори

  User->>Core: Підпис структури PackedUserOperation
  Core->>Bundler: eth_sendUserOperation(userOp, entryPoint)
  Bundler-->>Core: Повернення userOpHash (ID відстеження)
  Note over Core,Bundler: Етап 1: Опитування мемпулу через eth_getUserOperationReceipt
  Bundler->>Bundler: Агрегація UserOps в одну пакетну транзакцію
  Bundler->>EP: handleOps([userOp1, userOp2, ...], bundlerBeneficiary)
  EP->>EP: Виконання внутрішніх викликів і компенсація газу
  EP-->>Explorer: Додано до блоку: подія UserOperationEvent(userOpHash, success, ...)
  Core->>Bundler: eth_getUserOperationReceipt(userOpHash)
  Bundler-->>Core: Повернення UserOpReceipt { receipt: { transactionHash }, success }
  Note over Core,Explorer: Етап 2: Фіксація ончейн через txHash (etherscan.io/tx/{txHash})`;

const AA_LIFECYCLE_DIAGRAM_ZH = `sequenceDiagram
  autonumber
  actor User as 客户端签名者 (EOA / 密钥)
  participant Core as 客户端应用 (Viem / Orbit)
  participant Bundler as Pimlico Bundler (替代内存池)
  participant EP as 规范 EntryPoint v0.7
  participant Explorer as 区块浏览器与索引器

  User->>Core: 签名 PackedUserOperation 结构体
  Core->>Bundler: eth_sendUserOperation(userOp, entryPoint)
  Bundler-->>Core: 返回 userOpHash (追踪 ID)
  Note over Core,Bundler: 阶段 1: 通过 eth_getUserOperationReceipt 轮询内存池
  Bundler->>Bundler: 将多个 UserOp 聚合为单个捆绑交易
  Bundler->>EP: handleOps([userOp1, userOp2, ...], bundlerBeneficiary)
  EP->>EP: 执行内部调用并结算 Gas 补偿
  EP-->>Explorer: 打包入块: 触发 UserOperationEvent(userOpHash, success, ...)
  Core->>Bundler: eth_getUserOperationReceipt(userOpHash)
  Bundler-->>Core: 返回 UserOpReceipt { receipt: { transactionHash }, success }
  Note over Core,Explorer: 阶段 2: 通过 txHash 链上结算确认 (etherscan.io/tx/{txHash})`;

export function Erc4337Localized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const H3 = mdx.h3 ?? 'h3';
  const H4 = mdx.h4 ?? 'h4';
  const H5 = mdx.h5 ?? 'h5';
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
        <H1>Деконструкція ERC-4337: Некастодіальна абстракція акаунтів без WaaS</H1>
        <P>
          Технологія Account Abstraction (ERC-4337) кардинально покращує користувацький досвід Web3, усуваючи
          необхідність зберігати сид-фрази, підтримуючи спонсорство газу (Paymaster) та пакетні транзакції (Batched
          Calls).
        </P>
        <P>
          Проте більшість розробників потрапляють у пастку комерційних постачальників «Wallet-as-a-Service» (Privy,
          Dynamic, Biconomy Cloud). Цей посібник демонструє, як побудувати повністю некастодіальну архітектуру
          смарт-акаунтів на базі відкритих компонентів.
        </P>

        <Hr />

        <H2 id="1-the-account-abstraction-spectrum-signer-vs-account">
          1. Спектр абстракції акаунтів: підписувач проти акаунта
        </H2>
        <P>
          Фундаментальний принцип ERC-4337 — суворе відокремлення <strong>Підписувача (Signer)</strong> від{' '}
          <strong>Смарт-акаунта (Smart Account)</strong>:
        </P>
        <CodeSnippet index={0} />

        <H3 id="deconstructing-the-waas-trade-off">Деконструкція компромісів WaaS</H3>
        <P>
          Підписувач лише генерує криптографічні підписи, тоді як ончейн-акаунт володіє активами та валідує правила. Це
          означає, що підписувач може бути замінений або експортований без блокування доступу до коштів користувача.
        </P>

        <Hr />

        <H2 id="2-the-two-phase-lifecycle-userophash-vs-txhash">2. Двофазний життєвий цикл: userOpHash проти txHash</H2>
        <P>
          На відміну від звичайних EOA-транзакцій, виконання операції смарт-акаунта проходить через альтернативний
          мемпул бандлерів:
        </P>
        <div className="my-6 overflow-x-auto">
          <Mermaid chart={AA_LIFECYCLE_DIAGRAM_UK} />
        </div>

        <H3 id="the-dual-identifier-dilemma">Дилема подвійного ідентифікатора</H3>
        <Ul>
          <Li>
            <strong>userOpHash (Intent ID):</strong> keccak256-хеш операції PackedUserOperation. Існує в пам&apos;яті
            бандлерів і відстежується через <Code>eth_getUserOperationReceipt</Code>.
          </Li>
          <Li>
            <strong>txHash (On-Chain Settlement ID):</strong> хеш фінальної транзакції бандлера в блокчейні, яка
            викликає <Code>EntryPoint.handleOps()</Code> і може містити операції кількох різних користувачів.
          </Li>
        </Ul>

        <H3 id="three-production-failure-modes-of-naive-frontends">Три збої наївних фронтендів у продакшні</H3>
        <H4 id="1-rpc-node-polling-vs-bundler-mempool-mismatch">1. Опитування RPC проти мемпулу бандлера</H4>
        <P>
          Спроба опитувати звичайний RPC-вузол через userOpHash призводить до помилок, оскільки мемпул бандлера
          ізольований від звичайного мемпулу ноди.
        </P>
        <H4 id="2-bundle-calldata-obfuscation">2. Обфускація calldata у бандлі</H4>
        <P>
          Агрегація декількох операцій в один виклик handleOps ховає вихідні виклики та ускладнює відновлення стану
          окремого користувача.
        </P>
        <H4 id="3-silent-execution-reverts-inside-entrypointhandleops">
          3. Приховані помилки виконання всередині EntryPoint.handleOps
        </H4>
        <P>
          Транзакція бандлера вважається успішною в мережі (status 1), навіть коли внутрішня операція користувача
          зазнала невдачі (UserOperationRevertReason).
        </P>

        <Hr />

        <H2 id="3-smart-account-architectures-solady-vs-erc-7579-modular-accounts">
          3. Архітектури смарт-акаунтів: Solady проти ERC-7579
        </H2>
        <CodeSnippet index={1} />

        <H3 id="the-cryptographic-reality-of-solady--passkeys">Криптографічна реальність Solady та Passkeys</H3>
        <P>
          Solady ERC4337 оптимізований для EOA власників (secp256k1) з мінімальними витратами газу на розгортання. Для
          повноцінної підтримки біометричних ключів Passkeys (P-256) рекомендується використовувати модульні акаунти
          ERC-7579.
        </P>

        <Hr />

        <H2 id="4-implementation-canonical-viem-aa-vs-tuwa-open-source-stack">
          4. Реалізація: канонічний Viem AA проти TUWA
        </H2>
        <H3 id="41-implementation-a-canonical-native-viem-viemaccount-abstraction">
          4.1 Варіант A: Канонічний Viem (viem/account-abstraction)
        </H3>
        <CodeSnippet index={2} />

        <H3 id="42-implementation-b-ergonomic-tuwa-stack-tuwaioorbit-evm--tuwaiopulsar-evm">
          4.2 Варіант B: TUWA Stack (@tuwaio/orbit-evm та @tuwaio/pulsar-evm)
        </H3>
        <CodeSnippet index={3} />
        <H4 id="step-1-orchestrating-the-smart-account-with-orbit-evm">
          Крок 1: Оркестрація смарт-акаунта за допомогою Orbit EVM
        </H4>
        <P>
          Хук або утиліта створює клієнт смарт-акаунта на базі стандарту ERC-4337 з автоматичним спонсоруванням газу
          через Paymaster:
        </P>
        <CodeSnippet index={4} />

        <H4 id="step-2-reactive-two-stage-tracking-with-pulsar">Крок 2: Реактивне двофазне відстеження з Pulsar</H4>
        <P>
          У реальному інтерфейсі критично важливо розділяти чисту транзакційну дію та диспетчеризацію реактивного
          UI-компонента:
        </P>

        <H5 id="part-a-pure-transaction-action-incrementpimlicots">
          Частина A: Чиста транзакційна дія (incrementPimlico.ts)
        </H5>
        <P>
          Функція залишається повністю безголовою (headless) та відв&apos;язаною від стану інтерфейсу. Вона ініціалізує
          смарт-клієнт через Orbit, кодує calldata і відправляє UserOperation у бандлер:
        </P>
        <CodeSnippet index={5} />

        <H5 id="part-b-reactive-ui-component-dispatch-counterbuttontsx">
          Частина B: Диспетчеризація реактивного UI-компонента (CounterButton.tsx)
        </H5>
        <P>
          У шарі React компонент підключається до сховища Pulsar через селектор хука (
          <Code>usePulsarStore((state) =&gt; state.executeTxAction)</Code>). Він викликає дію з метаданими життєвого
          циклу, автоматичним трекером (<Code>TransactionTracker.ERC4337</Code>) та 4-фазними сповіщеннями:
        </P>
        <CodeSnippet index={6} />

        <H4 id="how-pulsars-two-stage-pipeline-executes-under-the-hood">
          Як двоетапний пайплайн Pulsar працює під капотом
        </H4>
        <P>
          Пайплайн слухає мемпул бандлера на першому етапі (<Code>eth_getUserOperationReceipt</Code>), перевіряє
          внутрішній <Code>receipt.success</Code> і на другому етапі передає зовнішній <Code>txHash</Code> у стандартний
          EVM-трекер для очікування фінальності блоку.
        </P>

        <Hr />

        <H2 id="5-cross-device-persistence-build-your-own-indexer-or-use-quasar">
          5. Крос-девайсна персистентність: власний індексатор чи Quasar
        </H2>
        <P>
          Постійною проблемою фронтенду є дилема закриття вкладки: користувачі часто закривають вкладку браузера одразу
          після підтвердження транзакції в гаманці, що перериває роботу JS-полінгу. Інженерні команди мають два шляхи
          для вирішення персистентності:
        </P>
        <CodeSnippet index={7} />
        <H3 id="option-a-build-your-own-indexer-ponder--envio">Варіант A: Власний індексатор (Ponder / Envio)</H3>
        <P>
          Команди, яким потрібна повністю власна модель даних, можуть розгорнути легкий відкритий індексатор (Ponder або
          Envio), що прослуховує канонічний контракт EntryPoint v0.7:
        </P>
        <CodeSnippet index={8} />
        <H3 id="option-b-non-custodial-sync-with-quasar-cloud-or-self-hosted">
          Варіант B: Некастодіальна синхронізація з Quasar
        </H3>
        <P>
          Для команд, які віддають перевагу готовому рішенню, Quasar пропонує некастодіальний движок синхронізації та
          вебхуків. Дві редакції (Quasar Cloud та self-hosted Quasar Community Edition) працюють на базі однакового API:
        </P>
        <CodeSnippet index={9} />

        <Hr />

        <H2 id="6-comprehensive-architectural-comparison-matrix">6. Порівняльна архітектурна матриця</H2>
        <Table>
          <Thead>
            <Tr>
              <Th>Параметр</Th>
              <Th>Класичний EOA (Viem / Wagmi)</Th>
              <Th>Вбудований WaaS (Privy / Dynamic)</Th>
              <Th>Канонічний Open Source (Viem AA + ERC-7579 / Solady)</Th>
              <Th>Модульний стек TUWA (Orbit + Pulsar + опц. Quasar)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>Архітектура та рівні</strong>
              </Td>
              <Td>Стандартний низькорівневий JSON-RPC клієнт</Td>
              <Td>Монолітний SDK вендора та закритий релеєр у хмарі</Td>
              <Td>Базові протокольні примітиви (ручне кешування на клієнті)</Td>
              <Td>
                <strong>
                  Ергономічні клієнтські рівні (<Code>orbit</Code> + <Code>pulsar</Code>)
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Володіння ключами</strong>
              </Td>
              <Td>100% користувач (Апаратний / Браузерний EOA)</Td>
              <Td>Некастодіальний 2-of-3 SSS у TEE анклавах вендора</Td>
              <Td>
                <strong>100% користувач (Апаратний / Local / Passkey з модулем)</strong>
              </Td>
              <Td>
                <strong>100% користувач (Апаратний / Локальний / EOA)</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Примітиви виконання</strong>
              </Td>
              <Td>Одиничний виклик на підпис</Td>
              <Td>Закритий релеєр або стандартний AA</Td>
              <Td>
                <strong>Нативний пакетний виклик (Multi-Call) ERC-4337 v0.7</strong>
              </Td>
              <Td>
                <strong>Нативний пакетний виклик (Multi-Call) ERC-4337 v0.7</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Політика газу (Paymaster)</strong>
              </Td>
              <Td>Тільки нативний ETH/MATIC (платить користувач)</Td>
              <Td>Керовані правила спонсорування вендора</Td>
              <Td>
                <strong>Відкритий Paymaster ERC-4337 (Pimlico, Biconomy тощо)</strong>
              </Td>
              <Td>
                <strong>
                  Плагінний Paymaster через <Code>@tuwaio/orbit-evm</Code>
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Архітектура смарт-акаунта</strong>
              </Td>
              <Td>Відсутня (стандартний акаунт)</Td>
              <Td>Закриті контракти або модульний проксі</Td>
              <Td>
                <strong>Вибір: Assembly Solady або модульний ERC-7579</strong>
              </Td>
              <Td>
                <strong>
                  Solady Single-Owner через <Code>@tuwaio/orbit-evm</Code>
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Підтримка Passkey</strong>
              </Td>
              <Td>Не підтримується</Td>
              <Td>Власна біометрична автентифікація вендора</Td>
              <Td>
                <strong>Нативна на ERC-7579 / EIP-7212 (потребує модуля)</strong>
              </Td>
              <Td>
                <strong>Потребує зовнішнього верифікатора Passkey / модуля</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Модель стану транзакцій</strong>
              </Td>
              <Td>
                Базовий полінг <Code>txHash</Code> у пам&apos;яті
              </Td>
              <Td>Закриті хмарні вебхуки вендора</Td>
              <Td>
                <strong>
                  Viem <Code>waitForUserOperationReceipt</Code> (власний FSM)
                </strong>
              </Td>
              <Td>
                <strong>
                  Детермінований двоетапний автомат (<Code>userOp</Code> ➔ <Code>txHash</Code>)
                </strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Відстеження мемпулу та Explorer</strong>
              </Td>
              <Td>Н/Д (стандартний мемпул ноди)</Td>
              <Td>Закрите модальне вікно статусу</Td>
              <Td>
                <strong>Мемпул: Bundler RPC / Фіналізовано: Block Explorer</strong>
              </Td>
              <Td>
                <strong>Двоетапно: статус бандлера ➔ канонічний Explorer</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Крос-девайсна персистентність</strong>
              </Td>
              <Td>Втрачається при закритті вкладки</Td>
              <Td>Хмарна синхронізація акаунта вендора</Td>
              <Td>
                <strong>Власний відкритий індексатор (Ponder / Envio + БД)</strong>
              </Td>
              <Td>
                <strong>Local-first стан + опціональний Quasar (Cloud або self-hosted)</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Хостинг бекенду</strong>
              </Td>
              <Td>Н/Д (тільки клієнт)</Td>
              <Td>Тільки хостинг вендора</Td>
              <Td>
                <strong>Власна розробка та експлуатація</strong>
              </Td>
              <Td>
                <strong>Quasar Cloud або self-hosted Community Edition</strong>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Ліцензія та розширюваність</strong>
              </Td>
              <Td>Open Source (MIT)</Td>
              <Td>Закритий код SDK та корпоративна підписка</Td>
              <Td>
                <strong>100% Open Source (MIT / Apache-2.0)</strong>
              </Td>
              <Td>
                <strong>Apache-2.0 SDK та self-hostable Quasar; керований Quasar Cloud опціонально</strong>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="summary-designing-sovereign-smart-accounts">Підсумок: проєктування некастодіальних смарт-акаунтів</H2>
        <P>
          Справжній суверенітет у Web3 досягається розділенням ключів та контрактної логіки, використанням відкритих
          стандартів бандлерів і персистентного стану транзакцій.
        </P>

        <Hr />

        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="https://orbit.docs.tuwa.io/">Документація Orbit EVM</A>: хелпери EntryPoint v0.7 та Solady.
          </Li>
          <Li>
            <A href="/guides/full-stack-react">Full-Stack React застосунок</A>: інтеграція з UI Nova.
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>去神秘化 ERC-4337：构建无专有 WaaS 锁定的自主智能账户</H1>
      <P>账户抽象（ERC-4337）极大改善了 Web3 用户体验，但商业化 WaaS 厂商带来了供应商锁定与闭源黑盒风险。</P>

      <Hr />

      <H2 id="1-the-account-abstraction-spectrum-signer-vs-account">1. 账户抽象的光谱：签名者 vs 智能账户</H2>
      <CodeSnippet index={0} />

      <H3 id="deconstructing-the-waas-trade-off">解构 WaaS 的权衡陷阱</H3>
      <P>签名者负责提供密码学凭证，智能账户负责链上资产托管与执行验证。</P>

      <Hr />

      <H2 id="2-the-two-phase-lifecycle-userophash-vs-txhash">2. 两阶段生命周期：userOpHash 与 txHash</H2>
      <div className="my-6 overflow-x-auto">
        <Mermaid chart={AA_LIFECYCLE_DIAGRAM_ZH} />
      </div>
      <H3 id="the-dual-identifier-dilemma">双标识符两难困境</H3>
      <Ul>
        <Li>
          <strong>userOpHash：</strong>内存池意图凭据，向 Bundler RPC 轮询；
        </Li>
        <Li>
          <strong>txHash：</strong>最终链上结算凭据，向标准以太坊节点或区块浏览器查询。
        </Li>
      </Ul>

      <H3 id="three-production-failure-modes-of-naive-frontends">朴素前端的三个生产级崩溃陷阱</H3>
      <H4 id="1-rpc-node-polling-vs-bundler-mempool-mismatch">1. RPC 节点轮询与 Bundler 内存池不匹配</H4>
      <P>标准 RPC 节点无法识别 userOpHash，强行轮询会导致超时报错并丢失执行状态追踪。</P>
      <H4 id="2-bundle-calldata-obfuscation">2. Bundle 调用数据混淆</H4>
      <P>多个 UserOperation 被合并至单一 handleOps 批处理事务中，导致前端难以定位具体单笔操作。</P>
      <H4 id="3-silent-execution-reverts-inside-entrypointhandleops">3. EntryPoint.handleOps 内部隐式执行回滚</H4>
      <P>外层 Bundler 交易在链上执行成功（status 1），但合约内部的实际调用发生回滚，造成虚假成功提示。</P>

      <Hr />

      <H2 id="3-smart-account-architectures-solady-vs-erc-7579-modular-accounts">
        3. 智能账户架构：Solady vs ERC-7579
      </H2>
      <CodeSnippet index={1} />

      <H3 id="the-cryptographic-reality-of-solady--passkeys">Solady 与 Passkeys 的密码学现实</H3>
      <P>极简高效推荐 Solady；动态插件与原生生物识别 Passkey 推荐模块化 ERC-7579 规范。</P>

      <Hr />

      <H2 id="4-implementation-canonical-viem-aa-vs-tuwa-open-source-stack">4. 方案落地：标准 Viem AA vs TUWA 栈</H2>
      <H3 id="41-implementation-a-canonical-native-viem-viemaccount-abstraction">4.1 方案 A：标准原生 Viem 链下编排</H3>
      <CodeSnippet index={2} />

      <H3 id="42-implementation-b-ergonomic-tuwa-stack-tuwaioorbit-evm--tuwaiopulsar-evm">
        4.2 方案 B：TUWA 开源工具链组合
      </H3>
      <CodeSnippet index={3} />
      <H4 id="step-1-orchestrating-the-smart-account-with-orbit-evm">步骤 1：使用 Orbit EVM 编排智能账户</H4>
      <P>初始化封装了 ERC-4337 标准以及 Pimlico Paymaster 赞助能力的智能账户客户端：</P>
      <CodeSnippet index={4} />

      <H4 id="step-2-reactive-two-stage-tracking-with-pulsar">步骤 2：使用 Pulsar 进行响应式两阶段追踪</H4>
      <P>在生产前端中，将纯粹的无状态链上事务逻辑与响应式 React UI 分发清晰解耦：</P>

      <H5 id="part-a-pure-transaction-action-incrementpimlicots">部分 A：纯事务动作执行 (incrementPimlico.ts)</H5>
      <P>
        此动作函数保持完全无头（headless）、纯粹且与 UI 状态解耦。它通过 Orbit 初始化智能客户端，编码 calldata，并将
        UserOperation 发送至 bundler：
      </P>
      <CodeSnippet index={5} />

      <H5 id="part-b-reactive-ui-component-dispatch-counterbuttontsx">
        部分 B：响应式 UI 组件派发 (CounterButton.tsx)
      </H5>
      <P>
        在 React 视图层，组件使用 Hook 选择器连接到中心 Pulsar Store（
        <Code>usePulsarStore((state) =&gt; state.executeTxAction)</Code>）。它以生命周期元数据、自动追踪器选择（
        <Code>TransactionTracker.ERC4337</Code>）和四状态用户通知派发该动作：
      </P>
      <CodeSnippet index={6} />

      <H4 id="how-pulsars-two-stage-pipeline-executes-under-the-hood">Pulsar 两阶段流水线底层工作原理</H4>
      <P>
        第一阶段轮询 Bundler 的 <Code>eth_getUserOperationReceipt</Code> 并校验 <Code>receipt.success</Code>
        ，第二阶段将外层 <Code>txHash</Code> 移交标准 EVM 追踪器直至区块终局确认。
      </P>

      <Hr />

      <H2 id="5-cross-device-persistence-build-your-own-indexer-or-use-quasar">
        5. 跨设备持久化：自建索引器还是采用 Quasar
      </H2>
      <P>
        前端面临的一个普遍挑战是“关闭标签页两难”：用户在批准交易后往往立即关闭页面，导致客户端 JS
        轮询中止。工程团队可通过两种方式解决持久化问题：
      </P>
      <CodeSnippet index={7} />
      <H3 id="option-a-build-your-own-indexer-ponder--envio">方案 A：自建轻量级事件索引器 (Ponder / Envio)</H3>
      <P>需要完全自定义数据模型的团队可以监听 EntryPoint v0.7 合约事件并将状态同步至数据库：</P>
      <CodeSnippet index={8} />
      <H3 id="option-b-non-custodial-sync-with-quasar-cloud-or-self-hosted">
        方案 B：采用 Quasar 非托管云端/自托管同步
      </H3>
      <P>
        对于不愿自建事件索引器的团队，Quasar 提供了开箱即用的非托管同步与 Webhook 引擎。两种发行版（Quasar Cloud
        与开源自托管 Quasar Community Edition）提供完全一致的 API：
      </P>
      <CodeSnippet index={9} />

      <Hr />

      <H2 id="6-comprehensive-architectural-comparison-matrix">6. 综合架构对比矩阵</H2>
      <Table>
        <Thead>
          <Tr>
            <Th>技术维度</Th>
            <Th>经典 EOA (Viem / Wagmi)</Th>
            <Th>嵌入式 WaaS (Privy / Dynamic)</Th>
            <Th>标准开源方案 (Viem AA + ERC-7579 / Solady)</Th>
            <Th>TUWA 模块化栈 (Orbit + Pulsar + 可选 Quasar)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>架构与分层</strong>
            </Td>
            <Td>标准低层 JSON-RPC 客户端</Td>
            <Td>单体供应商 SDK 与云端中继器</Td>
            <Td>基础协议原语（前端需编写客户端缓存胶水代码）</Td>
            <Td>
              <strong>
                人体工学客户端抽象层（<Code>orbit</Code> + <Code>pulsar</Code>）
              </strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>私钥所有权</strong>
            </Td>
            <Td>100% 用户（硬件 / 浏览器 EOA）</Td>
            <Td>非托管 2-of-3 SSS 部署于供应商 TEE 飞地（可导出）</Td>
            <Td>
              <strong>100% 用户（硬件 / 本地 / 带模块的 Passkey）</strong>
            </Td>
            <Td>
              <strong>100% 用户（硬件 / 本地 / EOA）</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>执行原语</strong>
            </Td>
            <Td>每次签名仅支持单笔独立调用</Td>
            <Td>专有中继器或标准 AA</Td>
            <Td>
              <strong>原生 ERC-4337 v0.7 批量多重调用 (Multi-Call)</strong>
            </Td>
            <Td>
              <strong>原生 ERC-4337 v0.7 批量多重调用 (Multi-Call)</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Gas 策略 (Paymaster)</strong>
            </Td>
            <Td>仅原生代币 ETH/MATIC（用户自行支付）</Td>
            <Td>供应商托管赞助策略规则</Td>
            <Td>
              <strong>开放 ERC-4337 Paymaster（Pimlico、Biconomy 等）</strong>
            </Td>
            <Td>
              <strong>
                通过 <Code>@tuwaio/orbit-evm</Code> 可拔插 Paymaster 支持
              </strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>智能账户架构</strong>
            </Td>
            <Td>无（标准外部拥有账户）</Td>
            <Td>专有合约实现或模块化代理</Td>
            <Td>
              <strong>自主选择：极简汇编 Solady 或模块化 ERC-7579</strong>
            </Td>
            <Td>
              <strong>
                通过 <Code>@tuwaio/orbit-evm</Code> 编排 Solady Single-Owner
              </strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Passkey 支持</strong>
            </Td>
            <Td>不支持</Td>
            <Td>供应商专有生物识别认证</Td>
            <Td>
              <strong>原生支持 ERC-7579 / EIP-7212（需对应验证模块）</strong>
            </Td>
            <Td>
              <strong>需外部 Passkey 验证器或签名模块支持</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>交易状态模型</strong>
            </Td>
            <Td>
              内存中基础轮询 <Code>txHash</Code>
            </Td>
            <Td>供应商私有云端 Webhooks</Td>
            <Td>
              <strong>
                Viem <Code>waitForUserOperationReceipt</Code>（需自定义状态机）
              </strong>
            </Td>
            <Td>
              <strong>
                确定性两阶段（<Code>userOp</Code> ➔ <Code>txHash</Code>）状态机
              </strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>Mempool 追踪与浏览器</strong>
            </Td>
            <Td>不适用（标准节点内存池）</Td>
            <Td>专有弹窗状态视图</Td>
            <Td>
              <strong>内存池：Bundler RPC / 确认后：区块浏览器</strong>
            </Td>
            <Td>
              <strong>两阶段：Bundler 状态 ➔ 规范区块浏览器直达</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>跨设备持久化</strong>
            </Td>
            <Td>关闭标签页即丢失状态</Td>
            <Td>供应商账户中心云端同步</Td>
            <Td>
              <strong>自建开源事件索引器（Ponder / Envio + 数据库）</strong>
            </Td>
            <Td>
              <strong>Local-First 本地优先 + 可选 Quasar（云端或自托管）</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>后端基础设施</strong>
            </Td>
            <Td>不适用（纯客户端执行）</Td>
            <Td>仅限供应商托管平台</Td>
            <Td>
              <strong>完全自主开发与自运维</strong>
            </Td>
            <Td>
              <strong>Quasar Cloud 云端服务或自托管 Community Edition</strong>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>开源许可与可扩展性</strong>
            </Td>
            <Td>开源 (MIT)</Td>
            <Td>闭源 SDK 与商业阶梯计费</Td>
            <Td>
              <strong>100% 开源 (MIT / Apache-2.0)</strong>
            </Td>
            <Td>
              <strong>Apache-2.0 SDK 与可自托管 Quasar；托管 Quasar Cloud 可选</strong>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="summary-designing-sovereign-smart-accounts">总结：设计主权智能账户</H2>
      <P>通过解耦签名者与智能账户，开发者能够在保证绝对非托管安全的同时提供现代化用户体验。</P>

      <Hr />

      <H2 id="next-steps">📚 后续指引</H2>
      <Ul>
        <Li>
          <A href="https://orbit.docs.tuwa.io/">@tuwaio/orbit 空间</A>：查看 Solady 账户封装详情。
        </Li>
      </Ul>
    </>
  );
}
