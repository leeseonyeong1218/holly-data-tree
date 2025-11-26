
import React from 'react';
import SnowEffect from './SnowEffect';

interface Props {
  onStart: () => void;
}

const MainPage: React.FC<Props> = ({ onStart }) => {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center bg-slate-900 overflow-hidden">
      {/* Background with fallback */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 opacity-90" />
      </div>

      {/* Snow Effect */}
      <SnowEffect />

      <div className="relative z-20 text-white px-4 text-center -mt-20">
        <h1 className="text-[4.5rem] md:text-[5.5rem] font-bold drop-shadow-lg text-white font-tangerine tracking-wider mb-4">
          Holy Data Tree
        </h1>
        <p className="text-sm md:text-base mb-12 opacity-90 font-light font-noto">
          서로의 감정으로 완성되는 시각디자인과 한 해의 기록
        </p>

        <button 
          onClick={onStart} 
          className="bg-white text-slate-900 px-8 py-3 rounded-full text-sm font-bold transition-all transform hover:scale-105 shadow-lg hover:bg-yellow-50 hover:shadow-[0_0_20px_rgba(253,224,71,0.6)] duration-300"
        >
          기록하러 가기
        </button>
      </div>
    </section>
  );
};

export default MainPage;
