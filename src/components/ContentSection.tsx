import { useState, useEffect } from "react";
import KindergartenForm from "./forms/KindergartenForm";
import KindergartenAccountForm from "./forms/KindergartenAccountForm";
import GroupForm from "./forms/GroupForm";
import ActivityForm from "./forms/ActivityForm";
import KindergartenActivityForm from "./forms/KindergartenActivityForm";
import KindergartenGroupForm from "./forms/KindergartenGroupForm";

import { Kindergarten, Group, Activity, PageResponse } from "../types";

type ContentSectionProps = {
    activeTab: "vrtic" | "polaznici";
    vrticOption: "kreiraj" | "pretrazi";
};

type SubOption =
    | "vrtic"
    | "racun"
    | "grupe"
    | "aktivnost"
    | "dodajAktivnosti"
    | "dodajGrupe"
    | null;

export default function ContentSection({ activeTab, vrticOption }: ContentSectionProps) {
    const [subOption, setSubOption] = useState<SubOption>(null);

    const [groups, setGroups] = useState<Group[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);

    useEffect(() => {
        // Grupe
        fetch("http://localhost:8080/api/v1/groups")
            .then((res) => res.json())
            .then((data: PageResponse<Group> | Group[]) => {
                const list = Array.isArray(data) ? data : data.content;
                setGroups(Array.isArray(list) ? list : []);
            })
            .catch((err) => {
                console.error("Greška pri učitavanju grupa:", err);
                setGroups([]);
            });

        // Aktivnosti
        fetch("http://localhost:8080/api/v1/activities")
            .then((res) => res.json())
            .then((data: PageResponse<Activity> | Activity[]) => {
                const list = Array.isArray(data) ? data : data.content;
                setActivities(Array.isArray(list) ? list : []);
            })
            .catch((err) => {
                console.error("Greška pri učitavanju aktivnosti:", err);
                setActivities([]);
            });

        // Vrtići
        fetch("http://localhost:8080/api/v1/kindergarten")
            .then((res) => res.json())
            .then((data: PageResponse<Kindergarten>) => {
                setKindergartens(Array.isArray(data.content) ? data.content : []);
            })
            .catch((err) => {
                console.error("Greška pri učitavanju vrtića:", err);
                setKindergartens([]);
            });
    }, []);

    if (activeTab === "vrtic") {
        return (
            <div className="tab-content">
                {vrticOption === "kreiraj" && (
                    <div>
                        <h4>Kreiraj vrtić</h4>
                        <div className="vrtic-submenu">
                            <button onClick={() => setSubOption("vrtic")}>🏫 Vrtić</button>
                            <button onClick={() => setSubOption("racun")}>💳 Račun vrtića</button>
                            <button onClick={() => setSubOption("grupe")}>👶 Grupe</button>
                            <button onClick={() => setSubOption("aktivnost")}>🎨 Aktivnosti</button>
                            <button onClick={() => setSubOption("dodajAktivnosti")}>➕ Dodaj aktivnosti vrtiću</button>
                            <button onClick={() => setSubOption("dodajGrupe")}>➕ Dodaj grupe vrtiću</button>
                        </div>

                        {subOption === "vrtic" && (
                            <KindergartenForm setKindergartens={setKindergartens} />
                        )}
                        {subOption === "racun" && (
                            <KindergartenAccountForm kindergartens={kindergartens} />
                        )}
                        {subOption === "grupe" && (
                            <GroupForm setGroups={setGroups} />
                        )}
                        {subOption === "aktivnost" && (
                            <ActivityForm setActivities={setActivities} />
                        )}
                        {subOption === "dodajAktivnosti" && (
                            <KindergartenActivityForm activities={activities} />
                        )}
                        {subOption === "dodajGrupe" && (
                            <KindergartenGroupForm groups={groups} />
                        )}
                    </div>
                )}

                {vrticOption === "pretrazi" && (
                    <div>
                        <h4>Pretraži vrtiće</h4>
                        <p>Ovde ide tabela/lista sa podacima</p>
                    </div>
                )}
            </div>
        );
    }

    if (activeTab === "polaznici") {
        return (
            <div className="tab-content">
                <h3>Opcije za polaznike</h3>
                <p>Ovde ide sadržaj za polaznike</p>
            </div>
        );
    }

    return null;
}
