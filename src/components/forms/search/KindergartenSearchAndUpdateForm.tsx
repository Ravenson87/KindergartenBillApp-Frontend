import { useState, useEffect } from "react";
import { Kindergarten, PageResponse } from "../../../types";
import "../../../pages/AdministrationPage.css";



type Props = {
    kindergartens: Kindergarten[];
    setKindergartens: React.Dispatch<React.SetStateAction<Kindergarten[]>>;
};

export default function KindergartenSearchAndUpdateForm({ kindergartens, setKindergartens }: Props) {
    const [searchType, setSearchType] = useState<"name" | "email">("name");
    const [searchValue, setSearchValue] = useState("");
    const [selectedKindergarten, setSelectedKindergarten] = useState<Kindergarten | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // greška samo za modal (update)
    const [updateError, setUpdateError] = useState<string | null>(null);

    // greška za pretragu
    const [searchError, setSearchError] = useState<string | null>(null);

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const loadKindergartens = async (pageNum: number = 0) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/kindergarten?page=${pageNum}&size=10`);
            if (res.ok) {
                const data: PageResponse<Kindergarten> = await res.json();
                setKindergartens(data.content);
                setTotalPages(data.totalPages);
                setSearchError(null);
            }
        } catch (err) {
            console.error("Greška pri učitavanju vrtića:", err);
            setKindergartens([]);
            setSearchError("Došlo je do greške pri učitavanju.");
        }
    };

    useEffect(() => {
        loadKindergartens(0);
    }, []);

    const handleSearch = async () => {
        if (!searchValue) return;

        if (searchType === "email" && !isValidEmail(searchValue)) {
            setKindergartens([]);
            setSearchError("Email mora biti u validnom formatu (npr. korisnik@gmail.com).");
            return;
        }

        try {
            let res;
            if (searchType === "name") {
                res = await fetch(`http://localhost:8080/api/v1/kindergarten/name/${searchValue}`);
            } else {
                res = await fetch(`http://localhost:8080/api/v1/kindergarten/email/${searchValue}`);
            }

            if (res.ok) {
                const data: Kindergarten = await res.json();
                setKindergartens([data]);
                setSearchError(null);
                setTotalPages(1);
                setPage(0);
            } else if (res.status === 404) {
                setKindergartens([]);
                setSearchError(
                    searchType === "name"
                        ? `Nema vrtića sa imenom "${searchValue}".`
                        : `Nema vrtića sa email-om "${searchValue}".`
                );
            }
        } catch (err) {
            console.error("Greška pri pretrazi vrtića:", err);
            setKindergartens([]);
            setSearchError("Došlo je do greške pri pretrazi.");
        }
    };

    const resetSearch = () => {
        setSearchValue("");
        setSearchError(null);
        setPage(0);
        loadKindergartens(0);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Da li ste sigurni da želite da izbrišete vrtić?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/kindergarten/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setKindergartens(prev => prev.filter(k => k.id !== id));
        }
    };

    const handleUpdate = (kg: Kindergarten) => {
        setSelectedKindergarten(kg);
        setUpdateError(null); // resetuj grešku u modalu
    };

    const saveUpdate = async () => {
        if (!selectedKindergarten) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/kindergarten/${selectedKindergarten.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedKindergarten),
            });

            if (res.ok) {
                const updated = await res.json();
                setKindergartens(prev =>
                    prev.map(k => (k.id === updated.id ? updated : k))
                );
                setSelectedKindergarten(null);
                setUpdateError(null);
            } else if (res.status === 409) {
            const errorData = await res.json();
            if (errorData.error === "NAME_EXISTS") {
                setUpdateError("Ime već postoji. Izmena nije moguća.");
            } else if (errorData.error === "EMAIL_EXISTS") {
                setUpdateError("Email već postoji. Izmena nije moguća.");
            } else if (errorData.error === "UNIQUE_CONSTRAINT") {
                // generički slučaj kada backend ne zna da li je ime ili email
                setUpdateError("Ime i email već postoje. Izmena nije moguća.");
            } else {
                setUpdateError("Došlo je do greške pri ažuriranju vrtića.");
            }
        }


    } catch (err) {
            console.error("Greška pri ažuriranju vrtića:", err);
            setUpdateError("Došlo je do greške pri ažuriranju.");
        }
    };

    return (
        <div>
            <h3>Pretraga vrtića</h3>
            <div className="search-fields">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value as "name" | "email")}>
                    <option value="name">Pretraga po imenu</option>
                    <option value="email">Pretraga po emailu</option>
                </select>
                <input
                    type="text"
                    placeholder={searchType === "name" ? "Unesi ime vrtića" : "Unesi email vrtića"}
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
                        <th>Email</th>
                        <th>Adresa</th>
                        <th>Telefon</th>
                        <th>Akcije</th>
                    </tr>
                    </thead>
                    <tbody>
                    {kindergartens.map((kg) => (
                        <tr key={kg.id}>
                            <td>{kg.id}</td>
                            <td>{kg.name}</td>
                            <td>{kg.email}</td>
                            <td>{kg.address}</td>
                            <td>{kg.phoneNumber}</td>
                            <td>
                                <button onClick={() => handleUpdate(kg)}>Update</button>
                                <button onClick={() => handleDelete(kg.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="pagination">
                <button disabled={page === 0} onClick={() => { setPage(page - 1); loadKindergartens(page - 1); }}>Prethodna</button>
                <span>Strana {page + 1} od {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => { setPage(page + 1); loadKindergartens(page + 1); }}>Sledeća</button>
            </div>

            {selectedKindergarten && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Izmeni vrtić</h4>
                        <label>Naziv</label>
                        <input
                            type="text"
                            value={selectedKindergarten.name}
                            onChange={(e) =>
                                setSelectedKindergarten({ ...selectedKindergarten, name: e.target.value })
                            }
                        />
                        <label>Email</label>
                        <input
                            type="text"
                            value={selectedKindergarten.email}
                            onChange={(e) =>
                                setSelectedKindergarten({ ...selectedKindergarten, email: e.target.value })
                            }
                        />
                        <label>Adresa</label>
                        <input
                            type="text"
                            value={selectedKindergarten.address}
                            onChange={(e) =>
                                setSelectedKindergarten({ ...selectedKindergarten, address: e.target.value })
                            }
                        />
                        <label>Telefon</label>
                        <input
                            type="text"
                            value={selectedKindergarten.phoneNumber}
                            onChange={(e) =>
                                setSelectedKindergarten({ ...selectedKindergarten, phoneNumber: e.target.value })
                            }
                        />
                        {updateError && (
                            <div className="error-popup">{updateError}</div>
                        )}
                        <div className="modal-actions">
                            <button onClick={saveUpdate}>Sačuvaj</button>
                            <button onClick={() => setSelectedKindergarten(null)}>Otkaži</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}