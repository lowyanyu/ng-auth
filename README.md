# NgAuth

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.16.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Installation
```sh
$ npm install @cg/ng-auth
```

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
```sh
$ ng build ng-auth
```

## Publishing

1.  修改 `ng-auth\projects\ng-auth\package.json` 中的版本號 `version`(下一個版本號，給使用lib的人看的) 
2.  執行指令，npm給project下版本號並壓上tag  
```sh
$ npm version [major|minor|patch]
```
3.  包版
```sh
$ npm run package
```
4.  發佈
```sh
$ npm publish dist/ng-auth
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
