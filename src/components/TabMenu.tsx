type TabMenuProps = {
    activeTab: "vrtic" | "polaznici";
    onChange: (tab: "vrtic" | "polaznici") => void;
};

export default function TabMenu({ activeTab, onChange }: TabMenuProps) {
    return (
        <div className="tab-menu">
            <button
                className={activeTab === "vrtic" ? "active" : ""}
                onClick={() => onChange("vrtic")}
            >
                🏫 Vrtić
            </button>
            <button
                className={activeTab === "polaznici" ? "active" : ""}
                onClick={() => onChange("polaznici")}
            >
                👨‍👩‍👧 Polaznici
            </button>
        </div>
    );
}
