'use client';

import { Tabs } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function ReactTxTrackingLocalized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const P = mdx.p ?? 'p';
  const Ul = mdx.ul ?? 'ul';
  const Li = mdx.li ?? 'li';
  const Hr = mdx.hr ?? 'hr';
  const A = mdx.a ?? 'a';
  const Code = mdx.code ?? 'code';

  if (locale === 'uk') {
    return (
      <>
        <H1>Відстеження транзакцій у React за допомогою Pulsar</H1>
        <P>
          Цей посібник крок за кроком демонструє, як налаштувати автономне відстеження життєвого циклу транзакцій у
          React за допомогою ядра <strong>Pulsar</strong>. Ви отримаєте стійкість до перезавантаження вкладки,
          перемикання між сторінками та автоматичне виявлення заміни транзакцій (Speed-Up).
        </P>

        <Hr />

        <H2 id="before-you-start">Перед початком</H2>
        <Ul>
          <Li>
            <strong>React 19.2 або новіше</strong> (з підтримкою Next.js App Router).
          </Li>
          <Li>
            <strong>Підключення гаманця</strong> через Satellite Connect або Nova Connect.
          </Li>
          <Li>
            <strong>Конфігурація мережі:</strong> wagmiConfig для EVM або solanaRPCUrls для Solana.
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
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="step-2-describe-the-contract-or-program">Крок 2: Опис контракту чи програми</H2>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <P>
              Вам потрібні адреса та ABI контракту. У цьому посібнику використовується контракт Counter у мережі
              Sepolia:
            </P>
            <CodeSnippet index={2} />
          </Tabs.Tab>
          <Tabs.Tab>
            <P>Вам потрібен файл IDL програми. У цьому посібнику використовується програма solanatest:</P>
            <CodeSnippet index={3} />
            <P>Згенеруйте типізовані білдери інструкцій за допомогою Codama CLI:</P>
            <CodeSnippet index={4} />
            <CodeSnippet index={5} />
            <CodeSnippet index={6} />
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="step-3-create-an-action">Крок 3: Створення дії</H2>
        <P>
          Дія — це функція, яка запитує підпис гаманця і повертає ключ транзакції. Pulsar викликає її всередині{' '}
          <Code>executeTxAction</Code>:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={7} />
            <P>
              <strong>Опціонально: виклик через смарт-акаунт ERC-4337.</strong> За допомогою{' '}
              <Code>@tuwaio/orbit-evm</Code> можна відправити дію як UserOperation:
            </P>
            <CodeSnippet index={8} />
          </Tabs.Tab>
          <Tabs.Tab>
            <P>
              <Code>signAndSendSolanaTx</Code> формує транзакцію версії 0 і повертає підпис:
            </P>
            <CodeSnippet index={9} />
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="step-4-create-the-transaction-store">Крок 4: Створення сховища транзакцій</H2>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={10} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={11} />
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="step-5-resume-tracking-after-a-reload">Крок 5: Відновлення відстеження після перезавантаження</H2>
        <P>
          Компонент <Code>PulsarInitializer</Code> запускає фонові трекери для всіх нефіналізованих транзакцій після
          релоаду:
        </P>
        <CodeSnippet index={12} />

        <Hr />

        <H2 id="step-6-send-and-track-the-transaction">Крок 6: Відправка та відстеження транзакції</H2>
        <P>
          Виклик <Code>executeTxAction</Code> валідує метадані, запускає дію та бере транзакцію під керування
          стейт-машини:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={13} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={14} />
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="step-7-react-to-finished-transactions">Крок 7: Реакція на завершення транзакцій</H2>
        <P>
          Хук <Code>useTxFinished</Code> гарантує виконання оновлення UI навіть якщо транзакція завершилася під час
          релоаду:
        </P>
        <CodeSnippet index={15} />

        <Hr />

        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="/guides/full-stack-react">Full-Stack React застосунок</A>: інтеграція з SIWX та провайдерами Nova.
          </Li>
          <Li>
            <A href="/guides/quasar-transaction-sync">Синхронізація з Quasar</A>: міжпристроєва персистентність.
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>在 React 中基于 Pulsar 实现高可靠交易状态跟踪</H1>
      <P>
        本指南逐步讲解如何使用 <strong>Pulsar</strong> 在 React
        应用中构建具有抗刷新、跨标签页与抗重组能力的独立交易状态跟踪体系。
      </P>

      <Hr />

      <H2 id="before-you-start">准备工作</H2>
      <Ul>
        <Li>
          <strong>React 19.2 或更高版本</strong>（支持 Next.js App Router）。
        </Li>
        <Li>
          <strong>已配置钱包连接层：</strong>Satellite Connect 或 Nova Connect。
        </Li>
      </Ul>

      <Hr />

      <H2 id="step-1-install-the-packages">步骤 1：安装依赖包</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={0} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={1} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-2-describe-the-contract-or-program">步骤 2：定义目标合约 ABI 或程序规范</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <P>需要获取目标合约地址与其 ABI。以 Sepolia 上的计数器合约为例：</P>
          <CodeSnippet index={2} />
        </Tabs.Tab>
        <Tabs.Tab>
          <P>Solana 开发需要程序的 IDL 描述文件。以示例 solanatest 程序为例：</P>
          <CodeSnippet index={3} />
          <P>通过 Codama CLI 自动生成全类型化的指令构造器：</P>
          <CodeSnippet index={4} />
          <CodeSnippet index={5} />
          <CodeSnippet index={6} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-3-create-an-action">步骤 3：编写交易 Action 执行函数</H2>
      <P>
        Action 是请求钱包签名并返回交易凭据（txKey）的纯函数。Pulsar 会在 <Code>executeTxAction</Code> 内部调度它：
      </P>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={7} />
          <P>
            <strong>可选：通过 ERC-4337 智能账户调用。</strong>借助 <Code>@tuwaio/orbit-evm</Code> 可将调用作为
            UserOperation 发送至 Pimlico Bundler：
          </P>
          <CodeSnippet index={8} />
        </Tabs.Tab>
        <Tabs.Tab>
          <P>
            <Code>signAndSendSolanaTx</Code> 构造版本 0 交易并返回链上签名：
          </P>
          <CodeSnippet index={9} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-4-create-the-transaction-store">步骤 4：初始化 Local-First 交易存储库</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={10} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={11} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-5-resume-tracking-after-a-reload">步骤 5：页面重载后自动恢复活跃轮询池</H2>
      <P>
        渲染 <Code>PulsarInitializer</Code> 组件，页面重载后自动拉起所有未决状态交易的后台追踪器：
      </P>
      <CodeSnippet index={12} />

      <Hr />

      <H2 id="step-6-send-and-track-the-transaction">步骤 6：发送交易并接入状态机追踪</H2>
      <P>
        调用 <Code>executeTxAction</Code> 执行业务校验与生命周期追踪，状态变更自动驱动 UI 响应：
      </P>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={13} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={14} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="step-7-react-to-finished-transactions">步骤 7：监听交易终态完成事件</H2>
      <CodeSnippet index={15} />

      <Hr />

      <H2 id="next-steps">📚 后续指引</H2>
      <Ul>
        <Li>
          <A href="/guides/full-stack-react">全栈 React 应用搭建</A>：整合 Nova UI 与 SIWX 身份认证。
        </Li>
      </Ul>
    </>
  );
}
