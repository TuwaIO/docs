'use client';

import { Tabs } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function QuasarTxSyncLocalized({ locale }: { locale: Locale }) {
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

  if (locale === 'uk') {
    return (
      <>
        <H1>Синхронізація транзакцій із Quasar Cloud або Self-Hosted нодою</H1>
        <P>
          Цей посібник демонструє, як підключити хмарний або self-hosted індексатор <strong>Quasar</strong> до вашого
          Next.js застосунку. Завдяки Quasar транзакції користувача синхронізуються між усіма пристроями, відстежуються
          у фоні навіть після закриття вкладки та надсилаються на бекенд через криптографічно підписані вебхуки.
        </P>

        <Hr />

        <H2 id="before-you-start">Перед початком</H2>
        <Ul>
          <Li>
            <strong>Застосунок із посібника Full-Stack React</strong>, налаштований із маршрутами SIWX та сховищем
            сесій. Браузер ніколи не бачить секретний ключ Quasar: запити надсилаються через безпечні Server Actions.
          </Li>
          <Li>
            <strong>Секретний ключ Quasar</strong> у змінній <Code>QUASAR_SECRET_KEY</Code> на сервері. Для self-hosted
            ноди вкажіть її адресу в <Code>NEXT_PUBLIC_QUASAR_BASE_URL</Code>.
          </Li>
        </Ul>

        <Hr />

        <H2 id="step-1-install-the-quasar-client">Крок 1: Встановлення клієнта Quasar</H2>
        <CodeSnippet index={0} />

        <Hr />

        <H2 id="step-2-add-the-server-actions">Крок 2: Додавання Server Actions</H2>
        <P>
          Server Actions перевіряють сесію SIWX із куки перед зверненням до Quasar API, захищаючи квоту додатку та
          приватність історії користувача:
        </P>
        <CodeSnippet index={1} />

        <Hr />

        <H2 id="step-3-sync-from-the-transaction-store">Крок 3: Синхронізація зі сховища транзакцій</H2>
        <P>
          Метод <Code>beforeTxProcess</Code> викликає <Code>preFlightTxCheck</Code> перед показом вікна підпису гаманця,
          а хук <Code>onRemoteCreate</Code> відправляє кожну нову транзакцію до Quasar через Server Action:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={2} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={3} />
          </Tabs.Tab>
        </Tabs>

        <H3 id="eip-5792-batches">Батчі EIP-5792</H3>
        <P>
          Для пакетних викликів <Code>wallet_sendCalls</Code> передайте хеш фінальної транзакції через функцію{' '}
          <Code>syncBatchHash</Code>:
        </P>
        <CodeSnippet index={4} />
        <P>
          Потім підключіть спостереження за стором у браузері (<Code>@tuwaio/quasar-sdk</Code> 0.6+):
        </P>
        <CodeSnippet index={5} />

        <Hr />

        <H2 id="step-4-show-the-history">Крок 4: Відображення історії</H2>
        <P>
          Передайте в Nova сховище історії замість локального пулу, налаштуйте пагінацію та завантажте першу сторінку
          після підписання входу:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={6} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={7} />
          </Tabs.Tab>
        </Tabs>
        <P>
          Надішліть транзакцію, відкрийте додаток у іншому браузері з тим самим гаманцем та увійдіть: транзакція миттєво
          з&apos;явиться в історії та на панелі Quasar.
        </P>

        <Hr />

        <H2 id="server-signed-transactions-withdrawals--payouts">Серверні транзакції (виведення та виплати)</H2>
        <P>
          Для бекенд-виплат та релеєрів викликайте <Code>quasar.pulsar.syncCreate</Code> напряму без залучення браузера.
          Синхронізація є ідемпотентною за <Code>txKey</Code>, а Quasar надішле підписаний вебхук після фіналізації:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={8} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={9} />
          </Tabs.Tab>
        </Tabs>

        <Hr />

        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="/quasar/webhooks">Вебхуки Quasar</A>: налаштування доставки подій на ваш бекенд.
          </Li>
          <Li>
            <A href="/quasar/quotas-and-limits">Квоти та ліміти</A>: правила витрат та оптимізація запитів.
          </Li>
          <Li>
            <A href="/quasar/self-hosting">Self-Hosting Quasar</A>: запуск власної ноди в Docker.
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>同步交易至 Quasar（云端或自托管节点）</H1>
      <P>
        本指南介绍如何将 <strong>Quasar</strong> 交易索引层无缝接入 Next.js
        应用，实现跨设备历史记录同步与后台持久化跟踪。
      </P>

      <Hr />

      <H2 id="before-you-start">准备工作</H2>
      <Ul>
        <Li>已具备全栈 React 架构与 SIWX 认证会话支持；</Li>
        <Li>
          在服务端安全环境变量中配置 <Code>QUASAR_SECRET_KEY</Code>。
        </Li>
      </Ul>

      <Hr />

      <H2 id="step-1-install-the-quasar-client">步骤 1：安装 Quasar 客户端 SDK</H2>
      <CodeSnippet index={0} />

      <Hr />

      <H2 id="step-2-add-the-server-actions">步骤 2：添加安全 Server Actions</H2>
      <CodeSnippet index={1} />

      <Hr />

      <H2 id="step-3-sync-from-the-transaction-store">步骤 3：自 Pulsar 交易状态机发起同步</H2>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={2} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={3} />
        </Tabs.Tab>
      </Tabs>

      <H3 id="eip-5792-batches">EIP-5792 批量调用同步</H3>
      <P>
        针对 <Code>wallet_sendCalls</Code> 批量调用，通过 <Code>syncBatchHash</Code> 发送链上执行哈希：
      </P>
      <CodeSnippet index={4} />
      <P>
        并在浏览器端初始化监听器（<Code>@tuwaio/quasar-sdk</Code> 0.6+）：
      </P>
      <CodeSnippet index={5} />

      <Hr />

      <H2 id="step-4-show-the-history">步骤 4：渲染多端一致的交易历史面板</H2>
      <P>将 Nova 的数据源切换为 Quasar 历史存储库，配置分页并在签名认证通过后加载首屏历史：</P>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={6} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={7} />
        </Tabs.Tab>
      </Tabs>
      <P>在任一设备提交交易后，于另一台设备的同一钱包登入即可立即查阅同步的完整历史。</P>

      <Hr />

      <H2 id="server-signed-transactions-withdrawals--payouts">服务端签署交易（出金与提现批量处理）</H2>
      <P>
        针对服务端出金打款或后端中继，直接在 Node 环境调用 <Code>quasar.pulsar.syncCreate</Code>
        ，交易到达终态后将推送签名 Webhook：
      </P>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={8} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={9} />
        </Tabs.Tab>
      </Tabs>

      <Hr />

      <H2 id="next-steps">📚 后续指引</H2>
      <Ul>
        <Li>
          <A href="/quasar/webhooks">Webhooks 配置</A>：在终态确认时接收 HMAC 签名通知。
        </Li>
        <Li>
          <A href="/quasar/self-hosting">自托管部署</A>：完全自主运行 Quasar 社区版。
        </Li>
      </Ul>
    </>
  );
}
