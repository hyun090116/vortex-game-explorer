import { Github, Twitter, Youtube, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-glass-border/20 py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-lg">V</span>
              </div>
              <span className="font-display font-bold text-xl tracking-wider gradient-text">
                VORTEX
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-4">
              차세대 게이밍 플랫폼. 전에 없던 게임 경험을 제공합니다.
            </p>
            <div className="flex items-center gap-3">
              <SocialLink href="#" icon={Twitter} />
              <SocialLink href="#" icon={Youtube} />
              <SocialLink href="#" icon={MessageCircle} />
              <SocialLink href="#" icon={Github} />
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-display font-semibold uppercase tracking-wider text-sm mb-4">
              스토어
            </h4>
            <ul className="space-y-2">
              <FooterLink>게임 둘러보기</FooterLink>
              <FooterLink>신작 게임</FooterLink>
              <FooterLink>베스트셀러</FooterLink>
              <FooterLink>출시 예정</FooterLink>
              <FooterLink>할인 중</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold uppercase tracking-wider text-sm mb-4">
              커뮤니티
            </h4>
            <ul className="space-y-2">
              <FooterLink>포럼</FooterLink>
              <FooterLink>리뷰</FooterLink>
              <FooterLink>가이드</FooterLink>
              <FooterLink>워크샵</FooterLink>
              <FooterLink>마켓</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold uppercase tracking-wider text-sm mb-4">
              고객지원
            </h4>
            <ul className="space-y-2">
              <FooterLink>고객센터</FooterLink>
              <FooterLink>문의하기</FooterLink>
              <FooterLink>환불 정책</FooterLink>
              <FooterLink>계정 관리</FooterLink>
              <FooterLink>기프트카드</FooterLink>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-glass-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-body">
            © 2024 VORTEX. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
              개인정보처리방침
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
              이용약관
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
              법적 고지
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
  <a 
    href={href}
    className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
  >
    <Icon className="w-4 h-4" />
  </a>
);

const FooterLink = ({ children }: { children: React.ReactNode }) => (
  <li>
    <a 
      href="#" 
      className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
    >
      {children}
    </a>
  </li>
);

export default Footer;
