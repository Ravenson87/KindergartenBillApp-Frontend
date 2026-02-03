import { useState } from "react";
import { Group } from "../../../types";

type Props = {
    groups: Group[];
};

export default function KindergartenGroupSearchAndUpdateForm({ groups }: Props) {
    const [searchName, setSearchName] = useState("");
    const [kindergartenId, setKindergartenId] = useState<number | null>(null);
    const [kgGroups, setKgGroups] = useState<Group[]>([]);

    const handleSearch = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/kindergarten/search?name=${searchName}`);
            if (res.ok) {
                const kg = await res.json();
                setKindergartenId(kg.id);
                setKgGroups(kg.groups);
            }
        } catch (err) {
            console.error("Greška pri pretrazi vrtića:", err);
        }
    };

    const removeGroup = async (groupId: number) => {
        if (!kindergartenId) return;
        if (!window.confirm("Da li ste sigurni da želite da uklonite grupu?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/kindergarten/${kindergartenId}/groups`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{ groupId }]),
        });
        if (res.ok) {
            setKgGroups(prev => prev.filter(g => g.id !== groupId));
        }
    };

    const removeAllGroups = async () => {
        if (!kindergartenId) return;
        if (!window.confirm("Da li ste sigurni da želite da uklonite sve grupe?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/kindergarten/${kindergartenId}/groups/clear`, {
            method: "DELETE",
        });
        if (res.ok) {
            setKgGroups([]);
        }
    };

    return (
        <div>
            <h3>Pretraga grupa vrtića</h3>
            <input
                type="text"
                placeholder="Unesi ime vrtića"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
            />
            <button onClick={handleSearch}>Pretraži</button>

            {kgGroups.length > 0 && (
                <>
                    <table className="kindergarten-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Naziv</th>
                            <th>Cena</th>
                            <th>Popust</th>
                            <th>Status</th>
                            <th>Akcije</th>
                        </tr>
                        </thead>
                        <tbody>
                        {kgGroups.map((g) => (
                            <tr key={g.id}>
                                <td>{g.id}</td>
                                <td>{g.name}</td>
                                <td>{g.price}</td>
                                <td>{g.discount}</td>
                                <td>{g.active ? "Aktivna" : "Neaktivna"}</td>
                                <td>
                                    <button onClick={() => removeGroup(g.id)}>Ukloni grupu</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={removeAllGroups}>Ukloni sve grupe</button>
                </>
            )}
        </div>
    );
}
