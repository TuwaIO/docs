'use client';

import { Callout, Tabs } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function SiwxSupabaseLocalized({ locale }: { locale: Locale }) {
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
        <H1>Використання входу SIWX із Supabase Row Level Security (RLS)</H1>
        <P>
          Більшість Web3-додатків зберігають користувацькі дані в базі Supabase і самостійно реалізують авторизацію:
          підпис довільного повідомлення через <Code>signMessage</Code>, перевірку підпису в кастомному API-роуті та
          ручне створення запису користувача в системній таблиці Supabase Auth.
        </P>
        <P>
          Цей посібник демонструє набагато надійніший підхід без створення користувачів у Supabase Auth: Supabase
          довіряє короткоживучим токенам із нашого{' '}
          <A href="/guides/siwx-jwt-external-auth">посібника із зовнішньої авторизації SIWX</A>, а механізм Row Level
          Security (RLS) на рівні ядра PostgreSQL гарантує доступ виключно до даних поточного гаманця.
        </P>

        <Callout type="info">
          Крок налаштування маршруту містить вкладки <strong>EVM</strong> та <strong>Solana</strong>, синхронізовані з
          іншими посібниками. Частина бази даних ідентична для обох мереж.
        </Callout>

        <Hr />
        <H2 id="how-it-works">Архітектура та принцип роботи</H2>
        <CodeSnippet index={0} />

        <Hr />
        <H2 id="siwx-or-the-supabase-web3-sign-in">Порівняння: SIWX чи Supabase Web3 Auth?</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Критерій</Th>
              <Th>Supabase Web3 Auth</Th>
              <Th>SIWX + сторонній провайдер JWKS</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Де живуть користувачі</Td>
              <Td>У таблиці auth.users Supabase</Td>
              <Td>У ваших сесіях SIWX; Supabase лише перевіряє JWT</Td>
            </Tr>
            <Tr>
              <Td>Підтримувані мережі</Td>
              <Td>Окремо Ethereum та Solana</Td>
              <Td>EVM та Solana в єдиному CAIP-122 потоці</Td>
            </Tr>
            <Tr>
              <Td>Смарт-гаманці (Safe, AA)</Td>
              <Td>Не підтримуються офіційно</Td>
              <Td>EIP-1271 та ERC-6492 з перевіркою в ончейні</Td>
            </Tr>
            <Tr>
              <Td>У правилах RLS</Td>
              <Td>
                <Code>auth.uid()</Code>
              </Td>
              <Td>
                <Code>auth.jwt() -&gt;&gt; &apos;sub&apos;</Code>
              </Td>
            </Tr>
          </tbody>
        </Table>

        <H2 id="before-you-start">Перед початком</H2>
        <Ul>
          <Li>
            <strong>Додаток з посібника Full-Stack React</strong>, з маршрутами SIWX та{' '}
            <Code>src/lib/authStores.ts</Code>.
          </Li>
          <Li>
            <strong>Ключ підпису JWT</strong> у змінній <Code>SIWX_JWT_PRIVATE_KEY</Code>.
          </Li>
          <Li>
            <strong>Проект Supabase:</strong> URL та публічний ключ у змінних <Code>NEXT_PUBLIC_SUPABASE_URL</Code> та{' '}
            <Code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</Code>.
          </Li>
          <Li>
            <strong>Публічний HTTPS URL</strong> для завантаження JWKS.
          </Li>
        </Ul>
        <CodeSnippet index={1} />

        <Hr />
        <H2 id="step-1-add-the-role-claim-to-the-token">Крок 1: Додавання клейму ролі в конфігурацію SIWX</H2>
        <P>
          PostgreSQL у Supabase визначає права доступу на базі клейму <Code>role</Code>: для авторизованих користувачів
          потрібно передавати <Code>authenticated</Code>. Задайте це у налаштуваннях вашого SIWX-обробника:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={2} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={3} />
          </Tabs.Tab>
        </Tabs>

        <Hr />
        <H2 id="step-2-register-your-jwks-with-supabase">Крок 2: Реєстрація JWKS у консолі Supabase</H2>
        <P>Зареєструйте URL публічних ключів додатку через Management API Supabase:</P>
        <CodeSnippet index={4} />
        <P>
          Під час локальної розробки можна безпосередньо передати публічні ключі через параметр <Code>custom_jwks</Code>
          :
        </P>
        <CodeSnippet index={5} />

        <Hr />
        <H2 id="step-3-create-a-table-with-row-level-security">Крок 3: Створення таблиці з Row Level Security</H2>
        <P>
          Клейм <Code>sub</Code> зберігає ідентифікатор гаманця. Застосуйте міграцію:
        </P>
        <CodeSnippet index={6} />

        <Hr />
        <H2 id="step-4-create-the-supabase-client">Крок 4: Створення клієнта Supabase</H2>
        <P>
          Параметр <Code>accessToken</Code> автоматично надає актуальний токен для кожного запиту:
        </P>
        <CodeSnippet index={7} />

        <Hr />
        <H2 id="step-5-read-and-write-rows">Крок 5: Читання та запис рядків</H2>
        <P>Компонент нотаток для поточного гаманця:</P>
        <CodeSnippet index={8} />

        <Hr />
        <H2 id="step-6-query-as-the-wallet-from-a-server-action">
          Крок 6: Запити від імені гаманця через Server Action
        </H2>
        <P>Server Action може безпечно взаємодіяти з базою від імені сесії гаманця:</P>
        <CodeSnippet index={9} />

        <Hr />
        <H2 id="what-supabase-reads-from-the-token">Що Supabase зчитує з токена</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Клейм</Th>
              <Th>Використання</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <Code>role</Code>
              </Td>
              <Td>
                Postgres роль запиту: <Code>authenticated</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>sub</Code>
              </Td>
              <Td>
                Адреса гаманця для політик RLS (<Code>auth.jwt() -&gt;&gt; &apos;sub&apos;</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>caip10</Code>
              </Td>
              <Td>Повний CAIP-10 ідентифікатор гаманця</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>chain_id</Code>
              </Td>
              <Td>Мережа авторизації в стандарті CAIP-2</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>exp</Code>
              </Td>
              <Td>Час життя токена (Supabase відхиляє прострочені)</Td>
            </Tr>
          </tbody>
        </Table>

        <Hr />
        <H2 id="evm-and-solana-together">🌐 EVM та Solana разом</H2>
        <P>
          Одна таблиця обслуговує обидві мережі: <Code>sub</Code> починається з <Code>eip155:</Code> або{' '}
          <Code>solana:</Code>. Якщо потрібно об&apos;єднати рядки користувача між різними гаманцями, прив&apos;яжіть
          єдиний внутрішній userId через <Code>sessionStore.bindSubject(id, userId)</Code>.
        </P>

        <Hr />
        <H2 id="security-and-key-rotation">Безпека та ротація ключів</H2>
        <Ul>
          <Li>
            <strong>Вмикайте RLS для кожної таблиці:</strong> Без цього будь-який автентифікований запит отримає доступ
            до всіх даних.
          </Li>
          <Li>
            <strong>Supabase довіряє підпису:</strong> Зберігайте <Code>SIWX_JWT_PRIVATE_KEY</Code> виключно на сервері.
          </Li>
          <Li>
            <strong>Ротація займає до 30 хвилин:</strong> При ротації залишайте старий ключ у <Code>previousKeys</Code>{' '}
            щонайменше на 30 хвилин.
          </Li>
        </Ul>

        <Hr />
        <H2 id="local-development">Локальна розробка</H2>
        <P>
          Для локального тестування використовуйте публічний тунель або передайте безпосередньо вміст ключів через
          параметр <Code>custom_jwks</Code> у запиті Management API.
        </P>

        <Hr />
        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="https://siwx.docs.tuwa.io/packages/siwx-server">Документація @tuwaio/siwx-server</A>
          </Li>
          <Li>
            <A href="https://supabase.com/docs/guides/database/postgres/row-level-security">
              Офіційний гайд Supabase по Row Level Security
            </A>
          </Li>
          <Li>
            <A href="/guides/siwx-jwt-external-auth">Зовнішня автентифікація SIWX через JWT</A>
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>SIWX 与 Supabase 深度集成：基于 RLS 行级安全的去中心化鉴权</H1>
      <P>
        传统 Web3 方案通常在应用层自行编写钱包签名验证，并在 Supabase Auth 的 <Code>auth.users</Code>{' '}
        表中人工写入假邮箱或用户行。这种做法破坏了多链一致性，且在处理智能合约账户或跨系统统一认证时极易出现断层。
      </P>
      <P>
        本指南提供更纯粹的原生集成架构：Supabase 直接信任由 SIWX 签发的短时效非对称 JWT，并在 PostgreSQL 内核级别通过
        Row Level Security (RLS) 行级策略保障数据物理隔离：
      </P>

      <Callout type="info">
        路由配置步骤提供 <strong>EVM</strong> 与 <strong>Solana</strong> 切换选项卡。数据库 RLS 部分跨链完全统一。
      </Callout>

      <Hr />
      <H2 id="how-it-works">架构原理与数据流转</H2>
      <CodeSnippet index={0} />

      <Hr />
      <H2 id="siwx-or-the-supabase-web3-sign-in">方案对比：SIWX 第三方鉴权 vs Supabase 原生 Web3 登录</H2>
      <Table>
        <thead>
          <Tr>
            <Th>特性维度</Th>
            <Th>Supabase 原生 Web3 登录</Th>
            <Th>SIWX + 第三方 JWKS 授权架构</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>用户实体存储位置</Td>
            <Td>强依赖 Supabase Auth 用户中心表</Td>
            <Td>保留在自有 SIWX 会话；Supabase 仅充当无状态验签节点</Td>
          </Tr>
          <Tr>
            <Td>跨链协议一致性</Td>
            <Td>以太坊与 Solana 逻辑分裂</Td>
            <Td>基于 CAIP-122 标准，多链采用统一交互协议</Td>
          </Tr>
          <Tr>
            <Td>智能合约钱包 (Safe/AA)</Td>
            <Td>官方文档未予支持</Td>
            <Td>原生支持 EIP-1271 与 ERC-6492 链上验签</Td>
          </Tr>
          <Tr>
            <Td>RLS 策略权限函数</Td>
            <Td>
              <Code>auth.uid()</Code>
            </Td>
            <Td>
              <Code>auth.jwt() -&gt;&gt; &apos;sub&apos;</Code>
            </Td>
          </Tr>
        </tbody>
      </Table>

      <H2 id="before-you-start">开始之前</H2>
      <Ul>
        <Li>
          <strong>全栈 React 指南中的应用</strong>，包含 SIWX 路由配置及 <Code>src/lib/authStores.ts</Code>。
        </Li>
        <Li>
          <strong>JWT 签名密钥</strong>：已写入环境变量 <Code>SIWX_JWT_PRIVATE_KEY</Code>。
        </Li>
        <Li>
          <strong>Supabase 项目</strong>：已配置 <Code>NEXT_PUBLIC_SUPABASE_URL</Code> 与{' '}
          <Code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</Code>。
        </Li>
        <Li>
          <strong>公网 HTTPS 域名</strong>，供 Supabase 拉取 JWKS 公钥。
        </Li>
      </Ul>
      <CodeSnippet index={1} />

      <Hr />
      <H2 id="step-1-add-the-role-claim-to-the-token">步骤 1：为 JWT 载荷注入角色声明 (role)</H2>
      <P>
        Supabase 要求 JWT 必须包含 <Code>role: &quot;authenticated&quot;</Code> 声明以匹配 Postgres 授权角色：
      </P>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={2} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={3} />
        </Tabs.Tab>
      </Tabs>

      <Hr />
      <H2 id="step-2-register-your-jwks-with-supabase">步骤 2：在 Supabase 控制台登记第三方 JWKS</H2>
      <P>通过 Supabase Management API 注册公钥端点：</P>
      <CodeSnippet index={4} />
      <P>本地开发时也可直接上传静态公钥集：</P>
      <CodeSnippet index={5} />

      <Hr />
      <H2 id="step-3-create-a-table-with-row-level-security">步骤 3：编写 Postgres 行级安全防御策略 (RLS)</H2>
      <P>
        在数据库迁移脚本中通过 <Code>auth.jwt() -&gt;&gt; &apos;sub&apos;</Code> 直接匹配操作者的钱包地址：
      </P>
      <CodeSnippet index={6} />

      <Hr />
      <H2 id="step-4-create-the-supabase-client">步骤 4：初始化 supabase-js 客户端并绑定 Token</H2>
      <P>在客户端利用内置钩子为每一次 API 调用注入经过加密验证的短时效 Bearer Token：</P>
      <CodeSnippet index={7} />

      <Hr />
      <H2 id="step-5-read-and-write-rows">步骤 5：读写数据行</H2>
      <P>创建与当前登录钱包绑定的便签组件：</P>
      <CodeSnippet index={8} />

      <Hr />
      <H2 id="step-6-query-as-the-wallet-from-a-server-action">步骤 6：通过 Server Action 代表钱包发起查询</H2>
      <P>Server Action 无需使用绕过 RLS 的 service role 密钥，直接通过会话签署短期 Token：</P>
      <CodeSnippet index={9} />

      <Hr />
      <H2 id="what-supabase-reads-from-the-token">Supabase 读取的 Token 声明</H2>
      <Table>
        <thead>
          <Tr>
            <Th>声明 (Claim)</Th>
            <Th>用途说明</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <Code>role</Code>
            </Td>
            <Td>
              映射 Postgres 角色：<Code>authenticated</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>sub</Code>
            </Td>
            <Td>
              RLS 策略比对的钱包标识 (<Code>auth.jwt() -&gt;&gt; &apos;sub&apos;</Code>)
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>caip10</Code>
            </Td>
            <Td>全限定 CAIP-10 钱包标识</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>chain_id</Code>
            </Td>
            <Td>签名时所在的 CAIP-2 链标识</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>exp</Code>
            </Td>
            <Td>有效期截止时间戳</Td>
          </Tr>
        </tbody>
      </Table>

      <Hr />
      <H2 id="evm-and-solana-together">🌐 EVM 与 Solana 双链协同</H2>
      <P>
        单张表同时支持两条主链：<Code>sub</Code> 自动携带 <Code>eip155:</Code> 或 <Code>solana:</Code>{' '}
        前缀。若需将同一用户的多链钱包聚合至相同数据视图，可通过 <Code>sessionStore.bindSubject(id, userId)</Code>{' '}
        绑定统一的用户 ID。
      </P>

      <Hr />
      <H2 id="security-and-key-rotation">安全防护与密钥轮换</H2>
      <Ul>
        <Li>
          <strong>务必开启每张表的 RLS：</strong> 未开启 RLS 的表将暴露给所有已认证用户。
        </Li>
        <Li>
          <strong>保管好私密密钥：</strong> <Code>SIWX_JWT_PRIVATE_KEY</Code> 严禁外泄。
        </Li>
        <Li>
          <strong>轮换需保留缓冲时间：</strong> Supabase 缓存 JWKS 约 30 分钟，轮换时需保持旧密钥共存。
        </Li>
      </Ul>

      <Hr />
      <H2 id="local-development">本地开发注意项</H2>
      <P>
        本地测试建议使用公网隧道（如 ngrok）或通过 Management API 直接上传 <Code>custom_jwks</Code> 进行静态配置。
      </P>

      <Hr />
      <H2 id="next-steps">📚 下一步探索</H2>
      <Ul>
        <Li>
          <A href="https://siwx.docs.tuwa.io/packages/siwx-server">@tuwaio/siwx-server 核心文档</A>
        </Li>
        <Li>
          <A href="https://supabase.com/docs/guides/database/postgres/row-level-security">Supabase RLS 官方指南</A>
        </Li>
        <Li>
          <A href="/guides/siwx-jwt-external-auth">SIWX JWT 外部认证集成指南</A>
        </Li>
      </Ul>
    </>
  );
}
