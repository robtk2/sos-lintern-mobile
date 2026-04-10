# Contributing to SOS Lintern

First off, thank you for considering contributing to SOS Lintern! It's people like you that make SOS Lintern such a great tool.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.

## How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker to report bugs.
- Describe the step-by-step process of how to reproduce the bug.

### Suggesting Enhancements

- Use the GitHub issue tracker to suggest enhancements.
- Explain why this enhancement would be useful.

### Pull Requests

1.  **Fork the repository**.
2.  **Create a new branch** (`git checkout -b feature/amazing-feature`).
3.  **Follow the style guidelines**:
    - Use ESLint and Prettier for code formatting.
    - Follow the Atomic Design and Hexagonal Architecture patterns already established.
4.  **Testing**:
    - All logic changes MUST include unit tests.
    - Global coverage must NOT drop below **90%**.
    - Run `npm run test:coverage` to verify.
5.  **Commit Messages**:
    - We follow [Conventional Commits](https://www.conventionalcommits.org/).
    - Example: `feat: add gyroscope based emergency trigger` or `fix: sound race condition`.
6.  **Submit the PR**:
    - Link related issues.
    - Provide a description of the changes.

## Development Setup

1.  Clone your fork.
2.  Install dependencies: `npm install --legacy-peer-deps`.
3.  Start the development server: `npx expo start`.

## Our Quality Standard

We take pride in our **96% test coverage**. Any contribution that significantly reduces this coverage without a valid architectural reason may be rejected or require additional tests.

---

# Contribuyendo a SOS Lintern (Español)

¡Gracias por considerar contribuir a SOS Lintern!

## Estándares de Código

- **Arquitectura**: Mantener el patrón Hexagonal (Servicios desacoplados) y Diseño Atómico.
- **Testing**: Es obligatorio incluir tests para cualquier nueva funcionalidad. La cobertura global no debe bajar del **90%**.
- **Commits**: Seguir la convención de `feat:`, `fix:`, `docs:`, `refactor:`.

---

Happy Coding! 🔦🚀
