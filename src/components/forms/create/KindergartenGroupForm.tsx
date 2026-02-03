import { useState } from "react";
import { Group, Kindergarten } from "../../../types";

type KindergartenGroupFormProps = {
    groups: Group[];
};

export default function KindergartenGroupForm({ groups }: KindergartenGroupFormProps) {
    const [kindergartenName, setKindergartenName] = useState("");
    const [kindergarten, setKindergarten] = useState<Kindergarten | null>(null);
    const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const findKindergarten = async () => {
        try {
            setLoading(true);
            setMessage("Pretraga vrtića...");
            const res = await fetch(
                `http://localhost:8080/api/v1/kindergarten/name/${kindergartenName.trim()}`
            );
            if (res.ok) {
                const data: Kindergarten = await res.json();
                setKindergarten(data);

                const existingIds = new Set(
                    (data.groups ?? []).map((g: Group) => g.id)
                );

                // filtriraj samo one koje nisu dodate i koje su aktivne
                const notAdded = groups.filter(
                    (g) => !existingIds.has(g.id) && g.active
                );
                setAvailableGroups(notAdded);
                setMessage(null);
            } else {
                setMessage("Vrtić sa tim imenom ne postoji!");
                setKindergarten(null);
                setAvailableGroups([]);
            }
        } catch (err) {
            console.error("Greška pri povezivanju sa serverom:", err);
            setMessage("Greška pri povezivanju sa serverom");
            setKindergarten(null);
            setAvailableGroups([]);
        } finally {
            setLoading(false);
        }
    };

const toggleGroup = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const addGroups = async () => {
        if (!kindergarten) return;

        try {
            setLoading(true);
            setMessage("Dodavanje grupa...");
            const payload = selectedIds.map((id) => ({ groupId: id }));

            const res = await fetch(
                `http://localhost:8080/api/v1/kindergarten/${kindergarten.id}/groups`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                setMessage("Grupe uspešno dodate!");
                // resetuj formu
                setKindergarten(null);
                setKindergartenName("");
                setAvailableGroups([]);
                setSelectedIds([]);
            } else {
                const errorText = await res.text();
                setMessage("Greška pri dodavanju grupa: " + errorText);
            }
        } catch (err) {
            console.error("Greška pri dodavanju grupa:", err);
            setMessage("Greška pri dodavanju grupa");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group-form-container">
            <h3>Dodaj grupe vrtiću</h3>

            <form>
                <label>Ime vrtića</label>
                <input
                    type="text"
                    value={kindergartenName}
                    onChange={(e) => setKindergartenName(e.target.value)}
                />
                <button
                    type="button"
                    className="find-kindergarten"
                    onClick={findKindergarten}
                    disabled={loading}
                >
                    {loading ? "Pretraga..." : "Pronađi vrtić"}
                </button>
            </form>

            {message && (
                <div
                    className={`group-message ${
                        message.includes("uspešno") ? "success" :
                            message.includes("Greška") ? "error" : ""
                    }`}
                >
                    {message}
                </div>
            )}

            {kindergarten && (
                <div>
                    <h5>Dostupne grupe za dodavanje:</h5>
                    {availableGroups.length === 0 ? (
                        <p>Sve grupe su već dodate ovom vrtiću.</p>
                    ) : (
                        <div className="group-list">
                            {availableGroups.map((g) => (
                                <label key={g.id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(g.id)}
                                        onChange={() => toggleGroup(g.id)}
                                    />
                                    {g.name}
                                </label>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        className="add-groups"
                        onClick={addGroups}
                        disabled={selectedIds.length === 0 || loading}
                    >
                        {loading ? "Dodavanje..." : "Dodaj izabrane grupe"}
                    </button>
                </div>
            )}
        </div>
    );
}
