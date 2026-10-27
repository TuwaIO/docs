'use client';

import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

import { CodeSnippet } from '../CodeSnippet';

export function SelfHostingLocalized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const P = mdx.p ?? 'p';
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
        <H1>Self-Hosting (Власне розміщення)</H1>
        <P>
          <strong>Quasar Community Edition</strong> — це версія Quasar під ліцензією Apache-2.0, опублікована в{' '}
          <A href="https://github.com/TuwaIO/quasar-community">TuwaIO/quasar-community</A> з Docker-образами на GHCR.
          Вона запускає те саме ядро відстеження транзакцій і той самий API, що й Quasar Cloud, але для одного
          оператора: дивіться <A href="/quasar#quasar-cloud-and-quasar-community">Quasar Cloud та Quasar Community</A>{' '}
          щодо відмінностей.
        </P>
        <P>Налаштування детально задокументовано в репозиторії; нижче наведено прямі посилання:</P>
        <Table>
          <thead>
            <Tr>
              <Th>Посібник</Th>
              <Th>Зміст</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>
                <A href="https://github.com/TuwaIO/quasar-community#readme">README</A>
              </Td>
              <Td>Що входить до редакції, структура монорепозиторію, швидкий старт за 5 хвилин та робочі ліміти.</Td>
            </Tr>
            <Tr>
              <Td>
                <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/QUICKSTART_LOCAL.md">
                  Локальний швидкий старт
                </A>
              </Td>
              <Td>Змінні оточення, профіль Docker Compose для однієї ноди, сідування бази та перший вхід.</Td>
            </Tr>
            <Tr>
              <Td>
                <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/PRODUCTION_DEPLOY.md">
                  Продакшн розгортання
                </A>
              </Td>
              <Td>
                Високонадійний профіль (HA): Postgres primary + standby, кластер Redis, PgBouncer, WAL-G, Traefik.
              </Td>
            </Tr>
            <Tr>
              <Td>
                <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/CICD_SETUP.md">Налаштування CI/CD</A>
              </Td>
              <Td>Розгортання вашого форку за допомогою вбудованого GitHub Actions workflow.</Td>
            </Tr>
            <Tr>
              <Td>
                <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/SEEDING.md">Сідування даних</A>
              </Td>
              <Td>Які сутності створює сідування та як перезапустити його для скидання чи тестів.</Td>
            </Tr>
          </tbody>
        </Table>
        <Callout type="info">
          Публічне прев&apos;ю на базі актуальної гілки доступне за адресою{' '}
          <A href="https://community-stg.tuwa.io">community-stg.tuwa.io</A>. Воно використовується виключно для
          демонстрації розробки і не є стабільним продакшн-сервісом.
        </Callout>
        <Hr />
        <H2 id="point-the-sdk-at-your-node">🔌 Спрямування SDK на вашу власну ноду</H2>
        <P>
          Увесь клієнтський та серверний код залишається незмінним: створіть додаток у панелі <Code>/admin</Code> вашої
          ноди, скопіюйте секретний ключ і передайте URL вашого API у конфігурацію:
        </P>
        <CodeSnippet index={0} />
        <P>
          Передайте цей самий URL у функцію <Code>preFlightTxCheck(url)</Code> з пакета{' '}
          <Code>@tuwaio/quasar-sdk/react</Code> у браузері, а також у релей вебхуків за допомогою команди{' '}
          <Code>npx @tuwaio/quasar-sdk listen --api-url &lt;url&gt;</Code> (або через змінну{' '}
          <Code>QUASAR_BASE_URL</Code> у <Code>.env</Code>).
        </P>
        <P>
          Щоб перенести організацію з Quasar Cloud разом із ключами, секретами вебхуків та історією транзакцій, дивіться{' '}
          <A href="/quasar/migrate-to-community">Перенесення з Quasar Cloud у Community Edition</A>.
        </P>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>Self-Hosting (私有化部署)</H1>
      <P>
        <strong>Quasar Community Edition</strong> 是基于 Apache-2.0 许可证开源的 Quasar 版本，代码发布在{' '}
        <A href="https://github.com/TuwaIO/quasar-community">TuwaIO/quasar-community</A>，并在 GHCR
        提供官方容器镜像。它运行与 Quasar Cloud 完全相同的链上追踪引擎和 API，专为单租户自建节点打造：详情参见{' '}
        <A href="/quasar#quasar-cloud-and-quasar-community">Quasar Cloud 与 Quasar Community 的区别</A>。
      </P>
      <P>详细的部署说明位于代码仓库中，核心指南如下：</P>
      <Table>
        <thead>
          <Tr>
            <Th>指南文档</Th>
            <Th>核心内容</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>
              <A href="https://github.com/TuwaIO/quasar-community#readme">README</A>
            </Td>
            <Td>社区版所含组件、仓库代码结构、5 分钟本地快速上手以及工作区配额设置。</Td>
          </Tr>
          <Tr>
            <Td>
              <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/QUICKSTART_LOCAL.md">本地快速启动</A>
            </Td>
            <Td>环境变量配置、单节点 Docker Compose 配置文件、初始数据填充 (Seed) 与首次管理员登录。</Td>
          </Tr>
          <Tr>
            <Td>
              <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/PRODUCTION_DEPLOY.md">
                生产级高可用部署
              </A>
            </Td>
            <Td>高可用架构：PostgreSQL 主从复制、Redis 哨兵/集群、PgBouncer、WAL-G 归档与 Traefik 反向代理。</Td>
          </Tr>
          <Tr>
            <Td>
              <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/CICD_SETUP.md">CI/CD 自动化部署</A>
            </Td>
            <Td>通过仓库自带的 GitHub Actions 流水线自动化构建与发布您的定制 Fork 镜像。</Td>
          </Tr>
          <Tr>
            <Td>
              <A href="https://github.com/TuwaIO/quasar-community/blob/main/docs/SEEDING.md">初始数据填充</A>
            </Td>
            <Td>种子数据脚本生成的资源明细以及在开发环境中重置和重新初始化的方法。</Td>
          </Tr>
        </tbody>
      </Table>
      <Callout type="info">
        基于最新开发分支构建的公开预览节点运行在 <A href="https://community-stg.tuwa.io">community-stg.tuwa.io</A>
        。此节点仅供开发预览体验，请勿在生产环境依赖。
      </Callout>
      <Hr />
      <H2 id="point-the-sdk-at-your-node">🔌 将 SDK 指向自建节点</H2>
      <P>
        应用程序代码完全无需改动：在节点的 <Code>/admin</Code> 控制面板中创建一个应用，复制其 Secret
        Key，并将自定义节点地址传入 SDK：
      </P>
      <CodeSnippet index={0} />
      <P>
        在前端浏览器中，向 <Code>@tuwaio/quasar-sdk/react</Code> 的 <Code>preFlightTxCheck(url)</Code>{' '}
        传入相同地址；在本地调试 Webhook 时，使用 <Code>npx @tuwaio/quasar-sdk listen --api-url &lt;url&gt;</Code>（或在{' '}
        <Code>.env</Code> 中指定 <Code>QUASAR_BASE_URL</Code>）。
      </P>
      <P>
        如需将云端组织的 API 密钥、Webhook 密钥及完整历史交易平滑迁移至自建节点，请参考{' '}
        <A href="/quasar/migrate-to-community">从 Quasar Cloud 迁移至社区版</A>。
      </P>
    </>
  );
}
