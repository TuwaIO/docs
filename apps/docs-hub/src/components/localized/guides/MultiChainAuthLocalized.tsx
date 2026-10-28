'use client';

import { Callout, Mermaid } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

const AUTH_LIFECYCLE_DIAGRAM_UK = `sequenceDiagram
  autonumber
  participant User as Клієнт (Браузер)
  participant UI as Satellite / Nova UIKit
  participant SIWX as @tuwaio/siwx
  participant API as Маршрут Next.js (/api/siwx)
  participant Store as Redis / Сесійне сховище

  User->>UI: Клік "Підключити та увійти"
  UI->>API: GET /api/siwx/nonce
  API->>Store: Видача одноразового nonce (TTL 300с)
  API-->>UI: Повернення challenge nonce
  UI->>SIWX: buildMessage(fields) [формат CAIP-122]
  SIWX-->>UI: Сформований текстовий рядок повідомлення
  UI->>User: Запит підпису гаманцем (EVM або Solana)
  User-->>UI: Криптографічний доказ (secp256k1 / ed25519)
  UI->>API: POST /api/siwx/verify { message, signature }
  Note over API: verifySiwxPayload() через RPC / ed25519
  API->>Store: Атомарне погашення nonce та збереження сесії
  API-->>User: Set-Cookie: HttpOnly, Secure токен сесії`;

const AUTH_LIFECYCLE_DIAGRAM_ZH = `sequenceDiagram
  autonumber
  participant User as 客户端 (浏览器)
  participant UI as Satellite / Nova UIKit
  participant SIWX as @tuwaio/siwx
  participant API as Next.js 路由 (/api/siwx)
  participant Store as Redis / 会话存储

  User->>UI: 点击 "连接并登录"
  UI->>API: GET /api/siwx/nonce
  API->>Store: 签发单次有效 nonce (TTL 300秒)
  API-->>UI: 返回 challenge nonce
  UI->>SIWX: buildMessage(fields) [CAIP-122 格式]
  SIWX-->>UI: 格式化的纯文本消息字符串
  UI->>User: 提示钱包签名 (EVM 或 Solana)
  User-->>UI: 加密证明 (secp256k1 / ed25519)
  UI->>API: POST /api/siwx/verify { message, signature }
  Note over API: verifySiwxPayload() 通过 RPC / ed25519 验证
  API->>Store: 原子化核销 nonce 并持久化会话
  API-->>User: Set-Cookie: HttpOnly, Secure 会话令牌`;

export function MultiChainAuthLocalized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const H3 = mdx.h3 ?? 'h3';
  const H4 = mdx.h4 ?? 'h4';
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
        <H1>Мультичейн-автентифікація з SIWX (CAIP-122 за межами EVM-силосів)</H1>
        <P>
          Тривалий час стандартом криптографічної ідентифікації у Web3 був{' '}
          <strong>EIP-4361 (Sign-In with Ethereum / SIWE)</strong>. Він дозволив безпечно входити за допомогою адреси
          гаманця Ethereum без паролів або соціальних провайдерів.
        </P>
        <P>
          Проте сучасні децентралізовані додатки майже ніколи не обмежуються однією мережею. Коли проєкт масштабується
          на EVM-ролапи та швидкісні середовища без EVM (зокрема Solana), розробники неминуче стикаються з критичними
          структурними обмеженнями:
        </P>
        <Ul>
          <Li>EVM-авторизація жорстко прив&apos;язана до кривої secp256k1 та стандарту SIWE.</Li>
          <Li>Solana-авторизація вимагає саморобних перевірок ed25519 або підпису сирого тексту в Base58.</Li>
          <Li>
            Бекенд змушений підтримувати фрагментовані сховища сесій, різні формати кук та несумісні конвеєри валідації.
          </Li>
        </Ul>
        <P>
          Щоб подолати цю фрагментацію, екосистема прийняла відкритий стандарт{' '}
          <strong>CAIP-122 (Sign-In with X)</strong>.
        </P>

        <Hr />

        <H2 id="1-the-architectural-problem-single-chain-silos">1. Архітектурна проблема: одночейнові силоси</H2>
        <P>
          Основне обмеження EIP-4361 — жорстка прив&apos;язка до примітивів Ethereum: відновлення відкритого ключа з{' '}
          <Code>secp256k1</Code>, hex-кодування та числові chain ID (<Code>eip155:1</Code>). Спроба додати Solana поруч
          з EVM породжує два паралельні, незв&apos;язані стеки автентифікації:
        </P>
        <CodeSnippet index={0} />

        <H3 id="critical-security-pitfalls-of-fragmented-auth">
          Критичні пастки безпеки фрагментованої автентифікації
        </H3>
        <Ul>
          <Li>
            <strong>Збій у перевірці прав доступу:</strong> бекенд-маршрути не можуть надійно гарантувати, чи має
            активна сесія право викликати чутливі операції між різними мережами.
          </Li>
          <Li>
            <strong>Підміна нонсів (Cross-Chain Nonce Poisoning):</strong> без ізоляції просторів імен (namespaces)
            виклики нонсів для Ethereum можуть бути повторно використані або перехоплені в транзакціях Solana.
          </Li>
          <Li>
            <strong>Подвійне навантаження на підтримку:</strong> дві паралельні схеми кук, механізми захисту від CSRF та
            подвійні ендпоінти виходу експоненційно збільшують поверхню потенційної атаки.
          </Li>
        </Ul>

        <Hr />

        <H2 id="2-enter-caip-122-sign-in-with-x">2. Стандарт CAIP-122 (Sign-In with X)</H2>
        <P>
          CAIP-122 уніфікує аутентифікацію за допомогою агностичних ідентифікаторів{' '}
          <strong>CAIP-2 (ідентифікатор мережі)</strong> та <strong>CAIP-10 (повна адреса облікового запису)</strong>:
        </P>
        <CodeSnippet index={1} />

        <H3 id="the-authentication-lifecycle">Життєвий цикл автентифікації</H3>
        <P>
          Повний наскрізний життєвий цикл автентифікації — від генерації challenge-нонсу до мультичейн-верифікації
          криптографічного підпису та атомарного карбування сесії із захистом від повторного відтворення (anti-replay):
        </P>
        <div className="my-6 overflow-x-auto">
          <Mermaid chart={AUTH_LIFECYCLE_DIAGRAM_UK} />
        </div>
        <Callout type="warning">
          <strong>Обов&apos;язковий перепідпис при зміні акаунта або мережі:</strong>
          Криптографічний доказ CAIP-122 суворо пов&apos;язує поточну сесію з конкретною адресою та мережею. Коли
          користувач змінює активний гаманець чи мережу в розширенні, новий акаунт зобов&apos;язаний пройти підпис
          наново.
        </Callout>

        <Hr />

        <H2 id="3-the-siwx-modular-architecture-packages--adapters">
          3. Модульна архітектура SIWX: пакети та адаптери
        </H2>
        <P>
          Модульна архітектура TUWA SIWX розділена на незалежні пакети з нульовими непотрібними залежностями:{' '}
          <Code>@tuwaio/siwx-core</Code> (ядро без залежностей), <Code>@tuwaio/siwx-evm</Code> (підтримка EIP-191,
          EIP-1271, ERC-6492), <Code>@tuwaio/siwx-solana</Code> (підтримка ed25519 та Wallet Standard) і{' '}
          <Code>@tuwaio/siwx-server</Code> (серверні сховища Redis/Stateless та валідація).
        </P>
        <CodeSnippet index={2} />

        <Hr />

        <H2 id="4-multi-chain-network-adapter-comparison">4. Порівняння мультичейн-адаптерів</H2>
        <P>
          Адаптери мереж інкапсулюють специфіку відповідних віртуальних машин та криптографічних підписів, транслюючи їх
          у єдиний інтерфейс <Code>SiwxSigner</Code> на фронтенді та <Code>SiwxVerifier</Code> на бекенді:
        </P>
        <Table>
          <Thead>
            <Tr>
              <Th>Технічний вектор</Th>
              <Th>EVM-адаптер (@tuwaio/siwx-evm)</Th>
              <Th>Solana-адаптер (@tuwaio/siwx-solana)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>CAIP-2 Namespace</strong>
              </Td>
              <Td>
                <Code>eip155:&#123;chainId&#125;</Code> (наприклад, <Code>eip155:1</Code>)
              </Td>
              <Td>
                <Code>solana:&#123;genesisHash&#125;</Code> (наприклад, <Code>solana:5eykt4Us...</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Формат адреси</strong>
              </Td>
              <Td>
                20-байтний Hex (<Code>0x[a-fA-F0-9]&#123;40&#125;</Code>)
              </Td>
              <Td>
                32-байтний Base58 (<Code>[1-9A-HJ-NP-za-km-z]&#123;32,44&#125;</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Повний CAIP-10 ID</strong>
              </Td>
              <Td>
                <Code>eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B</Code>
              </Td>
              <Td>
                <Code>solana:5eykt4Us...:9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Криптографічна крива</strong>
              </Td>
              <Td>
                <Code>secp256k1</Code> (Koblitz curve ECDSA)
              </Td>
              <Td>
                <Code>ed25519</Code> (Edwards-curve Digital Signature)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Формат підпису</strong>
              </Td>
              <Td>
                65-байтний Hex-рядок (<Code>0x</Code> + 130 симв: <Code>r, s, v</Code>)
              </Td>
              <Td>64-байтний Base58-рядок (88 символів)</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Підтримувані гаманці</strong>
              </Td>
              <Td>MetaMask, Rabby, Rainbow, Coinbase, Safe та всі стандарту EIP-1193</Td>
              <Td>Phantom, Solflare, Backpack, OKX та всі Wallet Standard гаманці</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Смарт-контрактні акаунти</strong>
              </Td>
              <Td>EIP-1271 (розгорнуті) та ERC-6492 (ще не розгорнуті) на ланцюгу підпису</Td>
              <Td>Не підтримується (тільки Keypairs; PDA є поза кривою й не мають приватних ключів)</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Механізм верифікації</strong>
              </Td>
              <Td>
                Viem <Code>recoverAddress</Code> (EIP-191) + <Code>verifyMessage</Code> (EIP-1271 / ERC-6492)
              </Td>
              <Td>
                Нативний Web Crypto API <Code>crypto.subtle.verify</Code> (Ed25519, нуль залежностей)
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="5-end-to-end-implementation-in-the-tuwa-ecosystem">5. Наскрізне впровадження в екосистемі TUWA</H2>
        <H3 id="step-1-client-side-multi-chain-sign-in">Крок 1: Клієнтський мультичейн-вхід</H3>
        <H4 id="programmatic-sign-in-button-with-satellite-connect">Програмна кнопка входу із Satellite Connect</H4>
        <P>
          Зручна кнопка входу підписує активний гаманець — EVM чи Solana. Утиліта <Code>getSatelliteSiwxFields</Code>{' '}
          конвертує з&apos;єднання у CAIP-2 chain ID та CAIP-10 адресу:
        </P>
        <CodeSnippet index={3} />

        <H4 id="declarative-watcher-pattern-with-satellite-nova-uikit">
          Декларативний патерн Watcher із Satellite та Nova UI Kit
        </H4>
        <P>Для додатків на базі Nova UIKit використовується декларативний патерн з компонентами-watcher:</P>
        <CodeSnippet index={4} />

        <H3 id="step-2-server-side-cryptographic-verification">Крок 2: Серверна криптографічна верифікація</H3>
        <P>
          Пакет <Code>@tuwaio/siwx-server</Code> повністю агностичний до бекенд-фреймворку: він однаково надійно працює
          в Next.js App Router, Fastify, NestJS, Cloudflare Workers, Hono чи Express.
        </P>
        <H4 id="production-route-handler-atomic-redis-nonce-session-store">
          Продакшн Route Handler (атомарний Redis Nonce та сесії)
        </H4>
        <CodeSnippet index={5} />

        <H4 id="zero-infrastructure-stateless-route-handler-hmac-signed-token">
          Stateless Route Handler без інфраструктури (HMAC-підписаний токен)
        </H4>
        <CodeSnippet index={6} />

        <H3 id="step-3-guarding-server-actions--backend-dispatches">
          Крок 3: Захист Server Actions та бекенд-викликів
        </H3>
        <P>
          Функція <Code>isSessionMatchingTarget</Code> забезпечує еквівалентність крос-чейн адрес: вона нормалізує EVM
          hex, чексуми, Solana Base58 та повні рядки CAIP-10, унеможливлюючи неавторизовані операції:
        </P>
        <CodeSnippet index={7} />

        <Hr />

        <H2 id="6-technical-comparison-eip-4361-vs-caip-122-siwx">6. Порівняння: EIP-4361 проти CAIP-122 (SIWX)</H2>
        <Table>
          <Thead>
            <Tr>
              <Th>Архітектурний вимір</Th>
              <Th>EIP-4361 (SIWE)</Th>
              <Th>CAIP-122 (@tuwaio/siwx)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <strong>Охоплення мереж</strong>
              </Td>
              <Td>Тільки Ethereum та EVM ролапи</Td>
              <Td>Мультичейн (EVM, Solana; розширюється через CAIP-2)</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Ідентифікація мережі</strong>
              </Td>
              <Td>
                Числовий Chain ID (<Code>1</Code>, <Code>8453</Code>)
              </Td>
              <Td>
                Стандарт CAIP-2 (<Code>eip155:1</Code>, <Code>solana:5eykt...</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Кодування адреси</strong>
              </Td>
              <Td>
                Суворий Hex-формат (<Code>0x...</Code>)
              </Td>
              <Td>Мультиформат: Hex (EVM) та Base58 (Solana) через CAIP-10</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Схеми підпису</strong>
              </Td>
              <Td>secp256k1 (personal_sign / EIP-1271)</Td>
              <Td>secp256k1 (EIP-191 / EIP-1271 / ERC-6492) та ed25519</Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Модель сесії</strong>
              </Td>
              <Td>Ізольовані EVM-куки</Td>
              <Td>
                Єдина уніфікована схема сесії (<Code>SiwxSession</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Захист від повторів (Replay)</strong>
              </Td>
              <Td>Саморобні перевірки на сервері</Td>
              <Td>
                Атомарне сховище одноразових нонсів (<Code>SiwxNonceStore</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <strong>Зовнішня автентифікація</strong>
              </Td>
              <Td>Не входить до стандарту</Td>
              <Td>
                JWT + JWKS для зовнішніх систем (<Code>@tuwaio/siwx-server</Code>)
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Hr />

        <H2 id="conclusion">Висновки</H2>
        <P>
          Створення окремих рішень для EVM та non-EVM середовищ фрагментує стан сесій та створює вразливості
          авторизації. Використання стандарту <strong>CAIP-122 через @tuwaio/siwx</strong> дозволяє dApps побудувати
          надійний безкастодіальний контур безпеки, де кожний підпис верифікується на власному бекенді за єдиною
          прозорою політикою.
        </P>

        <Hr />

        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="https://siwx.docs.tuwa.io/">Документація @tuwaio/siwx</A>: детальний довідник хуків, методів та
            типів.
          </Li>
          <Li>
            <A href="/guides/siwx-jwt-external-auth">Зовнішня автентифікація з SIWX JWT</A>: передача сесії в Coinbase
            CDP чи власні мікросервіси.
          </Li>
          <Li>
            <A href="/guides/why-web3-transaction-state-is-broken">Чому стан транзакцій зламаний</A>: зв&apos;язок сесій
            SIWX із машиною станів Pulsar.
          </Li>
          <Li>
            <A href="/guides/full-stack-react">Full-Stack React на TUWA SDK</A>: побудова повноцінного Next.js
            застосунку.
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>基于 SIWX (CAIP-122) 的跨链统一身份认证</H1>
      <P>
        长久以来，Web3 身份认证标准几乎完全被 <strong>EIP-4361 (Sign-In with Ethereum / SIWE)</strong>{' '}
        所主导。它确立了使用以太坊私钥签名替代传统邮箱和密码登录的标准密码学范式。
      </P>
      <P>
        然而，现代生产级 DApp 极少局限于单一公链。随着去中心化应用扩展至高吞吐量的高性能非 EVM 运行时（如
        Solana），工程团队必然陷入单链孤岛的架构泥潭中。
      </P>

      <Hr />

      <H2 id="1-the-architectural-problem-single-chain-silos">1. 架构死局：单链孤岛的反模式</H2>
      <CodeSnippet index={0} />

      <H3 id="critical-security-pitfalls-of-fragmented-auth">碎片化鉴权的核心安全隐患</H3>
      <Ul>
        <Li>
          <strong>鉴权边界穿透：</strong>后端接口无法原子化断言当前会话是否有权发起跨链调度或调用特定敏感 RPC。
        </Li>
        <Li>
          <strong>跨链 Nonce 污染攻击：</strong>缺乏命名空间隔离的挑战码可能被重放或在不同链环境被恶意串用。
        </Li>
        <Li>
          <strong>防御成本翻倍：</strong>两套独立的 Cookie 规范与 CSRF 防护层大幅放大了系统的攻击面。
        </Li>
      </Ul>

      <Hr />

      <H2 id="2-enter-caip-122-sign-in-with-x">2. 走向标准：CAIP-122 链无关身份模型</H2>
      <CodeSnippet index={1} />

      <H3 id="the-authentication-lifecycle">认证生命周期流转</H3>
      <P>完整的端到端认证生命周期——从服务端签发单次 Challenge Nonce，到多链密码学验签以及原子化防重放会话创建：</P>
      <div className="my-6 overflow-x-auto">
        <Mermaid chart={AUTH_LIFECYCLE_DIAGRAM_ZH} />
      </div>

      <Hr />

      <H2 id="3-the-siwx-modular-architecture-packages--adapters">3. SIWX 模块化架构：包结构与适配器</H2>
      <P>
        TUWA SIWX 采用彻底解耦的分层设计：<Code>@tuwaio/siwx-core</Code> 零依赖定义标准类型；
        <Code>@tuwaio/siwx-evm</Code> 与 <Code>@tuwaio/siwx-solana</Code> 负责各链密码学验签；
        <Code>@tuwaio/siwx-server</Code> 提供服务端会话防护。
      </P>
      <CodeSnippet index={2} />

      <Hr />

      <H2 id="4-multi-chain-network-adapter-comparison">4. 跨链网络适配器对比分析</H2>
      <P>
        适配器统一实现 <Code>SiwxSigner</Code> 接口，使应用层代码完全脱离底层钱包连接库的 API 差异：
      </P>
      <Table>
        <Thead>
          <Tr>
            <Th>技术维度</Th>
            <Th>EVM 适配器 (@tuwaio/siwx-evm)</Th>
            <Th>Solana 适配器 (@tuwaio/siwx-solana)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>CAIP-2 Namespace</strong>
            </Td>
            <Td>
              <Code>eip155:&#123;chainId&#125;</Code>（如 <Code>eip155:1</Code>）
            </Td>
            <Td>
              <Code>solana:&#123;genesisHash&#125;</Code>（如 <Code>solana:5eykt4Us...</Code>）
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>地址表达格式</strong>
            </Td>
            <Td>
              20 字节 Hex（<Code>0x[a-fA-F0-9]&#123;40&#125;</Code>）
            </Td>
            <Td>
              32 字节 Base58（<Code>[1-9A-HJ-NP-za-km-z]&#123;32,44&#125;</Code>）
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>CAIP-10 规范全名</strong>
            </Td>
            <Td>
              <Code>eip155:1:0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B</Code>
            </Td>
            <Td>
              <Code>solana:5eykt4Us...:9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>密码学曲线</strong>
            </Td>
            <Td>
              <Code>secp256k1</Code> (Koblitz ECDSA)
            </Td>
            <Td>
              <Code>ed25519</Code> (Edwards-curve Digital Signature)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <strong>签名结果格式</strong>
            </Td>
            <Td>
              65 字节 Hex 字符串（<Code>0x</Code> + 130 字符: <Code>r, s, v</Code>）
            </Td>
            <Td>64 字节 Base58 字符串（88 字符）</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>受支持钱包生态</strong>
            </Td>
            <Td>MetaMask、Rabby、Rainbow、Coinbase、Safe 及所有 EIP-1193 钱包</Td>
            <Td>Phantom、Solflare、Backpack、OKX 及所有 Wallet Standard 钱包</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>智能合约账户</strong>
            </Td>
            <Td>EIP-1271（已部署）与 ERC-6492（未部署），在签名链验证</Td>
            <Td>不支持（仅支持密钥对；PDA 位于曲线外无私钥）</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>签名验证引擎</strong>
            </Td>
            <Td>
              Viem <Code>recoverAddress</Code> + <Code>verifyMessage</Code> (EIP-1271/6492)
            </Td>
            <Td>
              原生 Web Crypto API <Code>crypto.subtle.verify</Code>（Ed25519，零依赖）
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="5-end-to-end-implementation-in-the-tuwa-ecosystem">5. TUWA 生态端到端实施方案</H2>
      <H3 id="step-1-client-side-multi-chain-sign-in">步骤 1：客户端多链签名组件实现</H3>
      <H4 id="programmatic-sign-in-button-with-satellite-connect">使用 Satellite Connect 的编程式登录按钮</H4>
      <CodeSnippet index={3} />
      <H4 id="declarative-watcher-pattern-with-satellite-nova-uikit">
        结合 Satellite 与 Nova UI Kit 的声明式 Watcher 模式
      </H4>
      <CodeSnippet index={4} />

      <H3 id="step-2-server-side-cryptographic-verification">步骤 2：服务端密码学签名校验路由</H3>
      <H4 id="production-route-handler-atomic-redis-nonce-session-store">
        生产级 Route Handler（原子 Redis Nonce 与会话存储）
      </H4>
      <CodeSnippet index={5} />
      <H4 id="zero-infrastructure-stateless-route-handler-hmac-signed-token">
        无基础设施 Stateless Route Handler（HMAC 签名令牌）
      </H4>
      <CodeSnippet index={6} />

      <H3 id="step-3-guarding-server-actions--backend-dispatches">步骤 3：保护 Server Actions 与后端调度</H3>
      <CodeSnippet index={7} />

      <Hr />

      <H2 id="6-technical-comparison-eip-4361-vs-caip-122-siwx">6. 方案技术对比：EIP-4361 vs CAIP-122 (SIWX)</H2>
      <Table>
        <Thead>
          <Tr>
            <Th>架构维度</Th>
            <Th>EIP-4361 (SIWE)</Th>
            <Th>CAIP-122 (@tuwaio/siwx)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <strong>支持链范围</strong>
            </Td>
            <Td>仅以太坊及 EVM 兼容链</Td>
            <Td>全多链 (EVM、Solana，CAIP-2 可扩展)</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>地址格式</strong>
            </Td>
            <Td>纯 Hex 格式 (0x...)</Td>
            <Td>全格式支持：Hex 与 Base58 (CAIP-10)</Td>
          </Tr>
          <Tr>
            <Td>
              <strong>重放防御</strong>
            </Td>
            <Td>依赖单链服务端字符串比对</Td>
            <Td>原子化单次 Nonce 生命周期模型</Td>
          </Tr>
        </Tbody>
      </Table>

      <Hr />

      <H2 id="conclusion">总结</H2>
      <P>
        基于 <strong>CAIP-122 与 TUWA SIWX</strong>，工程团队能够以纯粹非托管的方式统一 EVM 与 Solana 的用户身份认证。
      </P>

      <Hr />

      <H2 id="next-steps">📚 后续指引</H2>
      <Ul>
        <Li>
          <A href="https://siwx.docs.tuwa.io/">@tuwaio/siwx 空间</A>：查看完整 API 规范与类型定义。
        </Li>
        <Li>
          <A href="/guides/full-stack-react">全栈 React 应用搭建</A>：端到端整合 Nova 与 Pulsar。
        </Li>
      </Ul>
    </>
  );
}
