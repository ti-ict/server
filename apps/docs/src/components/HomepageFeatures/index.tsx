import type { ReactNode } from "react";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Server Management",
    icon: "🖥️",
    description:
      "Documentatie over welke software er geïnstalleerd is op de TI-ICT servers, hoe je toegang krijgt tot de servers, en hoe je ze kunt beheren.",
  },
  {
    title: "VM Web Interface",
    icon: "🌐",
    description:
      "Handleiding voor het gebruik van de webinterface van de virtuele machines (VMs), inclusief het starten, stoppen, en beheren van VMs via de webbrowser.",
  },
  {
    title: "Administration",
    icon: "⚙️",
    description:
      "Informatie over het beheer van de TI-ICT apps, inclusief het instellen van gebruikersrechten, het monitoren van systeemstatus, en het uitvoeren van administratieve taken.",
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <Heading as="h3">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <div key={idx} className="col col--4">
              <Feature {...props} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
