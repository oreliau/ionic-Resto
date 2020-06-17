// import React from 'react';

export const resto = localStorage.getItem('loged');
export const options = {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',        
    },
    body: `nomResto=${resto}`
}
export const nomComplet = localStorage.getItem('resto');
export const mac = localStorage.getItem('mac');
export const url = "https://naofood.fr/php/receptionTabletteV3";
export const urlLogin = "https://naofood.fr/php/loginTablette"
export const optionsLogin = {
    method: 'GET'
}
// export function(resto){
//     resto
// }