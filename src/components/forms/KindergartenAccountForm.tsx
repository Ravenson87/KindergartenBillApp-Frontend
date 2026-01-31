import { Kindergarten } from "../../types";

type Props = {
    kindergartens: Kindergarten[];
};

export default function KindergartenAccountForm({ kindergartens }: Props) {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);

                const payload = {
                    bank_name: formData.get("bankName"),
                    account_number: formData.get("accountNumber"),
                    pib: formData.get("pib"),
                    identification_number: formData.get("identificationNumber"),
                    activity_code: formData.get("activityCode") ? Number(formData.get("activityCode")) : null,
                    kindergarten: { id: Number(formData.get("kindergartenId")) },
                };

                const response = await fetch("http://localhost:8080/api/v1/kindergarten-account", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    alert("Račun uspešno sačuvan!");
                    form.reset();
                } else {
                    alert("Greška pri čuvanju računa");
                }
            }}
        >
            <label>Naziv banke</label>
            <input type="text" name="bankName" required />
            <label>Broj računa</label>
            <input type="text" name="accountNumber" required />
            <label>PIB</label>
            <input type="text" name="pib" required />
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
    );
}
