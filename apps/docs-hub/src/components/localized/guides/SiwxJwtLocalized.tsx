'use client';

import { Callout, Tabs } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function SiwxJwtLocalized({ locale }: { locale: Locale }) {
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
        <H1>Інтеграція входу SIWX із зовнішніми сервісами через JWT та JWKS</H1>
        <P>
          Сесія SIWX за замовчуванням зберігається в захищеній <Code>HttpOnly</Code> куці: доступ до неї має виключно
          ваш власний сервер. Проте багато зовнішніх платформ (наприклад, провайдери вбудованих гаманців із кастомною
          автентифікацією, такі як{' '}
          <A href="https://docs.cdp.coinbase.com/embedded-wallets/custom-authentication">Coinbase CDP</A>, зовнішні IdP
          або ваші власні мікросервіси) приймають авторизацію лише у вигляді JWT-токенів, підписаних вашими публічними
          ключами.
        </P>
        <P>Цей посібник зв&apos;язує їх в єдину безшовну систему. За підсумком ви отримаєте:</P>
        <Ul>
          <Li>
            <Code>GET /api/siwx/token</Code> — видає короткоживучий JWT для гаманця, що увійшов через SIWX.
          </Li>
          <Li>
            <Code>GET /api/siwx/jwks</Code> — публікує криптографічні публічні ключі для перевірки підпису.
          </Li>
          <Li>
            Підключення Coinbase CDP Custom Auth, який створює вбудований смарт-гаманець для авторизованого користувача.
          </Li>
          <Li>Власний мікросервіс, що надійно довіряє токену без прямого доступу до бази сесій.</Li>
        </Ul>

        <Callout type="info">
          Крок налаштування маршруту містить вкладки <strong>EVM</strong> та <strong>Solana</strong>, синхронізовані з
          іншими посібниками.
        </Callout>

        <Hr />
        <H2 id="how-it-works">Архітектура та життєвий цикл</H2>
        <CodeSnippet index={0} />

        <H2 id="before-you-start">Перед початком</H2>
        <Ul>
          <Li>
            <strong>Додаток з посібника Full-Stack React</strong>, з маршрутами SIWX та файлом{' '}
            <Code>src/lib/authStores.ts</Code>.
          </Li>
          <Li>
            <strong>Публічний HTTPS URL</strong> для додатку: зовнішній провайдер завантажує ваш JWKS за цією адресою.
          </Li>
        </Ul>

        <Hr />
        <H2 id="step-1-create-a-signing-key">Крок 1: Генерація приватного ключа підпису</H2>
        <P>
          Виконайте цей скрипт один раз і збережіть отриманий приватний JWK у секретах середовища вашого проекту. За
          замовчуванням використовується сучасний алгоритм ES256 (крива P-256):
        </P>
        <CodeSnippet index={1} />
        <CodeSnippet index={2} />
        <P>
          Збережіть виведений рядок у змінній оточення <Code>SIWX_JWT_PRIVATE_KEY</Code> у файлі <Code>.env.local</Code>{' '}
          та в панелі вашого хостингу.
        </P>

        <Hr />
        <H2 id="step-2-enable-jwt-in-the-route-handler">Крок 2: Увімкнення JWT у маршрутизаторі API</H2>
        <P>
          Опція <Code>jwt</Code> автоматично додає обробку маршрутів <Code>/token</Code> та <Code>/jwks</Code> до вашого
          обробника сесій SIWX:
        </P>
        <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
          <Tabs.Tab>
            <CodeSnippet index={3} />
          </Tabs.Tab>
          <Tabs.Tab>
            <CodeSnippet index={4} />
          </Tabs.Tab>
        </Tabs>
        <Ul>
          <Li>
            <Code>GET /api/siwx/token</Code> повертає <Code>{`{ token, expiresAt }`}</Code> для поточної сесії із
            заголовком <Code>Cache-Control: no-store</Code> (або 401, якщо сесія відсутня).
          </Li>
          <Li>
            <Code>GET /api/siwx/jwks</Code> віддає набір публічних ключів із кешуванням на 5 хвилин.
          </Li>
        </Ul>

        <Hr />
        <H2 id="step-3-connect-coinbase-cdp-custom-authentication">
          Крок 3: Підключення Coinbase CDP Custom Authentication
        </H2>
        <P>
          У панелі керування <A href="https://portal.cdp.coinbase.com/">CDP Portal</A> перейдіть у налаштування
          кастомної автентифікації вашого проекту та вкажіть параметри:
        </P>
        <Table>
          <thead>
            <Tr>
              <Th>Параметр CDP</Th>
              <Th>Значення</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>JWKS endpoint URL</Td>
              <Td>
                <Code>https://&lt;ваш-домен&gt;/api/siwx/jwks</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>Issuer (iss)</Td>
              <Td>
                URL вашого додатку, наприклад <Code>https://&lt;ваш-домен&gt;</Code>
              </Td>
            </Tr>
            <Tr>
              <Td>Audience (aud)</Td>
              <Td>
                Значення audience з налаштувань (<Code>my-app</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>User identifier claim</Td>
              <Td>
                Залиште порожнім: за замовчуванням CDP використовує стандартне поле <Code>sub</Code>
              </Td>
            </Tr>
          </tbody>
        </Table>
        <P>Створіть клієнтський хелпер для отримання актуального токена:</P>
        <CodeSnippet index={5} />
        <P>Огорніть додаток у провайдер Coinbase CDP:</P>
        <CodeSnippet index={6} />

        <Hr />
        <H2 id="step-4-trust-the-token-in-your-own-services">Крок 4: Перевірка токена у власних бекенд-сервісах</H2>
        <P>
          Будь-який мікросервіс може автономно верифікувати токен за допомогою функції <Code>verifySiwxJwt</Code>:
        </P>
        <CodeSnippet index={7} />

        <Hr />
        <H2 id="what-ends-up-in-the-token">Клейми всередині виданого токена</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Клейм</Th>
              <Th>Призначення та зміст</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <Code>iss</Code>
              </Td>
              <Td>Видавець токена (URL вашого додатку)</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>aud</Code>
              </Td>
              <Td>Цільова аудиторія, якщо була налаштована</Td>
            </Tr>
            <Tr>
              <Td>
                <Code>sub</Code>
              </Td>
              <Td>
                Ідентифікатор користувача: прив&apos;язаний ID або адреса гаманця (у нижньому регістрі для EVM, Base58
                для Solana)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>caip10</Code>
              </Td>
              <Td>
                Повний ідентифікатор гаманця в стандарті CAIP-10 (наприклад, <Code>eip155:8453:0xAb58...</Code>)
              </Td>
            </Tr>
            <Tr>
              <Td>
                <Code>chain_id</Code>
              </Td>
              <Td>CAIP-2 ідентифікатор мережі під час входу</Td>
            </Tr>
          </tbody>
        </Table>

        <Hr />
        <H2 id="security-and-key-rotation">Безпека та ротація ключів</H2>
        <Ul>
          <Li>
            <strong>Короткий час життя токенів:</strong> За замовчуванням 10 хвилин достатньо. Ніколи не зберігайте
            токени в <Code>localStorage</Code>.
          </Li>
          <Li>
            <strong>Зберігайте ключ на сервері:</strong> <Code>SIWX_JWT_PRIVATE_KEY</Code> — це строгий секрет
            розгортання.
          </Li>
          <Li>
            <strong>Ротація без простоїв:</strong> Згенеруйте новий ключ, призначте його як <Code>signingKey</Code>, а
            старий публічний перемістіть у <Code>jwt.previousKeys</Code>.
          </Li>
        </Ul>

        <Hr />
        <H2 id="local-development">Локальна розробка</H2>
        <P>
          Зовнішній провайдер завантажує ваш JWKS через інтернет, тому <Code>http://localhost:3000</Code> для нього
          недоступний. Використовуйте публічний тунель (ngrok або cloudflare) або тестове середовище для повної
          перевірки потоку CDP.
        </P>

        <Hr />
        <H2 id="next-steps">📚 Наступні кроки</H2>
        <Ul>
          <Li>
            <A href="https://siwx.docs.tuwa.io/packages/siwx-server">Документація @tuwaio/siwx-server</A>
          </Li>
          <Li>
            <A href="/guides/multi-chain-auth-siwx-caip122">Мультичейн-автентифікація з SIWX</A>
          </Li>
          <Li>
            <A href="/guides/siwx-supabase">Supabase RLS із SIWX</A>
          </Li>
          <Li>
            <A href="/guides/full-stack-react">Full-Stack React застосунок</A>
          </Li>
        </Ul>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>SIWX 跨系统鉴权：通过 JWT 与 JWKS 对接外部服务</H1>
      <P>
        SIWX 会话默认以高安全性 <Code>HttpOnly</Code> Cookie 存储在服务端，仅限您的自有后端读取。但在现代 Web3
        架构中，许多外部系统（例如支持自定义认证的嵌入式钱包服务商{' '}
        <A href="https://docs.cdp.coinbase.com/embedded-wallets/custom-authentication">Coinbase CDP</A>
        、第三方微服务及无状态网关）仅接收基于非对称公钥验签的 JWT 凭据。
      </P>
      <P>本指南将统一两者：终端用户只需使用私钥对一条 CAIP-122 消息签名一次，全链路各系统即可获得可信身份：</P>
      <Ul>
        <Li>
          <Code>GET /api/siwx/token</Code>：为已验证的 SIWX 会话即时下发短时效非对称 JWT；
        </Li>
        <Li>
          <Code>GET /api/siwx/jwks</Code>：公开标准 JWKS 密钥集，供第三方验签拉取；
        </Li>
        <Li>无缝集成 Coinbase CDP Custom Authentication，为登录用户自动挂载嵌入式智能钱包；</Li>
        <Li>在任意自建独立微服务中，零外部数据库依赖即可本地秒级验签。</Li>
      </Ul>

      <Callout type="info">
        路由配置步骤提供 <strong>EVM</strong> 与 <strong>Solana</strong> 切换选项卡，已与其他指南保持同步。
      </Callout>

      <Hr />
      <H2 id="how-it-works">架构流转与验签机制</H2>
      <CodeSnippet index={0} />

      <H2 id="before-you-start">开始之前</H2>
      <Ul>
        <Li>
          <strong>全栈 React 指南中的应用</strong>，包含 SIWX 路由及 <Code>src/lib/authStores.ts</Code>。
        </Li>
        <Li>
          <strong>公开的 HTTPS 域名</strong>，供第三方拉取 JWKS（参见本地开发章节）。
        </Li>
      </Ul>

      <Hr />
      <H2 id="step-1-create-a-signing-key">步骤 1：生成 JWT 签名密钥对</H2>
      <P>在本地或构建容器中执行一次性密钥生成脚本，默认生成高强度、短签名的 ES256 (P-256) 椭圆曲线密钥：</P>
      <CodeSnippet index={1} />
      <CodeSnippet index={2} />
      <P>
        将输出的 <Code>SIWX_JWT_PRIVATE_KEY</Code> 妥善写入环境变量（<Code>.env.local</Code> 及云端生产环境变量）。
      </P>

      <Hr />
      <H2 id="step-2-enable-jwt-in-the-route-handler">步骤 2：在 API 路由处理器中启用 JWT 下发</H2>
      <P>
        配置 <Code>jwt</Code> 参数后，API 处理器将自动开启 <Code>/token</Code> 与 <Code>/jwks</Code> 路由：
      </P>
      <Tabs items={['EVM', 'Solana']} storageKey="tuwa-guide-network">
        <Tabs.Tab>
          <CodeSnippet index={3} />
        </Tabs.Tab>
        <Tabs.Tab>
          <CodeSnippet index={4} />
        </Tabs.Tab>
      </Tabs>
      <Ul>
        <Li>
          <Code>GET /api/siwx/token</Code> 返回当前会话签发的短时效 JWT（默认有效期 10 分钟），响应头带{' '}
          <Code>Cache-Control: no-store</Code>；无会话则直接返回 401。
        </Li>
        <Li>
          <Code>GET /api/siwx/jwks</Code> 返回公钥集并自带 5 分钟公共 CDN 缓存策略。
        </Li>
      </Ul>

      <Hr />
      <H2 id="step-3-connect-coinbase-cdp-custom-authentication">步骤 3：配置 Coinbase CDP 自定义认证</H2>
      <P>
        登录 <A href="https://portal.cdp.coinbase.com/">CDP 开发者后台</A>，在项目的 Custom Authentication
        设置中填入参数：
      </P>
      <Table>
        <thead>
          <Tr>
            <Th>配置项</Th>
            <Th>参数值</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>JWKS endpoint URL</Td>
            <Td>
              <Code>https://&lt;您的应用域名&gt;/api/siwx/jwks</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>Issuer (iss)</Td>
            <Td>
              服务端声明的发行者，如 <Code>https://&lt;您的应用域名&gt;</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>Audience (aud)</Td>
            <Td>
              声明的受信受众 (<Code>my-app</Code>)
            </Td>
          </Tr>
          <Tr>
            <Td>User identifier claim</Td>
            <Td>
              保持留空：CDP 将默认映射标准 <Code>sub</Code> 声明作为唯一用户标识
            </Td>
          </Tr>
        </tbody>
      </Table>
      <P>编写前端动态获取 JWT 的工具函数：</P>
      <CodeSnippet index={5} />
      <P>在 React 树顶层包裹 CDP Provider：</P>
      <CodeSnippet index={6} />

      <Hr />
      <H2 id="step-4-trust-the-token-in-your-own-services">步骤 4：在独立微服务中本地验签</H2>
      <P>任何能够通过网络拉取 JWKS 的后端服务均可通过内置函数快速解析并校验用户身份：</P>
      <CodeSnippet index={7} />

      <Hr />
      <H2 id="what-ends-up-in-the-token">JWT 载荷声明明细 (Claims)</H2>
      <Table>
        <thead>
          <Tr>
            <Th>声明 (Claim)</Th>
            <Th>内容说明</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <Code>iss</Code>
            </Td>
            <Td>发行者应用 URL 域名标识</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>aud</Code>
            </Td>
            <Td>预期的接收方受众标识</Td>
          </Tr>
          <Tr>
            <Td>
              <Code>sub</Code>
            </Td>
            <Td>
              用户唯一主体：EOA 钱包格式为 <Code>eip155:0x...</Code>，Solana 格式为 <Code>solana:&lt;address&gt;</Code>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>caip10</Code>
            </Td>
            <Td>
              CAIP-10 规范全限定账户标识（如 <Code>eip155:8453:0xAb58...</Code>）
            </Td>
          </Tr>
          <Tr>
            <Td>
              <Code>chain_id</Code>
            </Td>
            <Td>用户签名时的 CAIP-2 链标识</Td>
          </Tr>
        </tbody>
      </Table>

      <Hr />
      <H2 id="security-and-key-rotation">安全考量与密钥轮换</H2>
      <Ul>
        <Li>
          <strong>保持短时效：</strong> 默认 10 分钟已足够，切勿持久化存储在 <Code>localStorage</Code>。
        </Li>
        <Li>
          <strong>密钥服务端隔离：</strong> <Code>SIWX_JWT_PRIVATE_KEY</Code> 仅作为部署私密凭证保留在服务器。
        </Li>
        <Li>
          <strong>零停机轮换：</strong> 生成新密钥后移入 <Code>signingKey</Code>，旧公钥配置到{' '}
          <Code>jwt.previousKeys</Code> 供自然过渡。
        </Li>
      </Ul>

      <Hr />
      <H2 id="local-development">本地调试建议</H2>
      <P>
        第三方服务需拉取 JWKS 公钥，本地 <Code>localhost</Code> 无法直接访问。建议使用隧道（如
        ngrok）或预览环境进行完整联调。
      </P>

      <Hr />
      <H2 id="next-steps">📚 下一步探索</H2>
      <Ul>
        <Li>
          <A href="https://siwx.docs.tuwa.io/packages/siwx-server">@tuwaio/siwx-server 核心文档</A>
        </Li>
        <Li>
          <A href="/guides/multi-chain-auth-siwx-caip122">SIWX 多链认证指南</A>
        </Li>
        <Li>
          <A href="/guides/siwx-supabase">SIWX 与 Supabase RLS 指南</A>
        </Li>
        <Li>
          <A href="/guides/full-stack-react">全栈 React 最佳实践</A>
        </Li>
      </Ul>
    </>
  );
}
