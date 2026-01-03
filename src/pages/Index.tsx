import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GameGrid from "@/components/GameGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>VORTEX - 차세대 게임 스토어</title>
        <meta 
          name="description" 
          content="전에 없던 게임 경험을 제공합니다. 몰입형 3D 프리뷰와 개인화된 추천으로 최신 게임을 발견하고 구매하세요."
        />
        <meta name="keywords" content="게임, 게이밍, 비디오 게임, 게임 스토어, 디지털 게임, PC 게임" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <GameGrid />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
