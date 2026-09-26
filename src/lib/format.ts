const pkr = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

export const formatPrice = (n: number) => `Rs. ${pkr.format(Math.round(n))}`;

export const formatDate = (iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) =>
  new Date(iso).toLocaleDateString("en-GB", opts);

/** Adds working days (Mon–Sat) to a date. */
export const addWorkingDays = (from: Date, days: number) => {
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) added++;
  }
  return d;
};

export const deliveryWindow = ([min, max]: [number, number], from = new Date()) => {
  const f = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return `${f(addWorkingDays(from, min))} – ${f(addWorkingDays(from, max))}`;
};

export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
