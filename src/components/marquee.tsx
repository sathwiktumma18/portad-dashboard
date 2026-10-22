
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
      className="flex shrink-0 items-center gap-3 pr-3"
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="glass flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium text-frost-300 transition-colors hover:border-brand-400/40 hover:text-frost-50"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-400 to-ice-400"
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
      className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] [-webkit-mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
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
