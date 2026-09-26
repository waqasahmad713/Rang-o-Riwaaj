export const womenChart = {
  headers: ["Size", "Bust", "Waist", "Hips", "Shirt Length"],
  rows: [
    ["XS", '32"', '26"', '35"', '40"'],
    ["S", '34"', '28"', '37"', '41"'],
    ["M", '36"', '30"', '39"', '42"'],
    ["L", '39"', '33"', '42"', '43"'],
    ["XL", '42"', '36"', '45"', '44"'],
  ],
};

export const menChart = {
  headers: ["Size", "Chest", "Shoulder", "Kameez Length", "Sleeve"],
  rows: [
    ["S", '38"', '17"', '40"', '23.5"'],
    ["M", '40"', '18"', '41"', '24"'],
    ["L", '42"', '19"', '42"', '24.5"'],
    ["XL", '44"', '20"', '43"', '25"'],
    ["XXL", '46"', '21"', '44"', '25.5"'],
  ],
};

function Chart({ chart, caption }: { chart: typeof womenChart; caption: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <caption className="mb-3 text-left text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">{caption}</caption>
        <thead>
          <tr className="border-b border-ink">
            {chart.headers.map((h) => (
              <th key={h} scope="col" className="py-2.5 pr-4 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chart.rows.map((r) => (
            <tr key={r[0]} className="border-b border-line">
              {r.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-2.5 pr-4 font-semibold">
                    {c}
                  </th>
                ) : (
                  <td key={i} className="py-2.5 pr-4 text-ink-soft">
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SizeGuideContent({ which }: { which?: "women" | "men" | "both" }) {
  const show = which ?? "both";
  return (
    <div className="space-y-8">
      {(show === "women" || show === "both") && <Chart chart={womenChart} caption="Women · Body measurements (inches)" />}
      {(show === "men" || show === "both") && <Chart chart={menChart} caption="Men · Tailoring reference (inches) — menswear is unstitched" />}
      <div className="grid gap-4 bg-sand p-5 text-sm text-ink-soft sm:grid-cols-2">
        <div>
          <h3 className="mb-1 font-sans text-sm font-semibold text-ink">How to measure</h3>
          <ul className="list-disc space-y-1 pl-4">
            <li>Bust/Chest — around the fullest part</li>
            <li>Waist — around your natural waistline</li>
            <li>Hips — around the fullest part</li>
            <li>Length — from the shoulder to the hem</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-1 font-sans text-sm font-semibold text-ink">Between sizes?</h3>
          <p>Choose the larger size for relaxed cuts and the smaller size for fitted styles. Our team can advise on WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}
