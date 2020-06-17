import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonActionSheet
} from '@ionic/react';

import React, { useState } from 'react';
import { nomComplet, mac } from '../Setting';
// import DispoResto from './DispoResto';
import { useLocation } from 'react-router-dom';
import { bluetooth, bicycleOutline, archiveSharp} from 'ionicons/icons';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import Alert from './Alert'


import './Menu.css';

interface AppPage {
  url: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: `Commande`,
    url: '/page/Commande',
    mdIcon: bicycleOutline
  },
  {
    title: 'Bluetooth',
    url: '/page/Bluetooth',
    mdIcon: bluetooth
  },
  {
    title: `Version APK`,
    url: '/page/Version APK',
    mdIcon: archiveSharp
  }
];

const Menu: React.FC = () => {

  // const [showAlert, setShowAlert] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const location = useLocation();


  function changeResto(){
    localStorage.removeItem('loged');
    localStorage.removeItem('mac');
    window.location.reload();
  }

  setTimeout(() => {
    BluetoothSerial.isConnected().then(
      (success) => {
          console.log('bluetooth is connected')
      },
      (error) => {
          BluetoothSerial.connect(mac).subscribe(
            (success) => { console.log('bluetooth is now connected') },
            (error) => {
              return(      
                <Alert 
                  bluetooth={true}
                  wifi={false}
                  nouvelleCommande={false}
                />
              )
            }
          )
      }
    )
  }, 500);

  return (
    <IonMenu contentId="main" menuId="main" side="start" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>
            NaoFood
            {/* <DispoResto /> */}
          </IonListHeader>
          <IonNote onClick={() => changeResto()}>{(nomComplet)? nomComplet : "cliquez ici pour définir le restaurant"}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
