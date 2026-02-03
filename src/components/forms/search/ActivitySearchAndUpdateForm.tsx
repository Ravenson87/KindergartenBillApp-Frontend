import { useState, useEffect } from "react";
import { Activity, PageResponse } from "../../../types";

type Props = {
    activities: Activity[];
    setActivities?: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function ActivitySearchAndUpdateForm({ activities, setActivities }: Props) {
    const [searchName, setSearchName] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

    const loadActivities = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/activities?page=${page}&size=10&name=${searchName}`
            );
            if (res.ok) {
                const data: PageResponse<Activity> = await res.json();
                if (setActivities) setActivities(data.content);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error("Greška pri učitavanju aktivnosti:", err);
        }
    };

    useEffect(() => {
        loadActivities();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        loadActivities();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Da li ste sigurni da želite da izbrišete aktivnost?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/activities/${id}`, {
            method: "DELETE",
        });
        if (res.ok && setActivities) {
            setActivities(prev => prev.filter(a => a.id !== id));
        }
    };

    const handleUpdate = (a: Activity) => {
        setSelectedActivity(a);
    };

    const saveUpdate = async () => {
        if (!selectedActivity) return;
        const res = await fetch(`http://localhost:8080/api/v1/activities/${selectedActivity.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedActivity),
        });
        if (res.ok && setActivities) {
            const updated = await res.json();
            setActivities(prev =>
                prev.map(a => (a.id === updated.id ? updated : a))
            );
            setSelectedActivity(null);
        }
    };

    return (
        <div>
            <h3>Pretraga aktivnosti</h3>
            <div className="search-fields">
                <input
                    type="text"
                    placeholder="Pretraga po imenu"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
                <button onClick={handleSearch}>Pretraži</button>
            </div>

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
                {activities.map((a) => (
                    <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.name}</td>
                        <td>{a.price}</td>
                        <td>{a.status ? "Aktivna" : "Neaktivna"}</td>
                        <td>
                            <button onClick={() => handleUpdate(a)}>Update</button>
                            <button onClick={() => handleDelete(a.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prethodna</button>
                <span>Strana {page + 1} od {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Sledeća</button>
            </div>

            {selectedActivity && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Izmeni aktivnost</h4>
                        <label>Naziv</label>
                        <input
                            type="text"
                            value={selectedActivity.name}
                            onChange={(e) =>
                                setSelectedActivity({ ...selectedActivity, name: e.target.value })
                            }
                        />
                        <label>Cena</label>
                        <input
                            type="number"
                            value={selectedActivity.price}
                            onChange={(e) =>
                                setSelectedActivity({ ...selectedActivity, price: Number(e.target.value) })
                            }
                        />
                        <label>Status</label>
                        <select
                            value={selectedActivity.status ? "true" : "false"}
                            onChange={(e) =>
                                setSelectedActivity({ ...selectedActivity, status: e.target.value === "true" })
                            }
                        >
                            <option value="true">Aktivna</option>
                            <option value="false">Neaktivna</option>
                        </select>
                        <div className="modal-actions">
                            <button onClick={saveUpdate}>Sačuvaj</button>
                            <button onClick={() => setSelectedActivity(null)}>Otkaži</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
