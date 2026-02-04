import { useState, useEffect } from "react";
import { Activity, PageResponse } from "../../../types";
import "../../../pages/AdministrationPage.css";

type Props = {
    activities: Activity[];
    setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
};

export default function ActivitySearchAndUpdateForm({ activities, setActivities }: Props) {
    const [searchType, setSearchType] = useState<"name" | "status">("name");
    const [searchValue, setSearchValue] = useState("");
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // učitavanje svih aktivnosti sa paginacijom
    const loadActivities = async (pageNum: number = 0) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/activities?page=${pageNum}&size=10`);
            if (res.ok) {
                const data: PageResponse<Activity> = await res.json();
                setActivities(data.content);
                setTotalPages(data.totalPages);
                setSearchError(null);
            }
        } catch (err) {
            console.error("Greška pri učitavanju aktivnosti:", err);
            setActivities([]);
            setSearchError("Došlo je do greške pri učitavanju.");
        }
    };

    useEffect(() => {
        loadActivities(0);
    }, []);

    // pretraga po imenu ili statusu
    const handleSearch = async () => {
        if (!searchValue) return;
        try {
            let res: Response | undefined;
            if (searchType === "name") {
                res = await fetch(`http://localhost:8080/api/v1/activities/name/${searchValue}`);
            } else {
                // mapiranje "aktivna"/"neaktivna" u true/false
                let statusValue: string = searchValue.toLowerCase();
                let booleanStatus: boolean | null = null;
                if (statusValue === "aktivna") {
                    booleanStatus = true;
                } else if (statusValue === "neaktivna") {
                    booleanStatus = false;
                } else {
                    setSearchError("Za status unesite 'aktivna' ili 'neaktivna'.");
                    return;
                }
                res = await fetch(`http://localhost:8080/api/v1/activities/status/${booleanStatus}`);
            }

            if (res && res.ok) {
                if (searchType === "name") {
                    const data: Activity = await res.json();
                    setActivities([data]); // vraća jedan objekat
                } else {
                    const data: Activity[] = await res.json();
                    setActivities(data); // vraća listu
                }
                setSearchError(null);
                setTotalPages(1);
                setPage(0);
            } else if (res && res.status === 404) {
                setActivities([]);
                setSearchError(`Nema aktivnosti za ${searchType} "${searchValue}".`);
            }
        } catch (err) {
            console.error("Greška pri pretrazi aktivnosti:", err);
            setActivities([]);
            setSearchError("Došlo je do greške pri pretrazi.");
        }
    };


    // reset vraća na paginaciju
    const resetSearch = () => {
        setSearchValue("");
        setSearchError(null);
        setPage(0);
        loadActivities(0);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Da li ste sigurni da želite da izbrišete aktivnost?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/activities/${id}`, { method: "DELETE" });
        if (res.ok) {
            setActivities(prev => prev.filter(a => a.id !== id));
        }
    };

    const handleUpdate = (act: Activity) => {
        setSelectedActivity(act);
        setUpdateError(null);
    };

    const saveUpdate = async () => {
        if (!selectedActivity) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/activities/${selectedActivity.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedActivity),
            });

            if (res.ok) {
                const updated = await res.json();
                setActivities(prev => prev.map(a => (a.id === updated.id ? updated : a)));
                setSelectedActivity(null);
                setUpdateError(null);
            } else {
                const errorData = await res.json();

                if (errorData.error === "NAME_EXISTS") {
                    setUpdateError("Ime već postoji. Izmena nije moguća.");
                } else {
                    setUpdateError("Došlo je do greške pri ažuriranju aktivnosti.");
                }
            }
        } catch (err) {
            console.error("Greška pri ažuriranju aktivnosti:", err);
            setUpdateError("Došlo je do greške pri ažuriranju.");
        }
    };


    return (
        <div>
            <h3>Pretraga aktivnosti</h3>
            <div className="search-fields">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value as any)}>
                    <option value="name">Po nazivu</option>
                    <option value="status">Po statusu (aktivna/neaktivna)</option>
                </select>
                <input
                    type="text"
                    placeholder="Unesi vrednost za pretragu"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <button onClick={handleSearch}>Pretraži</button>
                <button onClick={resetSearch}>Resetuj</button>
            </div>

            {searchError ? (
                <div className="error-popup">{searchError}</div>
            ) : (
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
                    {activities.map((act) => (
                        <tr key={act.id}>
                            <td>{act.id}</td>
                            <td>{act.name}</td>
                            <td>{act.price}</td>
                            <td>{act.status ? "Aktivna" : "Neaktivna"}</td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => handleUpdate(act)}>Update</button>
                                    <button onClick={() => handleDelete(act.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

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

                        {updateError && <div className="error-popup">{updateError}</div>}
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
