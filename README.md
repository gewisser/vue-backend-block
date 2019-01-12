# vue-backend-block

> webpack loader and plugin for Vue Single-File Components use Custom Blocks as backend part

## What is vue-backend-block?

`vue-backend-block` is a loader and plugin that allows you to embed part of your backend logically connected to the single-file component in a separate block. Learn more about [custom blocks](https://vue-loader.vuejs.org/guide/custom-blocks.html).

## Installing vue-backend-block:

```

npm i vue-backend-block

```
---
 > ### Webpack plugin configuration

- import plugin:
``` javascript
const vue_backend_block = require("vue-backend-block/plugin.js");
```
- configure plugin:
``` javascript
plugins: [
    new vue_backend_block ({
        backend_template:   path.join(__dirname, "web_server_template.js"),
        backend_output:     path.join(__dirname, "services", "web_server.js"),
    }),
]
```

| options name | type          | default              |  example                                   |  description|
| --------------- |---------------|----------------------|--------------------------|------------------|
| **backend_template**| string  | -  | './web_server_template.js' | Backend pattern path |
| **backend_output**| string| - | './web_server.js'|Assembled backend from custom block .vue |

---

 > ### Webpack loader configuration
``` javascript
rules: [
    {
        resourceQuery: /blockType=backend/,
        loader: 'vue-backend-block'
    },
],
```

where `blockType=backend` - **backend** name of your custom block

---
 > ### What does the template contain ([_backend_template_] option)

 - Sample template:

``` javascript
const WEB_PORT = 314;

const Koa = require('koa');
var Router = require('koa-router');

const app = new Koa();
var router = new Router();

app
    .use(router.routes())
    .use(router.allowedMethods());

const body = require('koa-json-body')({ limit: '10kb' });

app.listen(WEB_PORT);

app.context.db = require('../lib/db.js');
/*{{endpoints}}*/
```
All parts from Custom Blocks will be inserted instead of:  `/*{{endpoints}}*/ `

---
 > ### Sample content of the single-file component vuejs
``` vue
<template>

</template>

<script>
    export default {
        name: 'example',
        data() {
            return {
            }
        },
        methods:{
        }
    }
</script>

<style>
</style>

<backend>
    router
        .post('/reg/', body, async (ctx, next) => {
            try {
                let r = ctx.request.body;

                console.log(ctx.request.body.name);
                await ctx.db.getConnection();
                ctx.body = await ctx.db.db_query(`CALL users_reg('${r.name}', '${r.last_name}', '${r.mail}', '${r.pass}')`);
            } catch (err) {
                throw err;
            } finally {
                await ctx.db.end();
            }
        });
</backend>
```
## Syntax Highlight in Custom Blocks for PhpStorm Editor
By default, syntax highlighting in Custom Blocks in PhpShtorm does not work. In order for everything to work, you need to do the following:

> **File** -> **Settings** -> In the search box, type: **injections**

![image](https://user-images.githubusercontent.com/5417292/51075288-885bc100-169a-11e9-901e-a306d89aa9c8.png)

> Add new
Specify **ID** and **local name**

![image](https://user-images.githubusercontent.com/5417292/51075311-c8bb3f00-169a-11e9-97bb-abd9c5c541b8.png)

> After these settings you should have something similar.

![image](https://user-images.githubusercontent.com/5417292/51075344-38312e80-169b-11e9-8d7b-f2e5328b4472.png)



