import { TEXTS } from '@/look/constants/texts';
export default function Logo({ size = "text-3xl" }: { size?: string }) {
  return (
    <span className={`${size} font-extrabold tracking-tight text-main select-none`}>
      {TEXTS.COMPANY_NAME}
    </span>
  );
}