export default function SiteSwitcher({ sites, selectedSiteId, onSelect }) {
  if (sites.length <= 1) {
    return <span className="text-[13px] text-[#5B6B7C]">{sites[0]?.name}</span>;
  }

  return (
    <select
      value={selectedSiteId ?? ""}
      onChange={(e) => onSelect(Number(e.target.value))}
      className="rounded-lg border border-[#E4E9EF] bg-white px-2.5 py-1.5 text-[13px] text-[#1B2430] outline-none focus:border-[#2E6FED]"
    >
      {sites.map((site) => (
        <option key={site.id} value={site.id}>
          {site.name}
        </option>
      ))}
    </select>
  );
}
