//librairie
import React, { useState, useEffect, useRef } from 'react';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AppVersion } from '@ionic-native/app-version';
import { AppUpdate } from '@ionic-native/app-update';
import { Insomnia } from '@ionic-native/insomnia';
//component
import { url, options, urlLogin, optionsLogin, mac, resto} from "../Setting";
import CommandeDisplay from './CommandeDisplay';
import LoginPage from './LoginPage';
//Css
import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const [isLoaded, setisLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [commande, setCommande] = useState([]);
  const [horaire, setHoraire] = useState([]);
  const [version, setVersion] = useState("");
  const [dataLogin, setDataLogin] = useState([]);
  const [isLoadedLogin, setisLoadedLogin] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);
  const [showAlertBleutooth, setShowAlertBleutooth] = useState(false);
  let alerte = false
  const today = new Date();
  const todayReform = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear();
  console.log(todayReform);

  function setLocalID(items: []){
    console.log("tesntative impression")
    items.map((commandes: any) =>{
      if(commandes.jour == todayReform && commandes.resto.indexOf(resto) >= 0){
        
        if(localStorage.getItem(commandes.numCommande) != "printed"){
          alerte =true;
          imprimerCommande(commandes);
          localStorage.setItem(commandes.numCommande, 'printed');
        }
      }
    })
  }

  function imprimerCommande(data: any){
    let finalTxt = "";
    finalTxt += '\x1b\x21\x30'+"   NAOFOOD"+ '\n'+ '\n'
    finalTxt += '      #'+data.numCommande + '\x1b\x21\x30' + '\n';
    finalTxt += '   '+ data.comment + '\n'+ '\n';
    finalTxt += "Articles:" + data.produits.length + '\n'+ '\x1b\x21\x00' + '\x1b\x45\x01' +'\x1b\x4d\x00'+ '\n';
    // map tous les produits
    finalTxt += data.produits.map((produit: any) => {
      let produitTxt = "";
      produitTxt += produit.nom + '   ' + produit.prix + '\n';
      (produit.detail != "")? produit.detail.map((options: string) =>{
        if(options != " <br> "){
          return(
            produitTxt += options.replace(/<br>/gi, "") + '\n'
        )}})
        : produitTxt += "";
      return(
        (produitTxt + '\n'+  '\n')
      )
    })
    //Prix total
    finalTxt += data.produits.map((commande: any) =>{ return(parseFloat(commande.prix))})
    .reduce((total: number, value: number) => {return(total + value)}, 0)
    .toFixed(2) + 'e\n';
    finalTxt +='\n' +'\n' + '\n' +'\n';
    BluetoothSerial.write(finalTxt.replace(/,/gi, "").replace(/€/gi, "e").replace(/é/gi, "e").replace(/è/gi, "e").replace(/ô/gi, "o").replace(/à/gi, "a").replace(/ù/gi, "u").replace(/ü/gi, "u").replace(/ø/gi, "o").replace(/ï/gi, "i"));
    console.log(finalTxt.replace(/,/gi, "").replace(/€/gi, "e").replace(/é/gi, "e").replace(/è/gi, "e").replace(/ô/gi, "o").replace(/à/gi, "a").replace(/ù/gi, "u").replace(/ü/gi, "u").replace(/ø/gi, "o").replace(/ï/gi, "i"));
  }

  //vérfie la connection en bleutooth
  function bluetooth(){
    BluetoothSerial.isConnected().then(
      (success) => {
          console.log('bluetooth is connected')
      },
      (error) => {
          BluetoothSerial.connect(mac).subscribe(() => console.log('connexion reussi'), ()=> {
            console.log("connexion échoué");
            setShowAlertBleutooth(true);
          })
      }
    )
  }
  bluetooth();

  //empêche la mise en veille
  Insomnia.keepAwake();

  //vérifie la version de l'APK et lance le téléchargement
  const updateUrl = 'https://naofood.fr/version/update.xml';
  AppUpdate.checkAppUpdate(updateUrl);

  //obtient le numéro de version
  AppVersion.getVersionNumber().then(
    (results) => {setVersion(results)}
  );

  //fonction qui lance un callback a interval régulier
  function useInterval(callback: any , delay: number) {
    const savedCallback: any = useRef();
  
    // Se souvenir de la dernière fonction de rappel.
    useEffect(() => {
      savedCallback.current = callback;
    }, []);
  
    // Configurer l’intervalle.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  
  //initialisation requête ajax
  useEffect(() =>{
    fetch(urlLogin, optionsLogin)
    .then(res => res.json())
    .then(
    (result) => {
        setisLoadedLogin(true);
        setDataLogin(result);
    },
    (error) => {
        setisLoadedLogin(true);
        setErrorLogin(error);
    }
    )
    fetch(url, options)
      .then(res => res.json())
      .then(
        (result) => {
          setisLoaded(true);
          setCommande(result.commande);
          setHoraire(result.horaire);
          setLocalID(result.commande);
        },
        (error) => {
          setisLoaded(true);
          setError(error);
        }
      )
  }, [])

  //requêt ajax en interval 
  useInterval(() =>{
      fetch(url, options)
        .then(res => res.json())
        .then(
          (result) => {
            setisLoaded(true);
            setCommande(result.commande);
            setHoraire(result.horaire);
            setLocalID(result.commande);
          },
          (error) => {
            setisLoaded(true);
            setError(error);
          }
        )
  }, 30000)

  //affiche message d'érreur si impossibilité de se connecter
  if(localStorage.getItem('loged') === null){
    return <LoginPage data={dataLogin} load={isLoadedLogin} errorlog={errorLogin}/>
  }
  else if(name === "Commande"){
    if (error != null) {
      return (
        <div className="container">
          <strong>Connexion serveur impossible</strong>
          <p>vérifiez que le wifi est bien actif</p>
      </div>
      );
    } else if (!isLoaded) {
      return (
        <div className="container">
          <strong>En chargement</strong>
          <p>merci de patienter</p>
      </div>
      );
    } else {
      return (
          <CommandeDisplay showAlerte={alerte} showAlertBleutooth={showAlertBleutooth} envoieData={commande}/>
      );
    }
  }
  else if(name === "Version APK"){
    return (
      <div className="container">
        <strong>{name}</strong>
        <p>{version}</p>
      </div>
    );
  }
  else if(name === "Bluetooth"){
    return (
      <div className="container">
        <strong>{name}</strong>
        <p>code mac: {mac}</p>
      </div>
    );
  }
  else{
    return (
      <div className="container">
        <strong>{name}</strong>
        <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    );
  }
};

export default ExploreContainer;
