# TUWA Documentation Infrastructure

This repository serves as the central hub for the documentation infrastructure of the [TUWA Ecosystem](https://github.com/TuwaIO). It houses the shared UI libraries, themes, and configurations used to maintain a consistent visual identity across all our projects.

**Publicly available, but primarily designed for internal TUWA ecosystem coherence.**

## 📦 Workspace Structure

This is a monorepo managed by `pnpm`.

* **`packages/docs-ui`**: A shared library containing:
* Custom Nextra theme configurations.
* Reusable React components.
* Shared Tailwind CSS design tokens.

## 🎯 Purpose

The goal of this repository is to adhere to the **DRY (Don't Repeat Yourself)** principle. Instead of duplicating styles and components across `orbit`, `satellite`, and `pulsar` documentation sites, we consume them from this single source of truth.

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.