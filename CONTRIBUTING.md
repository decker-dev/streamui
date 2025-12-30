# Contributing

Thanks for your interest in contributing to streamui. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

If you need any help, feel free to open an issue.

## About this repository

This is a monorepo managed with pnpm workspaces and Turborepo.

We use pnpm for package management.
We use Biome for linting and formatting.
We use the shadcn registry system for component distribution.

## Structure

This repository is structured as follows:

```
streamui/
├── apps/
│   └── web/              # Documentation site & registry
│       ├── content/docs/ # Documentation in MDX
│       ├── public/r/     # Generated registry JSON files
│       └── src/
│           ├── app/
│           ├── components/
│           └── registry/stream/
└── packages/
    └── react/            # @stream.ui/react package
        └── src/
```

| Path | Description |
|------|-------------|
| `apps/web/` | The Next.js documentation site and component registry. |
| `apps/web/src/registry/stream/` | The registry for streaming components. |
| `apps/web/content/docs/` | The documentation content in MDX. |
| `packages/react/` | The `@stream.ui/react` npm package with primitives. |

## Development

### Fork this repo

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/your-username/streamui.git
```

### Navigate to project directory

```bash
cd streamui
```

### Create a new Branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

## Documentation

The documentation for this project is located in `apps/web/content/docs`. Documentation is written using MDX.

## Components

We use a registry system for developing components. You can find the source code for the components under `apps/web/src/registry`. The components are organized by type.

```
apps/web/src/registry/
└── stream/
    ├── streaming-text.tsx
    ├── streaming-text-schema.ts
    └── streaming-text-demo.tsx
```

When adding or modifying components, please ensure that:

1. You update the documentation in `apps/web/content/docs/`.
2. You run `pnpm build` to update the registry.

## Commit Convention

Before you create a Pull Request, please check whether your commits comply with the commit conventions used in this repository.

When you create a commit we kindly ask you to follow the convention `category(scope or module): message` in your commit message while using one of the following categories:

- `feat / feature`: all changes that introduce completely new code or new features
- `fix`: changes that fix a bug (ideally you will additionally reference an issue if present)
- `refactor`: any code related change that is not a fix nor a feature
- `docs`: changing existing or creating new documentation (i.e. README, docs for usage of a lib or cli usage)
- `build`: all changes regarding the build of the software, changes to dependencies or the addition of new dependencies
- `test`: all changes regarding tests (adding new tests or changing existing ones)
- `ci`: all changes regarding the configuration of continuous integration (i.e. github actions, ci system)
- `chore`: all changes to the repository that do not fit into any of the above categories

e.g. `feat(components): add new streaming stock-ticker component`

If you are interested in the detailed specification you can visit [Conventional Commits](https://www.conventionalcommits.org/) or check out the [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines).

## Requests for new components

If you have a request for a new component, please open a discussion on GitHub. We'll be happy to help you out.

## Linting

We use Biome for linting and formatting. You can run the linter with:

```bash
pnpm lint
```

And format your code with:

```bash
pnpm format
```

Please ensure that the linting passes when submitting a pull request.

