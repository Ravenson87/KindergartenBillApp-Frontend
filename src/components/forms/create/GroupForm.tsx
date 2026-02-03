import { Group } from "../../../types";

type GroupFormProps = {
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
};

export default function GroupForm({ setGroups }: GroupFormProps) {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);

                const payload = {
                    name: formData.get("name"),
                    price: formData.get("price") ? Number(formData.get("price")) : null,
                    discount: formData.get("discount") ? Number(formData.get("discount")) : 0,
                    active: formData.get("active") === "true",
                };

                const response = await fetch("http://localhost:8080/api/v1/groups", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    const createdGroup: Group = await response.json();

                    // odmah dodaj novu grupu u state u parent komponenti
                    setGroups((prev) => [...prev, createdGroup]);

                    alert("Grupa uspešno sačuvana!");
                    form.reset();
                } else {
                    const errorText = await response.text();
                    alert("Greška pri čuvanju grupe: " + errorText);
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
    );
}
