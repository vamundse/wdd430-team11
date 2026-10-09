type Tone = 'blue' | 'green' | 'red';

const TONES: Record<Tone, string> = {
  blue: 'bg-blue-50 text-blue-800',
  green: 'bg-emerald-50 text-emerald-800',
  red: 'bg-red-50 text-red-800',
};

type StatCardProps = {
  label: string;
  value: number;
  detail: string;
  tone: Tone;
};

export default function StatCard({ label, value, detail, tone }: StatCardProps) {
  return (
    <div className={`rounded-xl p-4 ${TONES[tone]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <p className="text-xs opacity-80">{detail}</p>
    </div>
  );
}