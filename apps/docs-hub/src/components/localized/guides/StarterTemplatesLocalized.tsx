'use client';

import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function StarterTemplatesLocalized({ locale }: { locale: Locale }) {
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
  const Th = mdx.th ?? 'th';
  const Tr = mdx.tr ?? 'tr';
  const Td = mdx.td ?? 'td';

  if (locale === 'uk') {
    return (
      <>
        <H1>Стартові шаблони (Starter Templates)</H1>
        <P>
          Найшвидший спосіб спробувати екосистему TUWA — це розгорнути готовий шаблон із репозиторію{' '}
          <A href="https://github.com/TuwaIO/cosmos-playground">Cosmos Playground</A>: це повнофункціональний додаток із
          підключенням гаманців (Nova Connect на базі Satellite Connect), відстеженням транзакцій (Pulsar) та модальними
          вікнами й тостами (Nova Transactions). Більшість шаблонів використовують пакет <Code>@tuwaio/sdk</Code>;
          шаблон <Code>nextjs-tuwa-not-sdk</Code> демонструє встановлення окремих модулів безпосередньо, як у нашому{' '}
          <A href="/guides/react-transaction-tracking">посібнику з відстеження транзакцій у React</A>.
        </P>
        <Hr />
        <H2 id="templates">🚀 Доступні шаблони</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Шаблон</Th>
              <Th>Функціонал та демонстрація</Th>
              <Th>Стек технологій</Th>
              <Th>Рівень</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <Code>nextjs-tuwa</Code>
              </Td>
              <Td>EVM та Solana: підключення гаманців і трекінг транзакцій (стандартні та ERC-4337)</Td>
              <Td>Next.js 16, @tuwaio/sdk, @wagmi/core, @solana/kit</Td>
              <Td>Beginner</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>nextjs-evm</Code>
              </Td>
              <Td>Тільки EVM: авторизація гаманцем через SIWX (CAIP-122) та серверні сесії</Td>
              <Td>Next.js 16, @tuwaio/sdk, @wagmi/core</Td>
              <Td>Beginner</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>nextjs-solana</Code>
              </Td>
              <Td>Тільки Solana: вхід через SIWX (CAIP-122), серверні сесії та клієнт програми з Codama</Td>
              <Td>Next.js 16, @tuwaio/sdk, @solana/kit</Td>
              <Td>Beginner</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>vite-tuwa</Code>
              </Td>
              <Td>SPA-аналог шаблону nextjs-tuwa на чистому клієнтському стеку Vite</Td>
              <Td>Vite 8, @tuwaio/sdk, @wagmi/core, @solana/kit</Td>
              <Td>Beginner</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>nextjs-tuwa-not-sdk</Code>
              </Td>
              <Td>Аналог nextjs-tuwa, але на окремих атомарних пакетах замість монолітного SDK</Td>
              <Td>Next.js 16, @wagmi/core, @solana/kit, @tuwaio/pulsar-*</Td>
              <Td>Intermediate</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>custom-style</Code>
              </Td>
              <Td>
                Кастомізація UI: стилізація Nova Connect та Transactions через змінні <Code>--tuwa-*</Code> (
                <A href="https://custom-style.tuwa.io/">демо</A>)
              </Td>
              <Td>Vite 8, @tuwaio/sdk</Td>
              <Td>Intermediate</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>nextjs-tuwa-quasar</Code>
              </Td>
              <Td>
                Повний стек: SIWX, синхронізація транзакцій із Quasar Cloud, історія гаманця та вебхуки (
                <A href="https://demo.tuwa.io/">демо</A>)
              </Td>
              <Td>Next.js 16, @tuwaio/sdk, @tuwaio/quasar-sdk</Td>
              <Td>Advanced</Td>
            </Tr>
          </tbody>
        </Table>
        <P>
          Вихідний код кожного шаблону знаходиться у папці{' '}
          <A href="https://github.com/TuwaIO/cosmos-playground/tree/main/examples">cosmos-playground/examples</A>. У
          файлі README для кожного прикладу перелічено необхідні змінні оточення та доступні скрипти.
        </P>
        <Callout type="info">
          Жоден шаблон не рендерить провайдер <Code>WagmiProvider</Code> і не тягне бібліотеку React Query: модулі
          Satellite Connect та Pulsar викликають напряму чисті функції <Code>@wagmi/core</Code>. Шаблони із сесіями SIWX
          зберігають сесію в підписаних HttpOnly-куках і можуть працювати навіть без окремої бази даних.
        </Callout>
        <Hr />
        <H2 id="create-a-project">🛠️ Створення проекту</H2>
        <H3 id="1-run-the-cli">1. Запустіть інтерактивний CLI</H3>
        <CodeSnippet index={0} />
        <P>
          Утиліта запропонує обрати шаблон і назву проекту, клонує код із GitHub та встановить залежності за допомогою
          pnpm (або bun/yarn/npm, якщо pnpm не встановлено).
        </P>
        <H3 id="2-configure-and-start">2. Налаштування змінних оточення та старт</H3>
        <P>
          Кожен шаблон містить файл <Code>.env.example</Code>. Скопіюйте його у <Code>.env</Code>, вкажіть за потреби
          власні ключі RPC або Quasar та запустіть сервер розробки:
        </P>
        <CodeSnippet index={1} />
        <P>
          Щоб отримувати вебхуки Quasar локально у шаблоні <Code>nextjs-tuwa-quasar</Code>, виконайте команду{' '}
          <Code>pnpm webhooks</Code> у сусідньому терміналі поруч із <Code>pnpm dev</Code>.
        </P>
        <H3 id="3-build-with-an-ai-agent">3. Спільна розробка зі штучним інтелектом (AI Agents)</H3>
        <P>
          Кожен шаблон постачається із файлом <Code>AGENTS.md</Code>, який регламентує правила для AI-асистентів і
          посилається на офіційний канонічний документ{' '}
          <A href="https://github.com/TuwaIO/workflows/blob/main/TUWA_AGENTS.md">TUWA_AGENTS.md</A>.
        </P>
        <Hr />
        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="/guides/react-transaction-tracking">Посібник з відстеження транзакцій у React з Pulsar</A>
          </Li>
          <Li>
            <A href="https://stories.tuwa.io/">Nova UI Kit Storybook</A>
          </Li>
          <Li>
            <A href="/">Довідник пакетів на головній сторінці</A>
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>官方脚手架与入门模板 (Starter Templates)</H1>
      <P>
        上手体验 TUWA 技术栈最敏捷的途径是使用来自{' '}
        <A href="https://github.com/TuwaIO/cosmos-playground">Cosmos Playground</A>{' '}
        的官方生产级模板：这些脚手架已深度预置钱包连接模块 (Nova Connect / Satellite Connect)、全生命周期交易状态追踪机
        (Pulsar) 以及适配深浅色主题的弹窗与通知体系 (Nova Transactions)。大多数模板基于统一的 <Code>@tuwaio/sdk</Code>；
        <Code>nextjs-tuwa-not-sdk</Code> 则演示如何以非 SDK 形式按需导入独立原子包。
      </P>
      <Hr />
      <H2 id="templates">🚀 预置模板矩阵</H2>
      <Table>
        <thead>
          <Tr>
            <Th>模板标识</Th>
            <Th>核心演示能力</Th>
            <Th>技术栈规格</Th>
            <Th>上手难度</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <Code>nextjs-tuwa</Code>
            </Td>
            <Td>双链支持：EVM 与 Solana 钱包免配置连接、标准交易与 ERC-4337 抽象账户追踪</Td>
            <Td>Next.js 16, @tuwaio/sdk, @wagmi/core, @solana/kit</Td>
            <Td>入门 (Beginner)</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>nextjs-evm</Code>
            </Td>
            <Td>专注 EVM 生态：基于 CAIP-122 标准的 SIWX 钱包签名登录与安全服务端会话管理</Td>
            <Td>Next.js 16, @tuwaio/sdk, @wagmi/core</Td>
            <Td>入门 (Beginner)</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>nextjs-solana</Code>
            </Td>
            <Td>专注 Solana 生态：SIWX 多链会话集成与基于 Codama 自动生成的智能合约客户端</Td>
            <Td>Next.js 16, @tuwaio/sdk, @solana/kit</Td>
            <Td>入门 (Beginner)</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>vite-tuwa</Code>
            </Td>
            <Td>纯客户端单页应用 (SPA) 架构，极速构建轻量级 DApp</Td>
            <Td>Vite 8, @tuwaio/sdk, @wagmi/core, @solana/kit</Td>
            <Td>入门 (Beginner)</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>nextjs-tuwa-not-sdk</Code>
            </Td>
            <Td>细粒度架构：拆解 SDK，按需引入 Satellite、Pulsar 与 Nova 核心原子包</Td>
            <Td>Next.js 16, @wagmi/core, @solana/kit, @tuwaio/pulsar-*</Td>
            <Td>中级 (Intermediate)</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>custom-style</Code>
            </Td>
            <Td>
              深度定制设计系统：通过 CSS 变量 <Code>--tuwa-*</Code> 实现定制换肤 (
              <A href="https://custom-style.tuwa.io/">在线 Demo</A>)
            </Td>
            <Td>Vite 8, @tuwaio/sdk</Td>
            <Td>中级 (Intermediate)</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>nextjs-tuwa-quasar</Code>
            </Td>
            <Td>
              全栈闭环架构：SIWX 鉴权、跨端云端交易同步、钱包多设备历史与 Webhook 调度 (
              <A href="https://demo.tuwa.io/">在线 Demo</A>)
            </Td>
            <Td>Next.js 16, @tuwaio/sdk, @tuwaio/quasar-sdk</Td>
            <Td>高级 (Advanced)</Td>
          </Tr>
        </tbody>
      </Table>
      <P>
        全部模板源代码位于仓库目录{' '}
        <A href="https://github.com/TuwaIO/cosmos-playground/tree/main/examples">cosmos-playground/examples</A>。
      </P>
      <Callout type="info">
        所有模板绝不渲染臃肿的 <Code>WagmiProvider</Code>，也绝不强依赖 React Query：底层组件直接调用{' '}
        <Code>@wagmi/core</Code> 的纯函数执行链端交互。所有集成 SIWX 的模板默认将状态保存在签名 HttpOnly Cookie
        中，零外部数据库依赖即可顺畅运行。
      </Callout>
      <Hr />
      <H2 id="create-a-project">🛠️ 初始化项目</H2>
      <H3 id="1-run-the-cli">1. 运行交互式脚手架 CLI</H3>
      <CodeSnippet index={0} />
      <P>CLI 将交互式询问模板类型与目标工程名，自动从 GitHub 拉取代码并使用 pnpm 极速安装依赖。</P>
      <H3 id="2-configure-and-start">2. 环境变量配置与本地启动</H3>
      <P>复制模版自带的配置文件并启动本地开发服务：</P>
      <CodeSnippet index={1} />
      <P>
        在 <Code>nextjs-tuwa-quasar</Code> 模板中，若要在本地调试 Webhook 回调通知，只需另起终端窗口执行{' '}
        <Code>pnpm webhooks</Code> 启动本地中继转发服务。
      </P>
      <H3 id="3-build-with-an-ai-agent">3. 借助 AI 编码 Agent 协同开发</H3>
      <P>
        每个模板均包含专门配置的 <Code>AGENTS.md</Code> 指南，直接链接至{' '}
        <A href="https://github.com/TuwaIO/workflows/blob/main/TUWA_AGENTS.md">TUWA_AGENTS.md</A>
        ，为大语言模型编程助手提供精准的架构规范与类型上下文。
      </P>
      <Hr />
      <H2 id="next-steps">📚 下一步探索</H2>
      <Ul>
        <Li>
          <A href="/guides/react-transaction-tracking">在 React 中使用 Pulsar 追踪交易</A>
        </Li>
        <Li>
          <A href="https://stories.tuwa.io/">Nova UI Kit Storybook</A>
        </Li>
        <Li>
          <A href="/">主页查阅全部包 API 规范</A>
        </Li>
      </Ul>
    </>
  );
}
