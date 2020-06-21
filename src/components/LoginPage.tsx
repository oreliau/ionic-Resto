import React, { useEffect, useState } from 'react';
import { IonList, IonItem, IonLabel, IonPage, IonHeader, IonToolbar, IonTitle, IonItemSliding, IonItemOption, IonItemOptions, IonContent } from '@ionic/react';
import { urlLogin, optionsLogin } from '../Setting'

const LoginPage: React.FC = () => {
    function registrerLog(resto: string, codeMac: string, nom: string){
        localStorage.setItem('loged', resto);
        localStorage.setItem('mac', codeMac);
        localStorage.setItem('resto', nom);
        window.location.reload();
    }



    if (errorlog != null) {
        return (
        <div className="container">
            <strong>Connexion serveur impossible</strong>
            <p>vérifiez que le wifi est bien actif</p>
        </div>
        );
    } else if (!load) {
        return (
        <div className="container">
            <strong>En chargement</strong>
            <p>merci de patienter</p>
        </div>
        );
    } else {
        return(
            <IonContent>
                <IonList>
                    {data.map((restos, index) => {
                        return(
                            <IonItem key={index}>
                                <IonLabel onClick={() => registrerLog(restos.nomMac, restos.mac, restos.resto)}>{restos.resto}</IonLabel>
                            </IonItem>
                        ) 
                    })}
                </IonList>
            </IonContent>
        )
    }
}

export default LoginPage;