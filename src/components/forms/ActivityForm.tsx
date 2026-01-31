export default function ActivityForm() {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);

                const payload = {
                    name: formData.get("name"),
                    price: formData.get("price") ? Number(formData.get("price")) : null,
                    status: formData.get("status") === "true",
                };

                const response = await fetch("http://localhost:8080/api/v1/activities", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    alert("Aktivnost uspešno sačuvana!");
                    form.reset();
                } else {
                    const errorText = await response.text();
                    alert("Greška pri čuvanju aktivnosti: " + errorText);
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
    );
}
