import { useState } from "react";
import TabMenu from "../components/TabMenu";
import VrticSubmenu from "../components/VrticSubmenu";
import ContentSection from "../components/ContentSection";
import "./AdministrationPage.css";

export default function AdministrationPage() {
    const [activeTab, setActiveTab] = useState<"vrtic" | "polaznici">("vrtic");
    const [vrticOption, setVrticOption] = useState<"kreiraj" | "pretrazi">("kreiraj");

    return (
        <div className="admin-container">
            <h2>Administracija vrtića</h2>

            {/* Glavni tabovi */}
            <TabMenu activeTab={activeTab} onChange={setActiveTab} />

            {/* Sekundarni tabovi samo kad je aktivan "vrtic" */}
            {activeTab === "vrtic" && (
                <VrticSubmenu option={vrticOption} onChange={setVrticOption} />
            )}

            {/* Dinamički sadržaj */}
            <ContentSection activeTab={activeTab} vrticOption={vrticOption} />
        </div>
    );
}
