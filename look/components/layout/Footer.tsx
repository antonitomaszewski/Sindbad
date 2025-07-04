import Container from '../ui/Container';
import Logo from '../ui/Logo';
import FooterLinkSection from '../ui/FooterLinkSection';
import { ACTIVITIES_LINKS, HELP_LINKS } from '@/look/constants/navigation';
import { TEXTS } from '@/look/constants/texts';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray py-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Logo i opis */}
          <div className="flex flex-col gap-4">
            <Logo size="text-2xl" />
            <p className="text-gray max-w-sm">
              {TEXTS.FOOTER_DESCRIPTION}
            </p>
          </div>

          {/* Linki */}
          <div className="flex gap-12">
            <FooterLinkSection title={TEXTS.ACTIVITIES_SECTION} links={ACTIVITIES_LINKS} />
            <FooterLinkSection title={TEXTS.HELP_SECTION} links={HELP_LINKS} />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray mt-8 pt-6 text-center">
          <p className="text-gray text-sm">{TEXTS.COPYRIGHT}</p>
        </div>
      </Container>
    </footer>
  );
}