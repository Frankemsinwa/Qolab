import logoWordmark from '../../assets/hero-imgs/qolab logou.png';

interface QolabLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
}

export default function QolabLogo({ className = 'w-24 md:w-28', theme = 'light' }: QolabLogoProps) {
  const src = theme === 'dark' ? '/qolab-logo-dark.png' : logoWordmark;
  return <img src={src} alt="Qolab" className={`${className} h-auto select-none`} />;
}
