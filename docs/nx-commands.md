# `project.json` Defined Tasks

> EXAMPLE:
> `npx nx serve:static`

| Command        | Describe                                                                                     | Remark                                 |
| -------------- | -------------------------------------------------------------------------------------------- | -------------------------------------- |
| `serve`        | start `development`                                                                          |                                        |
| `serve:static` | build then start a local web server that serves the built solution from `./dist/my-book-fe/` | using `nx built-in`                    |
| `preview`      | same as `serve:static`                                                                       | but using `vite preview`               |
| `build`        | build for `production` (by default)                                                          |                                        |
| `test`         | run all tests (i.e. `.spec.tsx` files)                                                       |                                        |
| `sb`           | run `storybook` in `development mode`                                                        |                                        |
| `sb:build`     | build `storybook`                                                                            |                                        |
| `sb:static`    | build then serve web server of `storybook`                                                   | it run `dist/storybook/my-book-fe` dir |
| `lint`         | run `eslint`                                                                                 |                                        |
| `stories`      | add `*.stories.tsx` for each `*.tsx`                                                         |                                        |

# Code Generation

> EXAMPLE:
> `npx nx gen:cmp --name=my-awesome-component`

| Command             | Describe               |
| ------------------- | ---------------------- |
| `gen:cmp --name=`   | generate component     |
| `gen:slice --name=` | generate a redux slice |
| `gen:slice --name=` | generate a redux slice |
