import { useState, useEffect } from "react";
import { Group, PageResponse } from "../../../types";
import "../../../pages/AdministrationPage.css";

type Props = {
    groups: Group[];
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
};

export default function GroupSearchAndUpdateForm({ groups, setGroups }: Props) {
    const [searchType, setSearchType] = useState<"name" | "status">("name");
    const [searchValue, setSearchValue] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    // učitavanje svih grupa sa paginacijom
    const loadGroups = async (pageNum: number = 0) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/groups?page=${pageNum}&size=10`);
            if (res.ok) {
                const data: PageResponse<Group> = await res.json();
                setGroups(data.content);
                setTotalPages(data.totalPages);
                setSearchError(null);
            }
        } catch (err) {
            console.error("Greška pri učitavanju grupa:", err);
            setGroups([]);
            setSearchError("Došlo je do greške pri učitavanju.");
        }
    };

    useEffect(() => {
        loadGroups(0);
    }, []);

    // pretraga po imenu ili statusu
    const handleSearch = async () => {
        if (!searchValue) return;
        try {
            let res: Response | undefined;
            if (searchType === "name") {
                res = await fetch(`http://localhost:8080/api/v1/groups/name/${searchValue}`);
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
                res = await fetch(`http://localhost:8080/api/v1/groups/status/${booleanStatus}`);
            }

            if (res && res.ok) {
                if (searchType === "name") {
                    const data: Group = await res.json();
                    setGroups([data]);
                } else {
                    const data: Group[] = await res.json();
                    setGroups(data);
                }
                setSearchError(null);
                setTotalPages(1);
                setPage(0);
            } else if (res && res.status === 404) {
                setGroups([]);
                setSearchError(`Nema grupa za ${searchType} "${searchValue}".`);
            }
        } catch (err) {
            console.error("Greška pri pretrazi grupa:", err);
            setGroups([]);
            setSearchError("Došlo je do greške pri pretrazi.");
        }
    };


    // reset vraća na paginaciju
    const resetSearch = () => {
        setSearchValue("");
        setSearchError(null);
        setPage(0);
        loadGroups(0);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Da li ste sigurni da želite da izbrišete grupu?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/groups/${id}`, { method: "DELETE" });
        if (res.ok) {
            setGroups(prev => prev.filter(g => g.id !== id));
        }
    };

    const handleUpdate = (group: Group) => {
        setSelectedGroup(group);
        setUpdateError(null);
    };

    const saveUpdate = async () => {
        if (!selectedGroup) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/groups/${selectedGroup.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedGroup),
            });

            if (res.ok) {
                const updated = await res.json();
                setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));
                setSelectedGroup(null);
                setUpdateError(null);
            } else {
                const errorData = await res.json();
                console.log("Error response from backend:", errorData);

                if (errorData.error === "NAME_EXISTS") {
                    setUpdateError("Ime već postoji. Izmena nije moguća.");
                } else {
                    setUpdateError("Došlo je do greške pri ažuriranju grupe.");
                }
            }
        } catch (err) {
            console.error("Greška pri ažuriranju grupe:", err);
            setUpdateError("Došlo je do greške pri ažuriranju.");
        }
    };

    return (
        <div>
            <h3>Pretraga grupa</h3>
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
                        <th>Popust</th>
                        <th>Status</th>
                        <th>Akcije</th>
                    </tr>
                    </thead>
                    <tbody>
                    {groups.map((g) => (
                        <tr key={g.id}>
                            <td>{g.id}</td>
                            <td>{g.name}</td>
                            <td>{g.price}</td>
                            <td>{g.discount}</td>
                            <td>{g.active ? "Aktivna" : "Neaktivna"}</td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => handleUpdate(g)}>Update</button>
                                    <button onClick={() => handleDelete(g.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedGroup && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Izmeni grupu</h4>
                        <label>Naziv</label>
                        <input
                            type="text"
                            value={selectedGroup.name}
                            onChange={(e) =>
                                setSelectedGroup({ ...selectedGroup, name: e.target.value })
                            }
                        />
                        <label>Cena</label>
                        <input
                            type="number"
                            value={selectedGroup.price}
                            onChange={(e) =>
                                setSelectedGroup({ ...selectedGroup, price: Number(e.target.value) })
                            }
                        />
                        <label>Popust</label>
                        <input
                            type="number"
                            value={selectedGroup.discount}
                            onChange={(e) =>
                                setSelectedGroup({ ...selectedGroup, discount: Number(e.target.value) })
                            }
                        />
                        <label>Status</label>
                        <select
                            value={selectedGroup.active ? "true" : "false"}
                            onChange={(e) =>
                                setSelectedGroup({ ...selectedGroup, active: e.target.value === "true" })
                            }
                        >
                            <option value="true">Aktivna</option>
                            <option value="false">Neaktivna</option>
                        </select>

                        {updateError && <div className="error-popup">{updateError}</div>}
                        <div className="modal-actions">
                            <button onClick={saveUpdate}>Sačuvaj</button>
                            <button onClick={() => setSelectedGroup(null)}>Otkaži</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
