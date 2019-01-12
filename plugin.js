const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

var footer_header_template;

class gavrilow_backend_plugin {
    constructor(options) {
        this.options = options;
        this.logMess = '';
    }

    endLog(){
               this.logMess = '------ gavrilow-backend-plugin ------------------------------------------------------------------\n'
            +this.logMess;
        this.addLogMess('-------------------------------------------------------------------------------------------------');
        console.log(this.logMess);
        this.logMess = '';
    }

    addLogMess(mess){
        this.logMess += mess+'\n';
    }

    async prepareTemplate(){
        try {
            if (footer_header_template === undefined) {
                let contents = await readFile(this.options.backend_template, "utf-8");
                footer_header_template = contents.split(/^\/\*+?{{.*endpoints.*}}+?\*\/$/img);
                if (footer_header_template.length !== 2) {
                    footer_header_template = undefined;
                    this.addLogMess('Не удалось найти точку вставки блоков.');
                    this.endLog();
                    return false;
                } else return true;
            } else return true;
        } catch (err) {
            footer_header_template = undefined;
            throw err;
        }
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync(
            'gavrilow_backend_plugin',
            (compilation, callback) => {
                callback();

                if (this.options.backend_template === undefined || this.options.backend_template === '') {
                    this.addLogMess('Необходимо создать и/или указать файл-шаблон для бэкэнда...');
                    this.endLog();
                    return;
                }

                if (this.options.backend_output === undefined || this.options.backend_output === '') {
                    this.addLogMess('Необходимо указать путь и имя js файла для бэкэнда...');
                    this.endLog();
                    return;
                }

                if (!compiler.gavrilow_backend_plugin) {
                    this.addLogMess('В Вашем проекте нет ни одной секции для бекенда [ <backend>...</backend> ].');
                    this.endLog();
                    return;
                }




                (async ()=>{
                    try {
                        if (!await this.prepareTemplate())
                            return;


                        if (!compiler.gavrilow_backend_plugin.change) return; // Если ничего для бэка не поменялось

                        compiler.gavrilow_backend_plugin.change = false;

                        if (compiler.gavrilow_backend_plugin.arr.length === 0) {
                            this.addLogMess('По какой-то причине нет данных из секции [ <backend>...</backend> ]');
                            this.endLog();
                            return;
                        }


                        this.addLogMess('Собираем beckend: "'+this.options.backend_output+'"\n...');

                        var backend_js = footer_header_template[0]+"\n";

                        for (let i = 0; i < compiler.gavrilow_backend_plugin.arr.length; i++) {
                            backend_js +=compiler.gavrilow_backend_plugin.arr[i].data+"\n";

                            this.addLogMess('['+compiler.gavrilow_backend_plugin.arr[i].file_path+']');
                        }

                        backend_js += footer_header_template[1];


                        await writeFile(this.options.backend_output, backend_js);

                    } catch (err) {
                        throw err;
                    } finally {
                        this.endLog();
                    }
                })();

            }
        );
    }
}

gavrilow_backend_plugin.loader = require.resolve('./loader');

module.exports = gavrilow_backend_plugin;

