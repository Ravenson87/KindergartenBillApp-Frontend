import { Kindergarten } from "../../types";

type Props = {
    setKindergartens: React.Dispatch<React.SetStateAction<Kindergarten[]>>;
};

export default function KindergartenForm({ setKindergartens }: Props) {
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const formData = new FormData(form);

                const payload = {
                    name: formData.get("name"),
                    address: formData.get("address"),
                    phoneNumber: formData.get("phoneNumber"),
                    email: formData.get("email"),
                };

                const response = await fetch("http://localhost:8080/api/v1/kindergarten", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    alert("Vrtić uspešno sačuvan!");
                    form.reset();

                    const res = await fetch("http://localhost:8080/api/v1/kindergarten");
                    const freshData = await res.json();
                    setKindergartens(freshData.content);
                } else {
                    alert("Greška pri čuvanju vrtića");
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
    );
}
