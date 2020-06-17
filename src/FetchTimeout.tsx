import {url, options} from './Setting'
let urlAjax = url;
let optionsAjax = options;
export default function (timeout = 30000) {
    return Promise.race([
        fetch(urlAjax, optionsAjax)
        .then()
        .then(),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}