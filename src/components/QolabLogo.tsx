import qMark from '../../assets/hero-imgs/Q.png';

interface QolabLogoProps {
  markClassName?: string;
  textClassName?: string;
  tone?: 'light' | 'dark';
  divider?: boolean;
}

export default function QolabLogo({
  markClassName = 'h-8 md:h-10',
  textClassName = 'text-xs md:text-sm',
  tone = 'dark',
  divider = true,
}: QolabLogoProps) {
  const light = tone === 'light';
  return (
    <span className="inline-flex items-center gap-3">
      <img src={qMark} alt="" className={`${markClassName} w-auto`} />
      {divider && <span className={`w-px self-stretch ${light ? 'bg-white/30' : 'bg-black/15'}`} />}
      <span
        className={`font-display font-bold uppercase leading-none tracking-[0.22em] ${textClassName} ${
          light ? 'text-white' : 'text-[#1a1a1a]'
        }`}
      >
        Qolab
      </span>
    </span>
  );
}
