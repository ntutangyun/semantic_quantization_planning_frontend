"use client"; // This is a client component 👈🏽

import OTAConfig from "@/app/OTAConfig";
import {useState} from "react";
import ClientsConfig from "@/app/ClientsConfig";

import HeroBackgroundImage from "@/media/DALL·E-hero-image.webp"
import ClientInterface from "@/app/ClientInterface";
import FederationServerInterface from "@/app/FederationServerInterface";

export default function Home() {
    const [otaConfig, setOtaConfig] = useState({
        supportedQuantizationLevels: {
            4: true, 6: true, 8: true, 12: true, 16: true, 32: true,
        }
    });

    const [clientsConfig, setClientsConfig] = useState({clients: []});
    const [currentClientIndex, setCurrentClientIndex] = useState(null);

    const handleGetStartedClick = () => {
        document.getElementById("ota-config").scrollIntoView({behavior: "smooth"});
    };

    return (<div className="font-[family-name:var(--font-geist-sans)]">
        <main className="mb-10">
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: `url(${HeroBackgroundImage.src})`,
                }}>
                <div className="hero-overlay bg-opacity-80"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-2xl">
                        <h1 className="mb-5 text-5xl font-bold">Semantic Quantization Planning for Over-the-Air
                            Federated
                            Learning</h1>
                        <p className="py-6">
                            Source code available at <a
                            href="https://github.com/ntutangyun/semantic_quantization_planner"
                            target={"_blank"}>https://github.com/ntutangyun/semantic_quantization_planner</a>
                        </p>
                        <button className="btn btn-primary" onClick={handleGetStartedClick}>Get Started</button>
                    </div>
                </div>
            </div>

            <OTAConfig otaConfig={otaConfig} setOtaConfig={setOtaConfig}/>
            <ClientsConfig clientsConfig={clientsConfig} setClientsConfig={setClientsConfig}
                           currentClientIndex={currentClientIndex} setCurrentClientIndex={setCurrentClientIndex}/>
            {
                currentClientIndex !== null && clientsConfig.clients.length > 0 &&
                clientsConfig.clients[currentClientIndex] &&
                <ClientInterface currentClient={clientsConfig.clients[currentClientIndex]}
                                 currentClientIndex={currentClientIndex}
                                 setClientsConfig={setClientsConfig}/>
            }

            <FederationServerInterface clientsConfig={clientsConfig} setClientsConfig={setClientsConfig}/>  

        </main>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mb-5">
            Contact: yun.tang [at] cranfield [dot] ac [dot] uk, jinsheng.yuan [at] cranfield [dot] ac [dot] uk
        </footer>
    </div>);
}
