# acfunlive-toolbox-client

**工具箱 1.x 已停止维护。**

**2.x 仓库：** <https://github.com/ACFUN-FOSS/acfun-live-toolbox-MKII>

## 停止维护说明
本次停止维护没有缓冲期。

1.x 因依赖库老旧、构建过程杂乱，除某人外没有任何其他人能够安装编译运行，导致项目难以继续开发。再者，因为某人不小心把私人数据 push 上去了，造成一个仓库分裂成两个，一个供内部使用，一个供非组织的成员使用，使社区内外隔阂加深，还让仓库维护变得复杂而且公开仓库经常落后于私有仓库。因为以上种种烂摊子，我们决定更换项目工具链并创立新的仓库，直接开始 2.x 版本的开发。

------------

![location](./readme_start_work.jpg)
![location](./readme_acfunlogo.svg)
![location](./readme_agpllogo1.png)
![location](./readme_agpllogo2.svg)

## WHAT IS THIS?
This is a part of AcFun-livetoolbox project.
![location](./readme_location.svg)

## Proj dir struct
- *src/electron_browser*: User interface code, vue code, code that running in electron as a webpage here.  
- *src/electron_nodejs*: Electron main process code, code that calling nodejs and electron directly, code that on the same layer as electron here.
- *src/tests/unit*: Code for unit-testing
- *src/tests/e2e*: Code for blackbox-testing

## Proj setup
```
npm install
```

### Compiles and hot-reloads for dev(without electron)
```
npm run serve
```

### Compiles and hot-reloads for dev(with electron)
```
npm run electron:serve
```

### Compiles for production
```
npm run electron:build
```
ps: build archive will put in dir *BUILD*.

### Run the unit tests
```
npm run test:unit
```

### Run the end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint --fix
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
