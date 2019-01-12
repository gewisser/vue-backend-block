// Created by Gavrilow Roman on 07.01.2019.


var loaderUtils = require("loader-utils");
var path = require('path');

const id = 'gavrilow_backend_plugin';

exports.default = function (source) {
    this.cacheable();

    // Отправляем данные далее следующему загрузчику
    // ВАЖНО!!! Отправляем пустую строку, иначе все что отправим попадет в конечную сбрку
    this.async()(null, '');

    // Удаляем все переносы строк. Их очень много.
    const _source = source.replace(/^\n/img, '');

    // Путь к файлу в котором содержится Custom Block [blockType=backend]
    const file_path = this.resourcePath;


    // this._compiler - глобальный объект, который доступен из плагина
    if (this._compiler[id] === undefined)
        this._compiler[id] = {
            change: true,
            arr: []
        };


    var fp_exists = false;

    // Перебираем массив и ищем ранее добавленный код из Custom Blocks vue
    // Идентификатор блока - полный путь файлу.
    for (let i = this._compiler[id].arr.length - 1; i >= 0; i--) {
        if (this._compiler[id].arr[i].file_path === file_path) {
            fp_exists = true;


            // если нашли, то сравним с прошлой версией.
            if (this._compiler[id].arr[i].data !== _source) {
                // если есть изменения то сохраяем исменения в объект и для палагина выставляем флаг, что были изменения
                this._compiler[id].arr[i].data = _source;
                this._compiler[id].change = true;
            }

            break;
        }
    }


    if (fp_exists) return; // Если выше был заход в первое условие в цикле, то выходим

    // Добавлеме новый объект в массив, содержащий тест Custom Blocks и полный поуть к файлу
    // и сигнализируем флагом [ change = true ] для плагина что есть изменения.
    this._compiler[id].change = true;
    this._compiler[id].arr.push({
        file_path: file_path,
        data: _source
    });
};