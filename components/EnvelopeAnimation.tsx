import React, { useEffect, useState } from 'react';
import { UserData } from '../types';

interface Props {
  userData: UserData;
  onAnimationComplete: () => void;
}

const EnvelopeAnimation: React.FC<Props> = ({ userData, onAnimationComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence:
    // 0: Initial
    // 1: Paper slides in (0.8s)
    // 2: Envelope closes (1.6s)
    // 3: Navigate away (3.0s)

    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => onAnimationComplete(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onAnimationComplete]);

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center bg-slate-900">
      <div className="relative w-80 md:w-96 aspect-[1.4/1]">
        
        {/* Open Envelope Layer */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${step >= 2 ? 'opacity-0' : 'opacity-100'}`}>
          {/* Back of envelope */}
          <div className="absolute inset-0 bg-[#e0e0e0] border-2 border-slate-300 transform scale-y-100 origin-bottom" 
               style={{ clipPath: 'polygon(0% 100%, 100% 100%, 50% 50%)', backgroundColor: '#d1d5db', zIndex: 0 }}></div>
          
           {/* Flap open */}
           <div className="absolute top-0 left-0 w-full h-1/2 bg-[#d1d5db] border-t-2 border-slate-300 origin-top transform -scale-y-100" 
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)', zIndex: 0 }}></div>

          {/* The Letter Paper */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 bg-white w-[90%] h-[120%] shadow-md p-4 z-10 transition-all duration-[1000ms] ease-in-out
              ${step >= 1 ? 'top-4 translate-y-1/3 scale-75 opacity-0' : '-top-24'}`}
          >
            <div className="w-full h-full border border-slate-100 p-2 overflow-hidden">
               <p className="text-[8px] text-slate-500">{userData.content}</p>
            </div>
          </div>

          {/* Front of envelope */}
          <div className="absolute bottom-0 left-0 w-full h-full z-20 pointer-events-none">
             <div className="absolute inset-0 bg-white border-2 border-slate-200"
                  style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%, 0% 100%, 100% 100%)' }}>
                  {/* Simplistic CSS envelope front representation */}
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#e5e7eb]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}></div>
                  <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[#d1d5db]" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 50%)' }}></div>
                  <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[#d1d5db]" style={{ clipPath: 'polygon(100% 100%, 100% 0, 0 50%)' }}></div>
             </div>
          </div>
        </div>

        {/* Closed Envelope Layer */}
        <div className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
           <div className="w-full h-full bg-[#e5e7eb] relative shadow-2xl rounded-sm flex items-center justify-center">
              <div className="border-t-[50px] border-r-[150px] border-l-[150px] border-transparent border-t-red-800/20 absolute top-0"></div>
              <div className="text-slate-500 font-tangerine text-4xl">To. Data Tree</div>
           </div>
        </div>
      </div>

      <div className="absolute bottom-20 text-white text-center animate-pulse mt-8 font-noto">
        {step < 2 ? '봉투에 담는 중...' : '트리에 메시지가 걸렸어요!'}
      </div>
    </section>
  );
};

export default EnvelopeAnimation;
