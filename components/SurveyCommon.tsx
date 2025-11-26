import React, { useState } from 'react';
import { Home, ChevronRight, ChevronDown } from 'lucide-react';
import { Affiliation, Theme, UserData } from '../types';

interface Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onHome: () => void;
}

const AFFILIATIONS: Affiliation[] = ['1학년', '2학년', '3학년', '전공심화', '교수님'];
const INTERESTS = [
  '브랜드 디자인', 'UIUX 디자인', '편집 디자인', '3D 디자인', '영상 디자인',
  '그래픽 디자인', '캐릭터 디자인', '타이포그래피', '패키지 디자인', '기타'
];
const THEMES: Theme[] = ['올해의 추억', '현재의 고민', '미래를 위한 다짐'];

const SurveyCommon: React.FC<Props> = ({ userData, updateUserData, onNext, onHome }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInterestChange = (interest: string) => {
    let newInterests = [...userData.interests];
    if (newInterests.includes(interest)) {
      newInterests = newInterests.filter(i => i !== interest);
    } else {
      if (newInterests.length >= 3) {
        alert('관심 분야는 최대 3개까지만 선택 가능합니다.');
        return;
      }
      newInterests.push(interest);
    }
    updateUserData({ interests: newInterests });
  };

  const validateAndNext = () => {
    if (!userData.name.trim()) return alert('이름을 입력해주세요.');
    if (!userData.affiliation) return alert('소속을 선택해주세요.');
    if (userData.interests.length === 0) return alert('관심 분야를 최소 1개 선택해주세요.');
    if (!userData.theme) return alert('작성 주제를 선택해주세요.');
    onNext();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-start pt-32 items-center bg-slate-900">
       {/* Background */}
       <div className="absolute inset-0 z-0 bg-slate-900" />
      
      <div className="absolute top-8 z-20 text-white text-center w-full">
        <h2 className="text-4xl md:text-5xl font-bold font-tangerine">Holy Data Tree</h2>
        <p className="text-sm opacity-80 mt-1 font-noto">올 한해를 돌아보며 카드를 작성해주세요</p>
      </div>

      <div className="relative z-20 w-full max-w-md p-4">
        <div className="relative w-full bg-[#fdfdfd] shadow-2xl rounded-sm overflow-hidden min-h-[600px]">
           {/* Paper Texture */}
           <div className="absolute inset-0 bg-orange-50/20 opacity-50 pointer-events-none" />
           
           <div className="relative z-10 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar font-noto">
             {/* Q1 Name */}
             <div className="mb-6">
                <label className="block text-slate-700 font-bold mb-1 text-sm">Q1. 이름을 입력해주세요</label>
                <input 
                  type="text" 
                  value={userData.name}
                  onChange={(e) => updateUserData({ name: e.target.value })}
                  className="w-full border-b-2 border-slate-300 focus:border-red-800 outline-none py-1 bg-transparent text-sm text-slate-800 placeholder-slate-400"
                  placeholder="익명도 가능해요!"
                />
             </div>

             {/* Q2 Affiliation */}
             <div className="mb-6">
               <label className="block text-slate-700 font-bold mb-2 text-sm">Q2. 소속을 알려주세요</label>
               <div className="flex flex-wrap gap-2">
                 {AFFILIATIONS.map(aff => (
                   <button
                    key={aff}
                    onClick={() => updateUserData({ affiliation: aff })}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      userData.affiliation === aff 
                      ? 'bg-red-800 text-white border-red-800' 
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                   >
                     {aff}
                   </button>
                 ))}
               </div>
             </div>

             {/* Q3 Interests */}
             <div className="mb-6">
               <label className="block text-slate-700 font-bold mb-2 text-sm">
                 Q3. 관심 분야를 선택해주세요 <span className="text-xs font-normal text-red-600 ml-1">(최대 3개)</span>
               </label>
               <div className="grid grid-cols-2 gap-2">
                 {INTERESTS.map(interest => (
                   <label key={interest} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                     <input 
                      type="checkbox" 
                      checked={userData.interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      className="accent-red-800"
                     />
                     <span>{interest}</span>
                   </label>
                 ))}
               </div>
             </div>

             {/* Q4 Theme */}
             <div className="mb-6 relative">
               <label className="block text-slate-700 font-bold mb-2 text-sm">Q4. 작성 주제를 선택해주세요</label>
               <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center border-b-2 border-slate-300 py-1 text-sm bg-transparent focus:outline-none"
               >
                 <span className={userData.theme ? 'text-slate-800 font-bold' : 'text-slate-500'}>
                   {userData.theme || '주제를 선택해주세요'}
                 </span>
                 <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
               </button>
               
               {isDropdownOpen && (
                 <div className="absolute z-50 w-full bg-white border border-slate-200 shadow-lg mt-1 rounded-md overflow-hidden">
                   {THEMES.map(theme => (
                     <div 
                      key={theme}
                      onClick={() => {
                        updateUserData({ theme });
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0"
                     >
                       {theme}
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex space-x-4 w-full justify-center">
            <button onClick={onHome} className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 flex items-center transition-all">
                <Home className="mr-1 w-4 h-4" /> Home
            </button>
            <button onClick={validateAndNext} className="bg-slate-900 text-white px-8 py-2 rounded-full hover:bg-slate-700 shadow-lg font-bold text-lg flex items-center">
                Next <ChevronRight className="ml-1 w-5 h-5" />
            </button>
        </div>

      </div>
    </section>
  );
};

export default SurveyCommon;
