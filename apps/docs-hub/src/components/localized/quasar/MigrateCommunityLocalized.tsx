'use client';

import { Callout } from 'nextra/components';

import type { Locale } from '@/i18n';
import { useMDXComponents } from '@/mdx-components';

export function MigrateCommunityLocalized({ locale }: { locale: Locale }) {
  const mdx = useMDXComponents();
  const H1 = mdx.h1 ?? 'h1';
  const H2 = mdx.h2 ?? 'h2';
  const P = mdx.p ?? 'p';
  const Ol = mdx.ol ?? 'ol';
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
        <H1>Перенесення з Quasar Cloud у Community Edition</H1>
        <P>
          Організація переноситься з хмари Quasar Cloud на вашу власну{' '}
          <A href="/quasar/self-hosting">ноду Community Edition</A> у вигляді одного зашифрованого архіву. Усі додатки
          зберігають свої API-ключі, а ендпоінти вебхуків — секрети підпису HMAC, тому вам знадобиться лише змінити
          базовий URL у додатках, а приймачі вебхуків працюватимуть взагалі без змін.
        </P>
        <Table>
          <thead>
            <Tr>
              <Th>Переноситься на вашу ноду</Th>
              <Th>Залишається в Quasar Cloud</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Організація (з лімітами вашої ноди; адміністратор ноди стає її єдиним власником)</Td>
              <Td>Облікові записи учасників та способи входу (нода має одного адміністратора)</Td>
            </Tr>
            <Tr>
              <Td>
                Додатки: API-ключі, IP/доменні білі списки, RPC-налаштування, ключі Alchemy/QuickNode/Gelato/Pimlico
              </Td>
              <Td>Історія білінгу, витрати квот та баланси</Td>
            </Tr>
            <Tr>
              <Td>Ендпоінти вебхуків разом із їхніми секретами підпису</Td>
              <Td>Системні вебхуки Quasar Cloud</Td>
            </Tr>
            <Tr>
              <Td>Усі історичні транзакції разом із результатами перевірок AML</Td>
              <Td />
            </Tr>
            <Tr>
              <Td>Журнали доставок вебхуків за останні 30 днів</Td>
              <Td />
            </Tr>
            <Tr>
              <Td>Записи додатку Payments: налаштування прийому платежів та інвойси</Td>
              <Td />
            </Tr>
          </tbody>
        </Table>
        <Hr />
        <H2 id="export-the-organization">📦 Експорт організації</H2>
        <P>
          Виконувати експорт може лише <strong>власник (Owner)</strong> організації. У{' '}
          <A href="https://quasar.tuwa.io">панелі керування Quasar</A> перейдіть на сторінку організації, оберіть{' '}
          <strong>Export Organization</strong> і підтвердіть дію введенням пароля (та коду 2FA, якщо він активний).
        </P>
        <P>
          Далі система згенерує та покаже <strong>ключ імпорту</strong> (<Code>QEX1-…</Code>). Він не зберігається на
          серверах: обов&apos;язково скопіюйте його перед завантаженням файлу. Посилання на завантаження дійсне
          одноразово протягом 10 хвилин. Усі співвласники організації отримують сповіщення на електронну пошту.
        </P>
        <Callout type="warning">
          Файл <Code>.qex</Code> надійно зашифровано ключем імпорту за алгоритмом AES-256-GCM, оскільки він містить усі
          секрети організації. Зберігайте завантажений архів і ключ окремо в надійних сховищах.
        </Callout>
        <Hr />
        <H2 id="import-it-into-your-node">📥 Імпорт у вашу власну ноду</H2>
        <P>
          Потрібна версія Community Edition <strong>0.2</strong> або новіша. Увійдіть у панель <Code>/admin</Code> вашої
          ноди та оберіть <strong>Import data from Quasar Cloud</strong>:
        </P>
        <Ol>
          <Li>
            Виберіть файл архіву <Code>.qex</Code> та введіть ключ імпорту (регістр літер та пробіли не мають значення).
          </Li>
          <Li>
            <strong>Аналіз файлу:</strong> нода розшифрує та проаналізує дані й покаже детальний список того, що буде
            створено, оновлено або пропущено, до того, як почнеться запис у базу даних.
          </Li>
          <Li>
            Підтвердіть дію паролем адміністратора і розпочніть імпорт. Панель відображатиме прогрес у реальному часі.
          </Li>
        </Ol>
        <P>
          Нода перешифровує всі секретні ключі власним майстер-ключем <Code>ENCRYPTION_KEY</Code>. Транзакції, що
          перебували в процесі підтвердження, автоматично підхоплюються трекерами вашої ноди.
        </P>
        <P>Що нода може пропустити та про що повідомить у звіті:</P>
        <Ol>
          <Li>
            <strong>RPC-адреси, відхилені політикою мережі:</strong> наприклад, приватні або заборонені IP-адреси.
          </Li>
          <Li>
            <strong>Небезпечні ендпоінти вебхуків:</strong> незахищений протокол HTTP у продакшн-режимі або дубльовані
            ендпоінти на <Code>localhost</Code>.
          </Li>
        </Ol>
        <Hr />
        <H2 id="switch-over">🔁 Безшовне перемикання трафіку</H2>
        <Ol>
          <Li>Виконайте перший імпорт організації у вашу ноду.</Li>
          <Li>
            Спрямуйте клієнтські та бекенд-додатки на нову ноду: оновіть <Code>baseUrl</Code> у{' '}
            <Code>@tuwaio/quasar-sdk</Code>, адресу в <Code>preFlightTxCheck</Code> та прапорець <Code>--api-url</Code>{' '}
            у релеї вебхуків. Секретні ключі додатків залишаються тими самими.
          </Li>
          <Li>
            <strong>Повторний дельта-експорт:</strong> виконайте ще один експорт та імпорт. Він перенесе транзакції, що
            були створені між першим імпортом і перемиканням. Імпорт є цілком ідемпотентним і не затирає налаштування,
            змінені на вашій ноді.
          </Li>
          <Li>Деактивуйте або видаліть додатки в Quasar Cloud після повної стабілізації.</Li>
        </Ol>
        <Hr />
        <H2 id="when-the-import-stops">🧯 Діагностика помилок імпорту</H2>
        <Table>
          <thead>
            <Tr>
              <Th>Повідомлення про помилку</Th>
              <Th>Спосіб вирішення</Th>
            </Tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Ключ імпорту не відповідає експорту</Td>
              <Td>Перевірте ключ. Кожен експортний файл розшифровується лише своїм унікальним ключем.</Td>
            </Tr>
            <Tr>
              <Td>Архів пошкоджено або він неповний</Td>
              <Td>Завантажте експорт повторно: файл міг бути перерваний під час завантаження через мережу.</Td>
            </Tr>
            <Tr>
              <Td>Цей експорт використовує новішу версію формату</Td>
              <Td>Оновіть версію Quasar Community Edition на вашому сервері до актуальної та повторіть імпорт.</Td>
            </Tr>
            <Tr>
              <Td>Конфлікт даних із наявними записами на ноді</Td>
              <Td>Ключ або вебхук належить іншому додатку вашої ноди. Жодних змін у базу внесено не було.</Td>
            </Tr>
            <Tr>
              <Td>Розмір файлу перевищує ліміт проксі</Td>
              <Td>Збільште ліміт client_max_body_size у вашому Nginx/Traefik або Cloudflare (до 100 MB).</Td>
            </Tr>
          </tbody>
        </Table>
      </>
    );
  }

  // zh-CN
  return (
    <>
      <H1>从 Quasar Cloud 迁移至社区版 (Migrate to Community)</H1>
      <P>
        您可以将云端组织完整打包为一个加密归档，并一键导入至您的{' '}
        <A href="/quasar/self-hosting">自建 Quasar Community Edition 节点</A>。所有应用完整保留原有的 API 凭据，所有
        Webhook 节点保留原有 HMAC 验签私钥。您只需更新客户端指向的 API 域名，所有的 Webhook 接收端逻辑完全零改造。
      </P>
      <Table>
        <thead>
          <Tr>
            <Th>平滑迁移至自建节点</Th>
            <Th>保留在 Quasar Cloud 托管端</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>组织整体配置（适配自建节点的无限配额；自建节点超级管理员成为唯一所有者）</Td>
            <Td>组织成员列表与个人登录凭据（自建版为极简单管理员模型）</Td>
          </Tr>
          <Tr>
            <Td>应用集群：API Key、IP/域名白名单、RPC 自定义覆盖、Alchemy/QuickNode/Gelato/Pimlico 密钥</Td>
            <Td>云端计费历史、余额账单及扣费审计流水</Td>
          </Tr>
          <Tr>
            <Td>全部 Webhook 订阅节点及其加密的 HMAC 验签私钥</Td>
            <Td>Quasar Cloud 专有系统级 Webhook</Td>
          </Tr>
          <Tr>
            <Td>全量链上历史交易明细，包含反洗钱 (AML) 筛查快照</Td>
            <Td />
          </Tr>
          <Tr>
            <Td>近 30 天内的 Webhook 历史投递与重试执行日志</Td>
            <Td />
          </Tr>
          <Tr>
            <Td>Payments 应用关联数据：已支持的加密货币收款通道及发票明细</Td>
            <Td />
          </Tr>
        </tbody>
      </Table>
      <Hr />
      <H2 id="export-the-organization">📦 导出组织数据</H2>
      <P>
        仅组织的 <strong>所有者 (Owner)</strong> 具备导出权限。登录{' '}
        <A href="https://quasar.tuwa.io">Quasar 开发者控制台</A>，进入组织管理页面，选择{' '}
        <strong>Export Organization</strong> 并输入登录密码（若开启 2FA 则需输入两步验证码）进行安全确认。
      </P>
      <P>
        系统将仅在界面上展示一次 <strong>导入解密密钥 (Import Key)</strong>（前缀为 <Code>QEX1-…</Code>
        ）。该密钥服务端不存根，请务必在点击下载前复制保存。下载链接有效期为 10 分钟；出于防数据遍历安全策略，每个组织每
        10 分钟仅允许发起一次导出。组织所有者将收到导出通知邮件。
      </P>
      <Callout type="warning">
        生成的 <Code>.qex</Code> 文件采用 AES-256-GCM 高强度加密，内部包含组织所有的核心密钥和敏感配置。请将{' '}
        <Code>.qex</Code> 文件与解密密钥严格物理隔离存放。
      </Callout>
      <Hr />
      <H2 id="import-it-into-your-node">📥 导入自建社区版节点</H2>
      <P>
        请确保您的自建社区版运行版本不低于 <strong>0.2</strong>。登录私有节点的 <Code>/admin</Code> 控制面板，在首页点击{' '}
        <strong>Import data from Quasar Cloud</strong>：
      </P>
      <Ol>
        <Li>
          选择本地的 <Code>.qex</Code> 加密文件并填入导入密钥（大小写不敏感，支持包含空格）。
        </Li>
        <Li>
          <strong>安全解析与预检 (Analyze)：</strong>
          节点将在写入数据库之前完整解密并核对依赖，逐项列出即将新增、更新或跳过的资源项。
        </Li>
        <Li>输入管理员密码确认授权，点击开始导入。控制台将实时输出导入流水与执行审计报告。</Li>
      </Ol>
      <P>
        节点将自动使用私有节点的 <Code>ENCRYPTION_KEY</Code> 重新对所有敏感密钥进行加密固化。迁移时仍处于 Pending
        状态的交易将被私有节点的追踪引擎平滑接管。
      </P>
      <P>节点预检将自动拦截并报告以下不合规项：</P>
      <Ol>
        <Li>
          <strong>不符合节点外发网络策略的 RPC 节点：</strong>如私有网段或未授权的回环地址。
        </Li>
        <Li>
          <strong>生产环境下不合规的 Webhook：</strong>如生产模式下的明文 HTTP 链接或超出限制的重复 localhost 节点。
        </Li>
      </Ol>
      <Hr />
      <H2 id="switch-over">🔁 生产流量平滑割接</H2>
      <Ol>
        <Li>首次将组织数据完整导入至自建节点。</Li>
        <Li>
          将前端与后端应用的请求地址指向自建节点：更新 <Code>@tuwaio/quasar-sdk</Code> 的 <Code>baseUrl</Code>、前端{' '}
          <Code>preFlightTxCheck</Code> 的探测域名以及 CLI 的 <Code>--api-url</Code> 转发参数。所有应用的 Secret Key
          保持原样不变。
        </Li>
        <Li>
          <strong>执行增量二次同步：</strong>
          进行第二次导出与导入。二次导入具备严格幂等性，仅补充割接期间产生的增量交易并同步终态，绝不覆盖您在自建节点上手动修改的应用配置。
        </Li>
        <Li>确认运行平稳后，在 Quasar Cloud 上停用或注销云端旧组织。</Li>
      </Ol>
      <Hr />
      <H2 id="when-the-import-stops">🧯 导入异常故障排查</H2>
      <Table>
        <thead>
          <Tr>
            <Th>异常提示信息</Th>
            <Th>排查定位与解决方式</Th>
          </Tr>
        </thead>
        <tbody>
          <Tr>
            <Td>The import key does not match this export</Td>
            <Td>解密密钥不匹配。请确认输入的 Key 属于当前下载的 .qex 归档文件。</Td>
          </Tr>
          <Tr>
            <Td>The export is damaged or incomplete</Td>
            <Td>文件损坏或网络传输不完整。请重新从云端发起导出并下载完整文件。</Td>
          </Tr>
          <Tr>
            <Td>This export uses a newer format version</Td>
            <Td>归档版本高于当前节点。请拉取最新的 Quasar Community Edition Docker 镜像升级后再试。</Td>
          </Tr>
          <Tr>
            <Td>The export collides with data on this node</Td>
            <Td>归档中的应用、密钥或 Endpoint 与节点上其他组织发生冲突。预检已中止，无数据写入。</Td>
          </Tr>
          <Tr>
            <Td>The file is larger than the proxy allows</Td>
            <Td>反向代理拦截了大请求体。请调整 Nginx/Traefik 或 CDN 的 client_max_body_size 上限。</Td>
          </Tr>
        </tbody>
      </Table>
    </>
  );
}
