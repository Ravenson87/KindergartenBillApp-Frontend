import { useState } from "react";
import { Activity } from "../../../types";

type Props = {
    activities: Activity[];
};

export default function KindergartenActivitySearchAndUpdateForm({ activities }: Props) {
    const [searchName, setSearchName] = useState("");
    const [kindergartenId, setKindergartenId] = useState<number | null>(null);
    const [kgActivities, setKgActivities] = useState<Activity[]>([]);

    const handleSearch = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/kindergarten/search?name=${searchName}`);
            if (res.ok) {
                const kg = await res.json();
                setKindergartenId(kg.id);
                setKgActivities(kg.activities);
            }
        } catch (err) {
            console.error("Greška pri pretrazi vrtića:", err);
        }
    };

    const removeActivity = async (activityId: number) => {
        if (!kindergartenId) return;
        if (!window.confirm("Da li ste sigurni da želite da uklonite aktivnost?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/kindergarten/${kindergartenId}/activities`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{ activitiesId: activityId }]),
        });
        if (res.ok) {
            setKgActivities(prev => prev.filter(a => a.id !== activityId));
        }
    };

    const removeAllActivities = async () => {
        if (!kindergartenId) return;
        if (!window.confirm("Da li ste sigurni da želite da uklonite sve aktivnosti?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/kindergarten/${kindergartenId}/activities/clear`, {
            method: "DELETE",
        });
        if (res.ok) {
            setKgActivities([]);
        }
    };

    return (
        <div>
            <h3>Pretraga aktivnosti vrtića</h3>
            <input
                type="text"
                placeholder="Unesi ime vrtića"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <button onClick={handleSearch}>Pretraži</button>

            {kgActivities.length > 0 && (
                <>
                    <table className="kindergarten-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Naziv</th>
                            <th>Cena</th>
                            <th>Status</th>
                            <th>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {kgActivities.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.name}</td>
                                <td>{a.price}</td>
                                <td>{a.status ? "Aktivna" : "Neaktivna"}</td>
                                <td>
                                    <button onClick={() => removeActivity(a.id)}>Ukloni aktivnost</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={removeAllActivities}>Ukloni sve aktivnosti</button>
                </>
            )}
        </div>
    );
}
