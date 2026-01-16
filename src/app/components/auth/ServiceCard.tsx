type ServiceCardProps = {
  title: string;
  enabled: boolean;
  price: string;
  unit: string;
  unitOptions: string[];
  onToggle: () => void;
  onPriceChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  error?: string;
};

const ServiceCard = ({
  title,
  enabled,
  price,
  unit,
  unitOptions,
  onToggle,
  onPriceChange,
  onUnitChange,
  error,
}: ServiceCardProps) => {
  return (
    <div className="rounded-md border border-border dark:border-darkborder p-4">
      <label className="flex items-center gap-3 font-medium">
        <input
          type="checkbox"
          checked={enabled}
          onChange={onToggle}
          className="h-5 w-5 accent-primary"
        />
        <span className="text-midnight_text dark:text-white">{title}</span>
      </label>

      {enabled && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Preis (€)"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            className={`col-span-2 rounded-md border px-3 py-2 text-sm outline-none
              ${error ? "border-red-500" : "border-border"}`}
          />

          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="rounded-md border border-border px-2 py-2 text-sm"
          >
            {unitOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>

          {error && (
            <p className="col-span-3 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
