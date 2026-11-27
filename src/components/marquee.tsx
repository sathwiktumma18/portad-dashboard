const DEFAULT_ITEMS = [
  "Notion",
  "Trello",
  "ClickUp",
  "Asana",
  "Slack",
  "GitHub",
  "Jira",
  "Confluence",
  "Airtable",
  "Linear",
  "Google Drive",
  "Zendesk",
];

function Row({ items }: { items: string[] }) {
  return (
    <div
      className="flex shrink-0 items-center gap-3.5 py-3 pr-3.5"
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          style={{ animationDelay: `${index * -0.32}s` }}
          className="marquee-dance-pill glass flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#08CFFE]/60 hover:text-slate-900 dark:text-frost-200 dark:hover:text-white"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-fuchsia-400 to-[#08CFFE]"
          />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function Marquee({
  items = DEFAULT_ITEMS,
}: {
  items?: string[];
}) {
  return (
    <div
      className="perspective-stage relative overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
      role="group"
      aria-label="Platforms supported by PortaD"
    >
      <div className="marquee flex w-max">
        <Row items={items} />
        <Row items={items} />
      </div>
    </div>
  );
}
