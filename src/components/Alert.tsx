import React, { useState } from 'react';
import { IonToast, IonContent, IonAlert } from '@ionic/react';
import { Media, MediaObject } from '@ionic-native/media';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { mac } from '../Setting';

//charge le mp3 via url, ce qui n'est pas optimal
const file: MediaObject = Media.create('https://www.bensound.com/bensound-music/bensound-ukulele.mp3');

interface Props{
    bluetooth: boolean;
    wifi: boolean;
    nouvelleCommande: boolean;
}

const AlertExample: React.FC<Props> = ({wifi = false, bluetooth = false, nouvelleCommande = false}) => {
    const [showAlert1, setShowAlert1] = useState(wifi);
    const [showAlert2, setShowAlert2] = useState(bluetooth);
    const [showAlert3, setShowAlert3] = useState(false);
    const[bluetoothValid, setBluetoothValid] = useState(false);

    //suivis du statut du chargement du son
    file.onStatusUpdate.subscribe(status => console.log(status));
    file.onSuccess.subscribe(() => console.log('Action is successful'));
    file.onError.subscribe(error => console.log('Error!', error));

    //fonctions liée à l'alerte bluetooth
    function bluetoothConex(){
        BluetoothSerial.isConnected().then(
            (success) => {
                console.log('bluetooth is connected alerte')
            },
            (error) => {
                BluetoothSerial.connect(mac).subscribe(() => {setBluetoothValid(true)}, ()=> {
                setBluetoothValid(false)
                setShowAlert2(bluetooth);
                })
            }
        )
    }

    function checkBluetooth(){
        setShowAlert2(false);
        bluetoothConex();
    }

    function checkCommande(){
        console.log("end ring");
        setShowAlert3(false);
        file.stop();
    }

    //fonction lié à l'alerte commande
    function ring(){
        console.log('ring');
        file.play();
    }


    return (
        <IonContent>
            <IonToast
                backdrop-dismiss="false" 
                isOpen={showAlert1}
                onDidDismiss={() => setShowAlert1(false)}
                cssClass='my-custom-class'
                header={'Wifi'}
                message='Connexion perdue ou introuvable'
                buttons={['OK']}
            />
            <IonToast
                backdrop-dismiss="false" 
                isOpen={showAlert2}
                onDidDismiss={() => checkBluetooth()}
                cssClass='my-custom-class'
                header='Bluetooth: imprimante'
                message='Connexion perdue ou introuvable, cliquez sur "OK" pour retenter un connexion'
                buttons={['OK']}
            />
            <IonAlert
                backdrop-dismiss="false" 
                isOpen={nouvelleCommande}
                onDidDismiss={() => checkCommande()}
                onWillPresent={() => ring()}
                cssClass='my-custom-class'
                header='Nouvelle Commande'
                message={''}
                buttons={['OK']}
                />
            <IonToast
                backdrop-dismiss="false" 
                isOpen={bluetoothValid}
                duration={200}
                cssClass='my-custom-class'
                header='Connexion bluetooth réussi!'
                />
        </IonContent>
    )

}

export default AlertExample;