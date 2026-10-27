'use client';

import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

export function QuotasLimitsLocalized({ locale }: { locale: Locale }) {
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
        <H1>Квоти та ліміти (Quotas & Limits)</H1>
        <P>
          Quasar Cloud вимірює використання ресурсів кожної організації в <strong>одиницях квоти (quota units)</strong>.
          У версії Community Edition збережено аналогічний білінг, проте початкові ліміти встановлено настільки високими
          (баланс у 100 000 000 одиниць і ліміт у 100 000 запитів на секунду), що вони практично не обмежують роботу
          окремого вузла.
        </P>
        <Hr />
        <H2 id="public-beta">🧪 Публічна бета-версія</H2>
        <P>Наразі Quasar Cloud перебуває на етапі відкритого тестування і надається безкоштовно:</P>
        <Ul>
          <Li>
            <strong>Кожна нова організація отримує 1 000 безкоштовних одиниць квоти</strong> одразу після створення.
          </Li>
          <Li>
            <strong>Придбання додаткової квоти заблоковано</strong> під час бета-тесту. Якщо вашому проекту потрібно
            більше одиниць, надішліть запит на адресу <A href="mailto:admin@tuwa.io">admin@tuwa.io</A> з поштової
            скриньки власника організації.
          </Li>
          <Li>
            У період бета-тестування функціонал, ліміти швидкості та розмір безкоштовної квоти можуть змінюватися.
          </Li>
        </Ul>
        <Hr />
        <H2 id="what-costs-quota">🧮 Вартість операцій у квотах</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Операція API</Th>
              <Th>Вартість (Units)</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                Синхронізація транзакції (<Code>POST /v1/engine/pulsar/sync</Code>), Live app
              </Td>
              <Td>10</Td>
            </Tr>
            <Tr>
              <Td>
                Синхронізація транзакції, Test app (<Code>sk_test_</Code>)
              </Td>
              <Td>5</Td>
            </Tr>
            <Tr>
              <Td>Доставка вебхука підписнику</Td>
              <Td>1 (лише за першу спробу доставки)</Td>
            </Tr>
            <Tr>
              <Td>
                Отримання історії транзакцій (<Code>GET /v1/engine/pulsar/history</Code>)
              </Td>
              <Td>0 (безкоштовно)</Td>
            </Tr>
            <Tr>
              <Td>
                Перевірка працездатності ноди (<Code>GET /v1/engine/monitoring/health</Code>)
              </Td>
              <Td>0 (публічний етап, ключ не потрібен)</Td>
            </Tr>
          </tbody>
        </Table>
        <P>
          Списуються всі запити на синхронізацію, зокрема й ті, на які Quasar відповідає з прапорцем{' '}
          <Code>duplicate: true</Code> (коли транзакція з таким <Code>txKey</Code> вже відстежується). Повторний запит
          не створює дублікатів і не навантажує повторний трекінг, тому виклик <Code>onRemoteCreate</Code> залишається
          безпечним, але витрачає одиниці квоти.
        </P>
        <Hr />
        <H2 id="when-the-quota-is-used-up">📉 Що відбувається при вичерпанні квоти</H2>
        <Ul>
          <Li>
            <strong>Синхронізація продовжує приймати транзакції</strong>, щоб жодна операція користувачів не втратилася:
            відповідь надходить у режимі <Code>mode: &quot;lazy&quot;</Code> (код HTTP <Code>202 Accepted</Code> замість{' '}
            <Code>200 OK</Code>), і транзакція стає у чергу фонової обробки.
          </Li>
          <Li>
            <strong>Усі інші запити з API ключем</strong>, зокрема запит історії транзакцій, відхиляються з помилкою{' '}
            <Code>402 Payment Required</Code>, доки баланс організації не буде поповнено.
          </Li>
        </Ul>
        <Callout type="warning">
          Стежте за залишком квоти в панелі керування Quasar. Сервіс завчасно надсилає сповіщення власникам організації
          при низькому балансі. Під час бета-тестування пишіть на <A href="mailto:admin@tuwa.io">admin@tuwa.io</A> для
          безкоштовного розширення балансу.
        </Callout>
        <Hr />
        <H2 id="other-limits">🚦 Інші ліміти платформи</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Параметр обмеження</Th>
              <Th>Значення</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Кількість запитів на секунду (RPS)</Td>
              <Td>На організацію (5 req/s у Quasar Cloud); перевищення повертає HTTP 429</Td>
            </Tr>
            <Tr>
              <Td>Кількість транзакцій на сторінку історії</Td>
              <Td>Параметр limit до 100 (за замовчуванням 10)</Td>
            </Tr>
            <Tr>
              <Td>Додатків (Apps) в організації</Td>
              <Td>До 30 додатків</Td>
            </Tr>
            <Tr>
              <Td>Кінцевих точок вебхуків на додаток</Td>
              <Td>До 500 ендпоінтів</Td>
            </Tr>
            <Tr>
              <Td>Точки вебхуків на localhost</Td>
              <Td>1 на організацію (для локальної розробки через CLI)</Td>
            </Tr>
            <Tr>
              <Td>Таймаут відповіді на вебхук</Td>
              <Td>10 секунд на кожну спробу доставки</Td>
            </Tr>
          </tbody>
        </Table>
        <P>
          Усі синхронізовані транзакції також проходять валідацію лімітів безпеки Pulsar (граничний розмір текстових
          полів та об&apos;єкта <Code>payload</Code>); за перевищення повертається помилка <Code>400 Bad Request</Code>.
        </P>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>配额与速率限制 (Quotas & Limits)</H1>
      <P>
        Quasar Cloud 按组织计量资源消耗，计费单位为 <strong>配额点数 (Quota Units)</strong>。Quasar Community
        Edition（开源社区版）拥有相同的计费接口，但其初始限制预设极高（100,000,000 点余额与每秒 100,000
        次请求上限），完全不会对独立自建节点构成约束。
      </P>
      <Hr />
      <H2 id="public-beta">🧪 公开测试版政策</H2>
      <P>Quasar Cloud 当前处于公开测试阶段，面向所有开发者免费开放：</P>
      <Ul>
        <Li>
          <strong>每个新创建的组织自动获得 1,000 个免费配额点数</strong>。
        </Li>
        <Li>
          <strong>公测期间暂停点数充值通道</strong>。如果您的应用即将耗尽配额，请使用账户注册邮箱直接致信{' '}
          <A href="mailto:admin@tuwa.io">admin@tuwa.io</A> 申请免费扩容。
        </Li>
        <Li>测试期间，平台功能特性、并发限流指标及赠送额度可能会根据网络负载动态调整。</Li>
      </Ul>
      <Hr />
      <H2 id="what-costs-quota">🧮 配额消耗费率表</H2>
      <Table>
        <thead>
          <Tr>
            <Th>API 操作</Th>
            <Th>消耗配额 (Units)</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              同步上链交易 (<Code>POST /v1/engine/pulsar/sync</Code>)，生产环境 App
            </Td>
            <Td>10</Td>
          </Tr>
          <Tr>
            <Td>
              同步上链交易，测试环境 App (<Code>sk_test_</Code>)
            </Td>
            <Td>5</Td>
          </Tr>
          <Tr>
            <Td>Webhook 投递通知</Td>
            <Td>1（仅在首次投递尝试时计费）</Td>
          </Tr>
          <Tr>
            <Td>
              查询历史交易 (<Code>GET /v1/engine/pulsar/history</Code>)
            </Td>
            <Td>0（免费）</Td>
          </Tr>
          <Tr>
            <Td>
              健康检查探测 (<Code>GET /v1/engine/monitoring/health</Code>)
            </Td>
            <Td>0（公开免鉴权接口）</Td>
          </Tr>
        </tbody>
      </Table>
      <P>
        每次有效的同步请求均计入计量，包括触发 <Code>duplicate: true</Code>（因相同 <Code>txKey</Code>{' '}
        已存在）的重复请求。重复请求不会创建新记录，也不会发起二次链上追踪，因此客户端重试 <Code>onRemoteCreate</Code>{' '}
        是幂等安全的，但会扣减基础调用点数。
      </P>
      <Hr />
      <H2 id="when-the-quota-is-used-up">📉 配额耗尽时的降级机制</H2>
      <Ul>
        <Li>
          <strong>交易同步接口仍将继续接收数据</strong>，保障终端用户的钱包交易永不丢弃：此时 API 返回{' '}
          <Code>mode: &quot;lazy&quot;</Code>（状态码由 200 转为 HTTP 202 Accepted），交易进入异步延迟追踪队列。
        </Li>
        <Li>
          <strong>其他需要 API 密钥的请求</strong>（包括历史交易列表查询）将直接拒绝并返回{' '}
          <Code>402 Payment Required</Code>，直至账户配额恢复。
        </Li>
      </Ul>
      <Callout type="warning">
        您可以在 Quasar 控制台随时查看配额消耗趋势；当余额偏低时平台会自动发送邮件告警。公测期间请联系{' '}
        <A href="mailto:admin@tuwa.io">admin@tuwa.io</A> 获取更多配额。
      </Callout>
      <Hr />
      <H2 id="other-limits">🚦 平台其他安全限额</H2>
      <Table>
        <thead>
          <Tr>
            <Th>限制项</Th>
            <Th>参数值</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>每秒请求数 (RPS)</Td>
            <Td>按组织隔离（Quasar Cloud 默认为 5 req/s）；超出限制将返回 HTTP 429</Td>
          </Tr>
          <Tr>
            <Td>单页历史交易记录上限</Td>
            <Td>limit 参数最大为 100 条（默认为 10 条）</Td>
          </Tr>
          <Tr>
            <Td>单个组织可创建的应用数量</Td>
            <Td>最多 30 个 App</Td>
          </Tr>
          <Tr>
            <Td>单应用 Webhook 终端节点数量</Td>
            <Td>最多 500 个 Endpoints</Td>
          </Tr>
          <Tr>
            <Td>localhost Webhook 调试节点</Td>
            <Td>单组织限 1 个（配合 CLI 中继进行本地开发调试）</Td>
          </Tr>
          <Tr>
            <Td>Webhook 接收端超时时限</Td>
            <Td>单次投递最多等待 10 秒</Td>
          </Tr>
        </tbody>
      </Table>
      <P>
        此外，所有同步交易体还必须符合 Pulsar 的数据安全规格校验（文本字段与 <Code>payload</Code>{' '}
        载荷长度上限）；非法结构将直接拒绝并返回 HTTP 400。
      </P>
    </>
  );
}
