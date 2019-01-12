// Created by Gavrilow Roman on 07.01.2019.


var loaderUtils = require("loader-utils");
var path = require('path');

const id = 'gavrilow_backend_plugin';

exports.default = function (source) {
    this.cacheable();

    var callback = this.async();
    callback(null, '');


    const _source = source.replace(/^\n/img, '');

    //const options = loaderUtils.getOptions(this);
    const file_path = this.resourcePath;


    // Write the path and name of the script into an array ...
    if (this._compiler[id] === undefined)
        this._compiler[id] = {
            change: true,
            arr: []
        };


    var fp_exists = false;

    for (let i = this._compiler[id].arr.length - 1; i >= 0; i--) {
        if (this._compiler[id].arr[i].file_path === file_path) {
            fp_exists = true;

            if (this._compiler[id].arr[i].data !== _source) {
                this._compiler[id].arr[i].data = _source;
                this._compiler[id].change = true;
            }

            break;
        }
    }


    if (fp_exists) return;

    this._compiler[id].change = true;
    this._compiler[id].arr.push({
        file_path: file_path,
        data: _source
    });
};