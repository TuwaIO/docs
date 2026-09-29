# TUWA Docs

[![License](https://img.shields.io/github/license/TuwaIO/docs.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/docs/release.yml?branch=main)](https://github.com/TuwaIO/docs/actions)

**TUWA Docs** is the documentation gateway of the TUWA ecosystem: the [docs hub](https://docs.tuwa.io), where every TUWA project starts and where the guides that combine several projects live, and `@tuwaio/docs-ui`, the shared UI of all TUWA documentation sites.

📖 **Docs hub:** [docs.tuwa.io](https://docs.tuwa.io)

---

## 🏛️ Place in the TUWA Documentation

TUWA documents each kind of content in one place:

| Site                                                                                                                                                                                                                                                         | Content                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **[docs.tuwa.io](https://docs.tuwa.io)** (this repository)                                                                                                                                                                                                   | The ecosystem map with a card for every project, and the guides: architecture deep dives and step-by-step setups that combine several projects |
| [orbit.docs.tuwa.io](https://orbit.docs.tuwa.io), [siwx.docs.tuwa.io](https://siwx.docs.tuwa.io), [satellite.docs.tuwa.io](https://satellite.docs.tuwa.io), [pulsar.docs.tuwa.io](https://pulsar.docs.tuwa.io), [sdk.docs.tuwa.io](https://sdk.docs.tuwa.io) | One project each: an Introduction, the package READMEs and a reference of every export generated from the source                               |
| [stories.tuwa.io](https://stories.tuwa.io)                                                                                                                                                                                                                   | Nova UI Kit: the components, theming and the package reference in Storybook                                                                    |

A guide that needs only one package belongs on the site of that package; a guide that combines several projects belongs here.

---

## 🔧 Monorepo Structure

```
docs/
├── apps/
│   └── docs-hub/               # docs.tuwa.io (Next.js 16 + Nextra 4)
│       ├── src/app/            # Main screen (React) and the /guides route (Nextra)
│       ├── src/components/     # Main screen: hero, layer timeline, quick start
│       └── src/content/guides/ # The guides (MDX)
└── packages/
    └── docs-ui/                # @tuwaio/docs-ui: navbar, footer, logo, theme switch, stylesheet
```

- **[`apps/docs-hub`](./apps/docs-hub)**: the hub. See its [README](./apps/docs-hub/README.md) for local development and for adding a project or a guide.
- **[`@tuwaio/docs-ui`](./packages/docs-ui)**: published to npm and used by every TUWA documentation site, the hub, the landing page and the Quasar dashboards. Peer dependencies: `react`, `next`, `nextra-theme-docs`, `@heroicons/react`.

---

## 🛠️ Development

```bash
pnpm install     # installs dependencies and builds @tuwaio/docs-ui
pnpm build       # builds @tuwaio/docs-ui with tsup and PostCSS
pnpm lint        # runs ESLint
pnpm format      # runs Prettier
pnpm dev:hub     # runs the docs hub on http://localhost:3000
pnpm build:hub   # builds the docs hub and its Pagefind search index
```

The hub uses the local `@tuwaio/docs-ui` (`workspace:*`); the other TUWA sites use the version published to npm.

---

## 🤝 Contribution & Auditing

Please review our ecosystem **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
