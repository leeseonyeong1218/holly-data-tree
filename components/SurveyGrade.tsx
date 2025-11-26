import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UserData } from '../types';

interface Props {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const SurveyGrade: React.FC<Props> = ({ userData, updateUserData, onNext, onBack }) => {
  const validateAndFinish = () => {
    if (!userData.title.trim()) return alert('제목을 입력해주세요.');
    if (!userData.content.trim()) return alert('내용을 입력해주세요.');
    onNext();
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-start pt-32 items-center bg-slate-900">
      <div className="absolute top-8 z-20 text-white text-center w-full">
        <h2 className="text-4xl md:text-5xl font-bold font-tangerine">Holy Data Tree</h2>
        <p className="text-sm opacity-80 mt-1 font-noto">({userData.theme})</p>
      </div>

      <div className="relative z-20 w-full max-w-md p-4">
        <div className="relative w-full bg-[#fdfdfd] shadow-2xl rounded-sm aspect-[3/4] flex flex-col">
          {/* Texture */}
          <div className="absolute inset-0 bg-orange-50/20 opacity-50 pointer-events-none" />

          <div className="relative z-10 p-8 flex flex-col h-full font-noto">
            {/* Header Info */}
            <div className="mb-4 border-b border-gray-300 pb-2">
              <p className="text-xs text-slate-500">
                작성자: <span className="font-bold text-slate-800">{userData.name}</span> ({userData.affiliation})
              </p>
              <p className="text-xs text-slate-500 mt-1">
                주제: <span className="font-bold text-red-800">{userData.theme}</span>
              </p>
            </div>

            {/* Title */}
            <div className="mb-2">
              <input 
                type="text" 
                value={userData.title}
                onChange={(e) => updateUserData({ title: e.target.value })}
                className="w-full bg-transparent border-b border-slate-300 focus:border-red-800 outline-none py-1 text-lg text-slate-800 placeholder-slate-400 font-bold"
                placeholder="제목을 입력해주세요"
              />
            </div>

            {/* Content (Lined Textarea) */}
            <textarea 
              value={userData.content}
              onChange={(e) => updateUserData({ content: e.target.value })}
              className="flex-1 w-full bg-transparent resize-none outline-none border-none text-slate-700 text-sm leading-8"
              style={{
                backgroundImage: 'linear-gradient(transparent 1.95rem, rgba(110, 26, 26, 0.15) 1.95rem)',
                backgroundSize: '100% 2rem',
                backgroundAttachment: 'local'
              }}
              placeholder="이곳에 당신의 이야기를 적어주세요..."
            />
          </div>
        </div>

        <div className="mt-6 flex space-x-4 w-full justify-center">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 flex items-center transition-all">
                <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </button>
            <button onClick={validateAndFinish} className="bg-red-800 text-white px-8 py-2 rounded-full hover:bg-red-700 shadow-lg font-bold flex items-center transition-all">
                Finish <ChevronRight className="ml-1 w-4 h-4" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default SurveyGrade;
