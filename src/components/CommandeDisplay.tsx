import React, { useState } from "react";
import {
  IonList,
  IonItem, 
  IonLabel, 
  IonNote, 
  IonCol,
  IonRow,
  IonModal,
  IonButton,
  IonContent
} from '@ionic/react';
import './CommandeDisplay.css';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { resto } from '../Setting';
import Alert from './Alert';

interface IProps {
  envoieData: any[];
  showAlerte: boolean;
  showAlertBleutooth: boolean;
}

const CommandeDisplay: React.FC<IProps>= ({envoieData, showAlerte, showAlertBleutooth}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCommande, setShowCommande] = useState({ produits: [], resto: "", numCommande: "", phone: "", comment: "", jour: "", crenau: ""});
  const [showTotal, setShowTotal] = useState([]);
  const [nombreCommande, setNombreCommande] = useState(Number);
  const [ajax, setAjax] = useState(envoieData);
console.log("showBLue " +showAlertBleutooth);

  const today = new Date();
  const todayReform = today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear();
  console.log(todayReform);

  function displayModal(data: any){
    setShowModal(true);
    setShowCommande(data);
    setNombreCommande(data.length);
    setShowTotal(data.produits);
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

  return(
    <IonList>
      {envoieData.map((commande, index) => {
        if(commande.jour == todayReform && commande.resto.indexOf(resto) >= 0){
          return(
            <IonItem key={index}>
                <IonCol>
                  <IonLabel>
                    <IonRow >
                      <IonCol size="4"  onClick={() => {displayModal(commande)}}>
                        <IonRow>
                          <IonCol><IonLabel>{commande.numCommande}</IonLabel></IonCol>
                          <IonCol><IonNote color="warning">Articles: {commande.produits.length}</IonNote></IonCol>
                        </IonRow>
                      </IonCol>
                      <IonCol size="4"  onClick={() => {displayModal(commande)}}>
                        <IonRow>
                          <IonCol>
                            {commande.phone}
                          </IonCol>
                          <IonCol>
                            {(commande.crenau === 'instant')? "instantanée": "précommande" }
                          </IonCol>
                        </IonRow>
                      </IonCol>
                      <IonCol size="3"  onClick={() => {imprimerCommande(commande)}}>
                        <IonButton className="ImprimeDirect" >Imprimer</IonButton>
                      </IonCol>
                    </IonRow>
                  </IonLabel>
                </IonCol>
            </IonItem>
          )
        }
      })}
      <Alert      
        bluetooth={showAlertBleutooth}
        wifi={false}
        nouvelleCommande={showAlerte}
      />
      <IonContent>
        <IonModal isOpen={showModal} backdrop-dismiss="false" cssClass='my-custom-class' >
          <IonList  className="modalSession">
          <IonItem>
              <h1>{showCommande.numCommande}</h1>
              <IonButton className="ImprimeModal" slot="end" onClick={() => {imprimerCommande(showCommande)}} >Imprimer</IonButton>
          </IonItem>
          <IonItem>
            <IonList>
              <IonLabel>{showCommande.comment}</IonLabel>
              <IonLabel>{showCommande.phone}</IonLabel>
            </IonList>
          </IonItem>
          {<>
            {showCommande.produits.map((produit: any, i: number)=>{
              return(      
                <IonItem key={i}>
                  <IonNote slot="start" className="quantiteProduit" >1x</IonNote>
                  <IonList>
                    <IonItem lines="none">
                      <IonLabel >{produit.nom}</IonLabel>
                    </IonItem >
                    {(produit.detail != "")? produit.detail.map((options: string, index: number) =>{
                      if(options != " <br> "){
                        return(
                        <IonItem key={index} className="descriptionProduit" lines="none">
                          <IonNote key={index}>{options.replace(/<br>/gi, "")}</IonNote>
                        </IonItem>
                      )}})
                      : ""
                    }
                  </IonList>
                  <IonNote slot="end" className="prixProduit" data-prix={produit.prix}>{produit.prix}€</IonNote>
                </IonItem>
              )
            })}
          </>}
            <IonList>
              <IonItem lines="none">
                <IonLabel className="totalPrix">Total</IonLabel>
                <IonNote slot="end" className="prixCommande">
                {showTotal
                  .map((commande) =>{ return(parseFloat(commande.prix))})
                  .reduce((total: number, value: number) => {return(total + value)}, 0)
                  .toFixed(2)}
                    €
                  </IonNote>
              </IonItem>
            </IonList>
          </IonList>

        <IonButton onClick={() => setShowModal(false)}>Fermer la fenetre</IonButton>
        </IonModal>
      </IonContent>
      
    </IonList>

  )
}

export default CommandeDisplay