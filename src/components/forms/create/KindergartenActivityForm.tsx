import { useState } from "react";
import { Activity, Kindergarten } from "../../../types";

type Props = {
    activities: Activity[];
};

export default function KindergartenActivityForm({ activities }: Props) {
    const [kindergartenName, setKindergartenName] = useState("");
    const [kindergarten, setKindergarten] = useState<Kindergarten | null>(null);
    const [availableActivities, setAvailableActivities] = useState<Activity[]>([]);
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
                    (data.activities ?? []).map((a: Activity) => a.id)
                );

                // filtriraj samo one koje nisu dodate
                const notAdded = activities.filter((a) => !existingIds.has(a.id));
                setAvailableActivities(notAdded);
                setMessage(null);
            } else {
                setMessage("Vrtić sa tim imenom ne postoji!");
                setKindergarten(null);
                setAvailableActivities([]);
            }
        } catch (err) {
            console.error("Greška pri povezivanju sa serverom:", err);
            setMessage("Greška pri povezivanju sa serverom");
            setKindergarten(null);
            setAvailableActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleActivity = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const addActivities = async () => {
        if (!kindergarten) return;

        try {
            setLoading(true);
            setMessage("Dodavanje aktivnosti...");
            const payload = selectedIds.map((id) => ({ activitiesId: id }));

            const res = await fetch(
                `http://localhost:8080/api/v1/kindergarten/${kindergarten.id}/activities`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                setMessage("Aktivnosti uspešno dodate!");
                // resetuj formu
                setKindergarten(null);
                setKindergartenName("");
                setAvailableActivities([]);
                setSelectedIds([]);
            } else {
                const errorText = await res.text();
                setMessage("Greška pri dodavanju aktivnosti: " + errorText);
            }
        } catch (err) {
            console.error("Greška pri dodavanju aktivnosti:", err);
            setMessage("Greška pri dodavanju aktivnosti");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="activity-form-container">
            <h3>Dodaj aktivnosti vrtiću</h3>

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
                    className={`activity-message ${
                        message.includes("uspešno") ? "success" :
                            message.includes("Greška") ? "error" : ""
                    }`}
                >
                    {message}
                </div>
            )}

            {kindergarten && (
                <div>
                    <h5>Dostupne aktivnosti za dodavanje:</h5>
                    {availableActivities.length === 0 ? (
                        <p>Sve aktivnosti su već dodate ovom vrtiću.</p>
                    ) : (
                        <div className="activity-list">
                            {/* ako postoji bar jedna neaktivna aktivnost, obavesti korisnika */}
                            {availableActivities.some((a) => !a.status) && (
                                <p className="inactive-warning">
                                    ⚠️ Neke aktivnosti nisu aktivne, ali ih i dalje možete dodati.
                                </p>
                            )}

                            {availableActivities.map((a) => (
                                <label
                                    key={a.id}
                                    style={{ color: a.status ? "inherit" : "gray" }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(a.id)}
                                        onChange={() => toggleActivity(a.id)}
                                    />
                                    {a.name} {!a.status && "(neaktivna)"}
                                </label>
                            ))}
                        </div>
                    )}
                    <button
                        type="button"
                        className="add-activities"
                        onClick={addActivities}
                        disabled={selectedIds.length === 0 || loading}
                    >
                        {loading ? "Dodavanje..." : "Dodaj izabrane aktivnosti"}
                    </button>
                </div>
            )}
        </div>
    );
}
