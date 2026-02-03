import { useState, useEffect } from "react";
import { Group, PageResponse } from "../../../types";

type Props = {
    groups: Group[];
    setGroups?: React.Dispatch<React.SetStateAction<Group[]>>;
};

export default function GroupSearchAndUpdateForm({ groups, setGroups }: Props) {
    const [searchName, setSearchName] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const loadGroups = async () => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/groups?page=${page}&size=10&name=${searchName}`
            );
            if (res.ok) {
                const data: PageResponse<Group> = await res.json();
                if (setGroups) setGroups(data.content);
                setTotalPages(data.totalPages);
            }
        } catch (err) {
            console.error("Greška pri učitavanju grupa:", err);
        }
    };

    useEffect(() => {
        loadGroups();
    }, [page]);

    const handleSearch = () => {
        setPage(0);
        loadGroups();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Da li ste sigurni da želite da izbrišete grupu?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/groups/${id}`, {
            method: "DELETE",
        });
        if (res.ok && setGroups) {
            setGroups(prev => prev.filter(g => g.id !== id));
        }
    };

    const handleUpdate = (g: Group) => {
        setSelectedGroup(g);
    };

    const saveUpdate = async () => {
        if (!selectedGroup) return;
        const res = await fetch(`http://localhost:8080/api/v1/groups/${selectedGroup.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedGroup),
        });
        if (res.ok && setGroups) {
            const updated = await res.json();
            setGroups(prev =>
                prev.map(g => (g.id === updated.id ? updated : g))
            );
            setSelectedGroup(null);
        }
    };

    return (
        <div>
            <h3>Pretraga grupa</h3>
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
                    <th>Akcije</th>
                </tr>
                </thead>
                <tbody>
                {groups.map((g) => (
                    <tr key={g.id}>
                        <td>{g.id}</td>
                        <td>{g.name}</td>
                        <td>
                            <button onClick={() => handleUpdate(g)}>Update</button>
                            <button onClick={() => handleDelete(g.id)}>Delete</button>
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
