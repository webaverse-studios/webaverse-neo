# Architecture

## Table of Contents

- [Overview](#overview)
- [Packages](#packages)
- [Workspaces](#workspaces)


## Overview

This project is a monorepo containing multiple packages which comprise the
Webaverse backend.


## Packages

This project contains the following packages:

- [`@webaverse-studios/backend-gun`][0]: A [GunDB][2] server.
- [`@webaverse-studios/backend-feathers`][1]: A [Feathers][3] server.


## Workspaces

This project uses [Yarn workspaces][4]. Each package is located in the
`packages/` directory.

Commands are run from the root of the project. Workspace packages are
normally run as such:

```sh
yarn workspace <workspace> <command>
```

However, each package has a corresponding alias in the scripts section of the
root `package.json` file.

For example, to add a dependency to the `@webaverse-studios/backend-gun`
package, you can run:

```sh
yarn gun add <package>
```

which aliases to:

```sh
yarn workspace @webaverse-studios/backend-gun add <package>
```

[0]: packages/backend/gun/README.md "@webaverse-studios/backend-gun"
[1]: packages/backend/feathers/README.md "@webaverse-studios/backend-feathers"
[2]: https://gun.eco/ "GunDB"
[3]: https://feathersjs.com/ "Feathers"
[4]: https://yarnpkg.com/lang/en/docs/workspaces/ "Yarn Workspaces"
