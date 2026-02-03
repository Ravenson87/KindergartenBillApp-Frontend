import { useState, useEffect } from "react";
import { KindergartenAccount, PageResponse } from "../../../types";
import "../../../pages/AdministrationPage.css";

type Props = {
    accounts: KindergartenAccount[];
    setAccounts: React.Dispatch<React.SetStateAction<KindergartenAccount[]>>;
};

export default function KindergartenAccountSearchAndUpdateForm({ accounts, setAccounts }: Props) {
    const [searchType, setSearchType] = useState<
        "account_number" | "identification_number" | "bank_name" | "kindergarten_id" | "kindergarten_name"
    >("account_number");
    const [searchValue, setSearchValue] = useState("");
    const [selectedAccount, setSelectedAccount] = useState<KindergartenAccount | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [updateError, setUpdateError] = useState<string | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);

    const loadAccounts = async (pageNum: number = 0) => {
        try {
            const res = await fetch(`http://localhost:8080/api/v1/kindergarten-account?page=${pageNum}&size=10`);
            if (res.ok) {
                const data: PageResponse<KindergartenAccount> = await res.json();
                setAccounts(data.content);
                setTotalPages(data.totalPages);
                setSearchError(null);
            }
        } catch (err) {
            console.error("Greška pri učitavanju računa:", err);
            setAccounts([]);
            setSearchError("Došlo je do greške pri učitavanju.");
        }
    };

    useEffect(() => {
        loadAccounts(0);
    }, []);

    const handleSearch = async () => {
        if (!searchValue) return;

        try {
            let res: Response | undefined;
            switch (searchType) {
                case "account_number":
                    res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/account/${searchValue}`);
                    break;
                case "identification_number":
                    res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/identification/${searchValue}`);
                    break;
                case "bank_name":
                    res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/bank-name/${searchValue}`);
                    break;
                case "kindergarten_id":
                    res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/kindergarten/${searchValue}`);
                    break;
                case "kindergarten_name":
                    res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/kindergarten-name/${searchValue}`);
                    break;
            }

            if (res && res.ok) {
                // account_number i identification_number vraćaju jedan objekat
                if (searchType === "account_number" || searchType === "identification_number" || searchType === "kindergarten_id") {
                    const data: KindergartenAccount = await res.json();
                    setAccounts([data]);
                } else {
                    // bank_name i kindergarten_name vraćaju listu
                    const data: KindergartenAccount[] = await res.json();
                    setAccounts(data);
                }
                setSearchError(null);
                setTotalPages(1);
                setPage(0);
            } else if (res && res.status === 404) {
                setAccounts([]);
                setSearchError(`Nema računa za ${searchType} "${searchValue}".`);
            }
        } catch (err) {
            console.error("Greška pri pretrazi računa:", err);
            setAccounts([]);
            setSearchError("Došlo je do greške pri pretrazi.");
        }
    };

    const resetSearch = () => {
        setSearchValue("");
        setSearchError(null);
        setPage(0);
        loadAccounts(0);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Da li ste sigurni da želite da izbrišete račun?")) return;
        const res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            setAccounts(prev => prev.filter(a => a.id !== id));
        }
    };

    const handleUpdate = (acc: KindergartenAccount) => {
        setSelectedAccount(acc);
        setUpdateError(null);
    };

    const saveUpdate = async () => {
        if (!selectedAccount) return;
        try {
            const res = await fetch(`http://localhost:8080/api/v1/kindergarten-account/${selectedAccount.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(selectedAccount),
            });

            if (res.ok) {
                const updated = await res.json();
                setAccounts(prev =>
                    prev.map(a => (a.id === updated.id ? updated : a))
                );
                setSelectedAccount(null);
                setUpdateError(null);
            } else if (res.status === 409) {
                const errorData = await res.json();
                if (errorData.error === "BOTH_EXISTS") {
                    setUpdateError("Broj računa i matični broj već postoje. Izmena nije moguća.");
                } else if (errorData.error === "ACCOUNT_NUMBER_EXISTS") {
                    setUpdateError("Broj računa već postoji. Izmena nije moguća.");
                } else if (errorData.error === "IDENTIFICATION_NUMBER_EXISTS") {
                    setUpdateError("Matični broj već postoji. Izmena nije moguća.");
                } else if (errorData.error === "UNIQUE_CONSTRAINT") {
                    setUpdateError("Broj računa i matični broj već postoje. Izmena nije moguća.");
                } else {
                    setUpdateError("Došlo je do greške pri ažuriranju računa.");
                }
            }
        } catch (err) {
            console.error("Greška pri ažuriranju računa:", err);
            setUpdateError("Došlo je do greške pri ažuriranju.");
        }
    };

    return (
        <div>
            <h3>Pretraga računa vrtića</h3>
            <div className="search-fields">
                <select value={searchType} onChange={(e) => setSearchType(e.target.value as any)}>
                    <option value="account_number">Po broju računa</option>
                    <option value="identification_number">Po matičnom broju</option>
                    <option value="bank_name">Po imenu banke</option>
                    <option value="kindergarten_name">Po imenu vrtića</option>
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
                        <th>Banka</th>
                        <th>Broj računa</th>
                        <th>PIB</th>
                        <th>Matični broj</th>
                        <th>Šifra delatnosti</th>
                        <th>Vrtić</th>
                        <th>Akcije</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((acc) => (
                        <tr key={acc.id}>
                            <td>{acc.id}</td>
                            <td>{acc.bank_name}</td>
                            <td>{acc.account_number}</td>
                            <td>{acc.pib}</td>
                            <td>{acc.identification_number}</td>
                            <td>{acc.activity_code}</td>
                            <td>{acc.kindergarten.name ?? acc.kindergarten.id}</td>
                            <td>
                                <div className="actions">
                                    <button onClick={() => handleUpdate(acc)}>Update</button>
                                    <button onClick={() => handleDelete(acc.id)}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                <button disabled={page === 0} onClick={() => {
                    setPage(page - 1);
                    loadAccounts(page - 1);
                }}>Prethodna
                </button>
                <span>Strana {page + 1} od {totalPages}</span>
                <button disabled={page + 1 >= totalPages} onClick={() => {
                    setPage(page + 1);
                    loadAccounts(page + 1);
                }}>Sledeća
                </button>
            </div>

            {selectedAccount && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Izmeni račun</h4>
                        <label>Banka</label>
                        <input
                            type="text"
                            value={selectedAccount.bank_name}
                            onChange={(e) =>
                                setSelectedAccount({ ...selectedAccount, bank_name: e.target.value })
                            }
                        />
                        <label>Broj računa</label>
                        <input
                            type="text"
                            value={selectedAccount.account_number}
                            onChange={(e) =>
                                setSelectedAccount({ ...selectedAccount, account_number: e.target.value })
                            }
                        />
                        <label>PIB</label>
                        <input
                            type="text"
                            value={selectedAccount.pib}
                            onChange={(e) =>
                                setSelectedAccount({ ...selectedAccount, pib: e.target.value })
                            }
                        />
                        <label>Matični broj</label>
                        <input
                            type="text"
                            value={selectedAccount.identification_number}
                            onChange={(e) =>
                                setSelectedAccount({ ...selectedAccount, identification_number: e.target.value })
                            }
                        />
                        <label>Šifra delatnosti</label>
                        <input
                            type="number"
                            value={selectedAccount.activity_code ?? ""}
                            onChange={(e) =>
                                setSelectedAccount({ ...selectedAccount, activity_code: Number(e.target.value) })
                            }
                        />
                        <label>Vrtić</label>
                        <input
                            type="text"
                            value={selectedAccount.kindergarten.name ?? ""}
                            onChange={(e) =>
                                setSelectedAccount({
                                    ...selectedAccount,
                                    kindergarten: { ...selectedAccount.kindergarten, name: e.target.value }
                                })
                            }
                        />

                        {updateError && (
                            <div className="error-popup">{updateError}</div>
                        )}

                        <div className="modal-actions">
                            <button onClick={saveUpdate}>Sačuvaj</button>
                            <button onClick={() => setSelectedAccount(null)}>Otkaži</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
