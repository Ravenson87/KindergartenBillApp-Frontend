import { useState, useEffect } from "react";

type ContentSectionProps = {
    activeTab: "vrtic" | "polaznici";
    vrticOption: "kreiraj" | "pretrazi";
};

// Tipovi za entitete
type Group = {
    id: number;
    name: string;
};

type Activity = {
    id: number;
    name: string;
};

type Kindergarten = {
    id: number;
    name: string;
};

export default function ContentSection({ activeTab, vrticOption }: ContentSectionProps) {
    const [subOption, setSubOption] = useState<"vrtic" | "racun" | "grupe" | "aktivnost" | null>(null);

    // State za sve entitete
    const [groups, setGroups] = useState<Group[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);

    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    // Učitavanje podataka sa backend-a
    useEffect(() => {
        // Grupe
        fetch("http://localhost:8080/api/v1/groups")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.content;
                if (Array.isArray(list)) {
                    setGroups(list as Group[]);
                } else {
                    setGroups([]);
                }
            })
            .catch((err) => {
                console.error("Greška pri učitavanju grupa:", err);
                setGroups([]);
            });

        // Aktivnosti
        fetch("http://localhost:8080/api/v1/activities")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.content;
                if (Array.isArray(list)) {
                    setActivities(list as Activity[]);
                } else {
                    setActivities([]);
                }
            })
            .catch((err) => {
                console.error("Greška pri učitavanju aktivnosti:", err);
                setActivities([]);
            });

        // Vrtići
        fetch("http://localhost:8080/api/v1/kindergarten")
            .then((res) => res.json())
            .then((data) => {
                console.log("Vrtići sa backend-a:", data);
                if (Array.isArray(data.content)) {
                    console.log("Broj vrtića:", data.content.length); // 👈 dodatna provera
                    setKindergartens(data.content as Kindergarten[]);
                } else {
                    setKindergartens([]);
                }
            })
            .catch((err) => {
                console.error("Greška pri učitavanju vrtića:", err);
                setKindergartens([]);
            });

    }, []);


    if (activeTab === "vrtic") {
        return (
            <div className="tab-content">
                {vrticOption === "kreiraj" && (
                    <div>
                        <h4>Kreiraj vrtić</h4>

                        {/* Submenu */}
                        <div className="vrtic-submenu">
                            <button onClick={() => setSubOption("vrtic")}>🏫 Vrtić</button>
                            <button onClick={() => setSubOption("racun")}>💳 Račun vrtića</button>
                            <button onClick={() => setSubOption("grupe")}>👶 Grupe</button>
                            <button onClick={() => setSubOption("aktivnost")}>🎨 Aktivnosti</button>
                        </div>

                        {/* Kindergarten forma */}
                        {subOption === "vrtic" && (
                            <form
                                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const formData = new FormData(form);

                                    const payload = {
                                        name: formData.get("name"),
                                        address: formData.get("address"),
                                        phone_number: formData.get("phoneNumber"),
                                        email: formData.get("email"),
                                    };

                                    console.log("Payload Kindergarten:", payload);

                                    const response = await fetch("http://localhost:8080/api/v1/kindergarten", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    if (!response.ok) {
                                        const errorText = await response.text();
                                        alert("Greška pri čuvanju vrtića: " + errorText);
                                    } else {
                                        const data = await response.json();
                                        console.log("Uspešno sačuvan vrtić:", data);
                                        alert("Vrtić uspešno sačuvan!");
                                        form.reset();

                                        // 👇 odmah povuci novu listu da se dropdown osveži
                                        await fetch("http://localhost:8080/api/v1/kindergarten")
                                            .then((res) => res.json())
                                            .then((freshData) => {
                                                if (Array.isArray(freshData.content)) {
                                                    setKindergartens(freshData.content as Kindergarten[]);
                                                    console.log("Osvežena lista vrtića:", freshData.content);
                                                }
                                            });
                                    }
                                }}
                            >
                                <label>Naziv vrtića</label>
                                <input type="text" name="name" required />

                                <label>Adresa</label>
                                <input type="text" name="address" required />

                                <label>Telefon</label>
                                <input type="text" name="phoneNumber" />

                                <label>Email</label>
                                <input type="email" name="email" required />

                                <button type="submit">Sačuvaj vrtić</button>
                            </form>
                        )}



                        {/* KindergartenAccount forma */}
                        {subOption === "racun" && (
                            <form
                                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();
                                    const form = e.currentTarget; // sigurno je <form>
                                    const formData = new FormData(form);

                                    const payload = {
                                        bank_name: formData.get("bankName"),
                                        account_number: formData.get("accountNumber"),
                                        pib: formData.get("pib"),
                                        identification_number: formData.get("identificationNumber"),
                                        activity_code: formData.get("activityCode")
                                            ? Number(formData.get("activityCode"))
                                            : null,
                                        kindergarten: { id: Number(formData.get("kindergartenId")) }, // 👈 veza na vrtić
                                    };

                                    console.log("Payload Account:", payload);

                                    const response = await fetch("http://localhost:8080/api/v1/kindergarten-account", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    if (!response.ok) {
                                        const errorText = await response.text();
                                        alert("Greška pri čuvanju računa: " + errorText);
                                    } else {
                                        const data = await response.json();
                                        console.log("Uspešno sačuvan račun:", data);
                                        alert("Račun uspešno sačuvan!");
                                        form.reset(); // 👈 sigurno resetuje formu
                                    }
                                }}
                            >
                                <label>Naziv banke</label>
                                <input type="text" name="bankName" required />

                                <label>Broj računa</label>
                                <input type="text" name="accountNumber" required />

                                <label>PIB</label>
                                <input type="text" name="pib" placeholder="9 cifara" required />

                                <label>Matični broj</label>
                                <input type="text" name="identificationNumber" required />

                                <label>Šifra delatnosti</label>
                                <input type="number" name="activityCode" />

                                <label>Vrtić</label>
                                <select name="kindergartenId" required>
                                    <option value="">Izaberi vrtić</option>
                                    {kindergartens.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.name}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit">Sačuvaj račun</button>
                            </form>
                        )}


                        {/* Group forma */}
                        {subOption === "grupe" && (
                            <form
                                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();
                                    const form = e.currentTarget; // sigurno je <form>
                                    const formData = new FormData(form);

                                    const payload = {
                                        name: formData.get("name"),
                                        price: formData.get("price") ? Number(formData.get("price")) : null,
                                        discount: formData.get("discount") ? Number(formData.get("discount")) : 0,
                                        active: formData.get("active") === "true", // dropdown vraća string
                                    };

                                    console.log("Payload Group:", payload);

                                    const response = await fetch("http://localhost:8080/api/v1/groups", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    if (!response.ok) {
                                        const errorText = await response.text();
                                        alert("Greška pri čuvanju grupe: " + errorText);
                                    } else {
                                        const data = await response.json();
                                        console.log("Uspešno sačuvana grupa:", data);
                                        alert("Grupa uspešno sačuvana!");
                                        form.reset(); // 👈 sigurno resetuje formu
                                    }
                                }}
                            >
                                <label>Naziv grupe</label>
                                <input type="text" name="name" required />

                                <label>Cena</label>
                                <input type="number" step="0.01" name="price" required />

                                <label>Popust (%)</label>
                                <input type="number" name="discount" defaultValue={0} />

                                <label>Status</label>
                                <select name="active" defaultValue="true">
                                    <option value="true">Aktivna</option>
                                    <option value="false">Neaktivna</option>
                                </select>

                                <button type="submit">Sačuvaj grupu</button>
                            </form>
                        )}



                        {/* Activity forma */}
                        {subOption === "aktivnost" && (
                            <form
                                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                                    e.preventDefault();
                                    const form = e.currentTarget; // sigurno je <form>
                                    const formData = new FormData(form);

                                    const payload = {
                                        name: formData.get("name"),
                                        price: formData.get("price") ? Number(formData.get("price")) : null,
                                        status: formData.get("status") === "true", // dropdown vraća string
                                    };

                                    console.log("Payload Activity:", payload);

                                    const response = await fetch("http://localhost:8080/api/v1/activities", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(payload),
                                    });

                                    if (!response.ok) {
                                        const errorText = await response.text();
                                        alert("Greška pri čuvanju aktivnosti: " + errorText);
                                    } else {
                                        const data = await response.json();
                                        console.log("Uspešno sačuvana aktivnost:", data);
                                        alert("Aktivnost uspešno sačuvana!");
                                        form.reset(); // 👈 sigurno resetuje formu
                                    }
                                }}
                            >
                                <label>Naziv aktivnosti</label>
                                <input type="text" name="name" required />

                                <label>Cena</label>
                                <input type="number" step="0.01" name="price" required />

                                <label>Status</label>
                                <select name="status" defaultValue="true">
                                    <option value="true">Aktivna</option>
                                    <option value="false">Neaktivna</option>
                                </select>

                                <button type="submit">Sačuvaj aktivnost</button>
                            </form>
                        )}



                    </div>
            )}

                {vrticOption === "pretrazi" && (
                    <div>
                        <h4>Pretraži vrtiće</h4>
                        <p>Ovde ide tabela/lista sa podacima</p>
                    </div>
                )}
            </div>
        );
    }

    if (activeTab === "polaznici") {
        return (
            <div className="tab-content">
                <h3>Opcije za polaznike</h3>
                <p>Ovde ide sadržaj za polaznike</p>
            </div>
        );
    }

    return null;
}
