# Steps[^1]

> NOTE:
> Due to this project is a **standalone**, so running nx without specify project will always have `my-book-fe` as the default project name. As declared in the `nx.json` file at `"defaultProject": "my-book-fe"`.

> NOTE:
> Most of the generation commands are defined in [`project.json`](../project.json), and documented in [`nx commands doc`](./nx-commands.md).

1. Use the `npx create-nx-workspace my-book-fe` command, with terminal run options:
   - `preset`: react-standalone
   - `framework`: react
   - `bundler`: vite
   - `default stylesheet`: css
   - `enable distributed caching`: yes
2. Add a **Component**: Run `npx nx generate component --directory=app/components {component-name}`.
3. Add **StoryBook**.
   - Install `@nx/storybook` as a **DEV dependency**.
   - Setup by run `npx nx generate @nx/react:storybook-configuration --tsConfiguration=true`.
   - Run `npx nx generate stories` to add `*.stories.tsx` files for each `*.tsx` files, accordingly.
4. Add **TailwindCSS**. Run `npx nx generate setup-tailwind`
5. Add **Redux**.
   - Add `@reduxjs/toolkit` `react-redux` as **dependencies**.
   - Run `npx nx generate slice --directory=stores/{slice-name} {slice-name}` to add a redux slice.
6. Add **React Router**.
   - Add `react-router-dom` as a **dependency**.
   - Run `npx nx generate component --directory=app/pages {module-name}`.
     > NOTE:
     > There are no **NX** built-in code generation commands, so we use `generate component instead.

---

[^1]: https://nx.dev/packages/react/generators
