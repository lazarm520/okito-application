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
  IonButton,
} from "@ionic/react";

import React from "react";
import { useLocation } from "react-router-dom";
import {
  archiveOutline,
  archiveSharp,
  bookmarkOutline,
  heartOutline,
  heartSharp,
  mailOutline,
  mailSharp,
  paperPlaneOutline,
  paperPlaneSharp,
  trashOutline,
  trashSharp,
  warningOutline,
  warningSharp,
  bodyOutline,
  bodySharp,
  newspaperOutline,
  newspaperSharp,
  pulseOutline,
  pulseSharp,
  browsersOutline,
  browsersSharp,
  trophy,
  fastFood,
} from "ionicons/icons";
import "./Menu.css";
import { disconnect } from "cluster";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Accueil",
    url: "/page/Accueil",
    iosIcon: fastFood,
    mdIcon: fastFood,
  },
  {
    title: "Données",
    url: "/page/Calendrier",
    iosIcon: newspaperOutline,
    mdIcon: newspaperSharp,
  },
  {
    title: "Statistiques",
    url: "/page/Statistics",
    iosIcon: trophy,
    mdIcon: trophy,
  },
  {
    title: "Profile",
    url: "/page/Profile",
    iosIcon: bodyOutline,
    mdIcon: bodySharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  function disconnect() {
    localStorage.removeItem("token");
    localStorage.setItem("connected", "false");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    // console.log(localStorage);
    window.location.replace("/");
  }

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader class="logo">O K I T O</IonListHeader>
          <IonNote></IonNote>
          {/* {localStorage.getItem("username")} */}
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon slot="start" icon={appPage.iosIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle key={10} autoHide={false}>
            <br />
            <br />
            <IonButton
              class="btn-deconnexion"
              //color="danger"
              fill="clear"
              expand="block"
              onClick={() => disconnect()}
            >
              Déconnexion
            </IonButton>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
