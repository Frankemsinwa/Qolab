import logoWordmark from '../../assets/hero-imgs/qolab logou.png';

interface QolabLogoProps {
  className?: string;
}

export default function QolabLogo({ className = 'w-24 md:w-28' }: QolabLogoProps) {
  return <img src={logoWordmark} alt="Qolab" className={`${className} h-auto`} />;
}
