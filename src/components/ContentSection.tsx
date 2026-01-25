import { useState } from "react";

type ContentSectionProps = {
    activeTab: "vrtic" | "polaznici";
    vrticOption: "kreiraj" | "pretrazi";
};

export default function ContentSection({ activeTab, vrticOption }: ContentSectionProps) {
    const [subOption, setSubOption] = useState<"vrtic" | "racun" | "grupe" | "aktivnost" | null>(null);

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
                            <form>
                                <label>Naziv vrtića</label>
                                <input type="text" name="name" placeholder="Unesi naziv" />

                                <label>Adresa</label>
                                <input type="text" name="address" placeholder="Unesi adresu" />

                                <label>Telefon</label>
                                <input type="text" name="phoneNumber" placeholder="Unesi broj telefona" />

                                <label>Email</label>
                                <input type="email" name="email" placeholder="Unesi email" />

                                {/* Dropdown za grupe */}
                                <label>Grupe</label>
                                <select name="groups">
                                    <option value="">Izaberi grupu</option>
                                    {/* dinamički dodavanje grupa */}
                                </select>

                                {/* Dropdown za aktivnosti */}
                                <label>Aktivnosti</label>
                                <select name="activities">
                                    <option value="">Izaberi aktivnost</option>
                                    {/* dinamički dodavanje aktivnosti */}
                                </select>

                                <button type="submit">Sačuvaj vrtić</button>
                            </form>
                        )}

                        {/* KindergartenAccount forma */}
                        {subOption === "racun" && (
                            <form>
                                <label>Ime vrtića</label>
                                <input type="text" name="kindergartenName" placeholder="Unesi ime vrtića" />

                                <label>Naziv banke</label>
                                <input type="text" name="bankName" placeholder="Unesi naziv banke" />

                                <label>Broj računa</label>
                                <input type="text" name="accountNumber" placeholder="Unesi broj računa" />

                                <label>PIB</label>
                                <input type="text" name="pib" placeholder="Unesi PIB (9 cifara)" />

                                <label>Matični broj</label>
                                <input type="text" name="identificationNumber" placeholder="Unesi matični broj" />

                                <label>Šifra delatnosti</label>
                                <input type="number" name="activityCode" placeholder="Unesi šifru delatnosti" />

                                <button type="submit">Sačuvaj račun</button>
                            </form>
                        )}

                        {/* Group forma */}
                        {subOption === "grupe" && (
                            <form>
                                <label>Naziv grupe</label>
                                <input type="text" name="name" placeholder="Unesi naziv grupe" />

                                <label>Cena</label>
                                <input type="number" step="0.01" name="price" placeholder="Unesi cenu" />

                                <label>Popust (%)</label>
                                <input type="number" name="discount" placeholder="Unesi popust" />

                                <label>Status</label>
                                <select name="status">
                                    <option value="true">Aktivna</option>
                                    <option value="false">Neaktivna</option>
                                </select>

                                <button type="submit">Sačuvaj grupu</button>
                            </form>
                        )}

                        {/* Activity forma */}
                        {subOption === "aktivnost" && (
                            <form>
                                <label>Naziv aktivnosti</label>
                                <input type="text" name="name" placeholder="Unesi naziv aktivnosti" />

                                <label>Cena</label>
                                <input type="number" step="0.01" name="price" placeholder="Unesi cenu" />

                                <label>Status</label>
                                <select name="status">
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
