import React from 'react'
import { mac } from '../Setting'
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


const Bluetooth: React.FC = () => {
    
    BluetoothSerial.isConnected().then(
        (success) => {
            console.log('bluetooth is connected')
        },
        (error) => {
            BluetoothSerial.connect(mac);
        }
    )
    return(
        <div></div>
    )
}

export default Bluetooth;