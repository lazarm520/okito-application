import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonThumbnail,
  IonList,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  isPlatform,
  IonAlert,
} from "@ionic/react";
import image from "../assets/meme.jpg";
import Resizer from "react-image-file-resizer";
import mobiscroll from "@mobiscroll/react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { useCamera } from "@ionic/react-hooks/camera";
import {
  CameraResultType,
  CameraSource,
  CameraPhoto,
  Capacitor,
  FilesystemDirectory,
  Plugins,
} from "@capacitor/core";
import axios from "axios";
import { stringify } from "querystring";
// import "./Calendrier.css";
import "./profile.css";

const { Camera } = Plugins;
interface ProfileProps {
  name: string;
}

const Profile: React.FC<ProfileProps> = ({ name }) => {
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [pwd, setPwd] = useState<String>("");
  const [oldPwd, setOldPwd] = useState<String>("");
  const [age, setAge] = useState<String>();
  const [taille, setTaille] = useState<String>();
  const [sexe, setSexe] = useState<String>();
  const [obj, setObj] = useState<String>();
  const [photo, setPhoto] = useState<string>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [nom, setNom] = useState<string>();
  const [prenom, setPrenom] = useState<string>();
  const [poid, setPoid] = useState<string>();
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [oldUsername, setOldUsername] = useState(
    username?.slice(1, username.length - 1)
  );
  const [id, setId] = useState(localStorage.getItem("id"));
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState("Mise à jour avec succès");
  // const [image, setImage] = useState("");
  const [fitness, setFitness] = useState({
    nom: "",
    prenom: "",
    birthdate: "",
    sexe: "",
    taille: 0,
    poids: 0,
    image: "",
  });
  async function takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    let imageUrl = image.webPath;

    // Can be set to the src of an image now
    setPhoto(imageUrl);
  }

  const takePhotoComponent = () => {
    // console.log(isPlatform("desktop"));
    if (isPlatform("desktop")) {
      return (
        <IonItem>
          <input
            className="item-input"
            type="file"
            onChange={(e) => setPhoto(e.target.value)}
          ></input>
        </IonItem>
      );
    } else {
      return (
        <IonItem>
          <IonButton>Choisir une photo</IonButton>
          <IonImg class="photoUser" style={{}} src={photo}></IonImg>
        </IonItem>
      );
    }
  };
  async function submitMoreInfo() {
    let config = {
      headers: {
        Accept: "application/json",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios
      .post(
        `http://ef0c96339a16.ngrok.io/api/service/user/${localStorage.getItem(
          "id"
        )}/addProfile`,
        {
          birthdate: selectedDate,
          currentWeight: poid,
          firstname: prenom,
          lastname: nom,
          gender: sexe,
          heightCm: taille,
          image: photo,
        },
        config
      )
      .then((res) => {
        localStorage.setItem("fitnessExist", "true");
      })
      .catch((err) => console.log(err));
  }
  async function submitUpdate() {
    let config = {
      headers: {
        "Content-Type": "application/json",
        "Accept-Charset": "UTF-8",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios
      .put(
        `http://ef0c96339a16.ngrok.io/api/service/user/updateRequestSign/${id}`,
        {
          username: username,
          email: email,
          password: pwd,
        },
        config
      )
      .then((res) => {
        // console.log(res.data);
        // localStorage.setItem("email", res.data.email);
        localStorage.setItem("username", res.data.username);
        setUsername(res.data.username);
        localStorage.setItem("email", res.data.email);
        setEmail(res.data.email);
        window.location.reload();
      })
      .catch((err) => alertError(err.response.data.message));
  }
  async function submitUpdatePassword() {
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios
      .put(
        `http://ef0c96339a16.ngrok.io/api/service/user/detailsUser/${id}/updatePassword`,
        {
          oldPassword: oldPwd,
          newPassword: pwd,
        },
        config
      )
      .then((res) => {
        console.log(res.data);
        // localStorage.setItem("email", res.data.email);
        localStorage.setItem("username", res.data.username);
      })
      .catch((err) => console.log(err));
  }
  async function getFitness() {
    let config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    await axios
      .get(
        `http://ef0c96339a16.ngrok.io/api/service/user/getCurrent/${localStorage.getItem(
          "id"
        )}`,
        config
      )
      .then((res) => {
        let img = Resizer.imageFileResizer(
          res.data.fitness.image,
          300,
          300,
          "JPEG",
          100,
          0,
          (uri) => {
            console.log(uri);
            let img = uri;
            return img;
          },
          "base64"
        );
        console.log(img);
        let data = {
          nom: res.data.fitness.lastname,
          prenom: res.data.fitness.firstname,
          birthdate: res.data.fitness.birthdate,
          sexe: res.data.fitness.sexe,
          taille: res.data.fitness.heightCm,
          poids: res.data.fitness.currentWeight,
          image: img,
        };
        //setFitness(data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getFitness();
  }, []);

  function handleSubmitMoreInfo() {
    submitMoreInfo();
  }
  function handleSubmitUpdate() {
    submitUpdate();
  }
  function handleSubmitUpdatePassword() {
    submitUpdatePassword();
  }
  function alertError(message: string) {
    setMessage(message);
    setAlert(true);
  }
  // console.log(localStorage.getItem("fitnessExist"));
  // console.log(localStorage.getItem("id"));
  // console.log(localStorage.getItem("fitnessExist"));
  return (
    <IonContent>
      <IonAlert
        isOpen={localStorage.getItem("fitnessExist") === "false"}
        header={"Information !"}
        mode="ios"
        message={
          "Pour continuez , il nous faut quelques informations ! Allez à la page Profile"
        }
      ></IonAlert>
      <IonAlert
        isOpen={alert}
        onDidDismiss={() => setAlert(false)}
        header={"Error"}
        mode="ios"
        //ubHeader={"Inscription avec succès"}
        message={message}
        buttons={["OK"]}
      />
      <IonGrid>
        <IonRow>
          <IonCard>
            <IonCardHeader class="bar bar-header bar-assertive">
              <IonThumbnail>
                <IonImg src={image} class="photoUser" />
              </IonThumbnail>
              <br />
              <br />
              <br />
            </IonCardHeader>

            <IonCardContent>
              <IonCardTitle>Bonjour, {username}</IonCardTitle>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque,
              laborum itaque facilis cupiditate quis rerum. Dolorem corporis,
              aut esse officia inventore possimus alias excepturi optio
              temporibus fugiat. Corporis, pariatur at.
            </IonCardContent>
          </IonCard>
        </IonRow>
        <IonRow>
          <IonCol sizeLg="6" sizeXs="12">
            <IonCard>
              <IonCardHeader class="title-card">
                <strong>Mettre à jour vos informations</strong>
                {/* {username?.slice(1, username.length - 1)} */}
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Pseudo </IonLabel>
                    <IonInput
                      type="text"
                      placeholder={username + ""}
                      onIonChange={(e) => setUsername(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel>E-mail</IonLabel>
                    <IonInput
                      type="email"
                      placeholder={email + ""}
                      onIonChange={(e) => setEmail(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Mot de passe</IonLabel>
                    <IonInput
                      type="password"
                      placeholder="*********"
                      required
                      onIonChange={(e) => setPwd(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonRow>
                    <IonCol>
                      <br />
                      <IonButton
                        class="btn-maj"
                        expand="block"
                        fill="clear"
                        onClick={() => handleSubmitUpdate()}
                      >
                        Mettre à jour
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol sizeLg="6" sizeXs="12">
            {" "}
            <IonCard>
              <IonCardHeader class="title-card">
                <strong>Plus d'information pour plus de résultats</strong>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonLabel>Nom</IonLabel>
                    <IonInput
                      type="text"
                      placeholder={fitness.nom}
                      onIonChange={(e) => setNom(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Prénom</IonLabel>
                    <IonInput
                      type="text"
                      placeholder={fitness.prenom}
                      onIonChange={(e) => setPrenom(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Date de naissance</IonLabel>
                    <IonDatetime
                      displayFormat="YYYY:MM:DD"
                      value={selectedDate}
                      placeholder={fitness.birthdate}
                      onIonChange={(e) => setSelectedDate(e.detail.value!)}
                    ></IonDatetime>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Sexe</IonLabel>
                    <IonSelect
                      placeholder={fitness.sexe}
                      onIonChange={(e) => setSexe(e.detail.value)}
                    >
                      <IonSelectOption value="Homme">Homme</IonSelectOption>
                      <IonSelectOption value="Femmme">Femme</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Taille (Cm)</IonLabel>
                    <IonInput
                      type="number"
                      placeholder={fitness.taille + ""}
                      onIonChange={(e) => setTaille(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel>Poids (Kg)</IonLabel>
                    <IonInput
                      type="number"
                      placeholder={fitness.poids + ""}
                      onIonChange={(e) => setPoid(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                  {takePhotoComponent()}
                  {/* <IonItem>
                    <IonSelect
                      placeholder="Objectif ..."
                      onIonChange={(e) => setObj(e.detail.value)}
                    >
                      <IonSelectOption value="1">Maigrir</IonSelectOption>
                      <IonSelectOption value="2">
                        Maintenir le poids
                      </IonSelectOption>
                      <IonSelectOption value="3">Grossir</IonSelectOption>
                    </IonSelect>
                  </IonItem> */}
                  <IonRow>
                    <IonCol>
                      <br />
                      <IonButton
                        class="btn-maj"
                        expand="block"
                        fill="clear"
                        onClick={(e) => handleSubmitMoreInfo()}
                      >
                        Enregistrer
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Profile;
