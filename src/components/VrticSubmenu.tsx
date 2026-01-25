type VrticSubmenuProps = {
    option: "kreiraj" | "pretrazi";
    onChange: (opt: "kreiraj" | "pretrazi") => void;
};

export default function VrticSubmenu({ option, onChange }: VrticSubmenuProps) {
    return (
        <div className="vrtic-submenu">
            <button
                className={option === "kreiraj" ? "active" : ""}
                onClick={() => onChange("kreiraj")}
            >
                ➕ Kreiraj
            </button>
            <button
                className={option === "pretrazi" ? "active" : ""}
                onClick={() => onChange("pretrazi")}
            >
                🔍 Pretraži
            </button>
        </div>
    );
}
