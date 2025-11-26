import React, { useState } from 'react';
import { Step, UserData, OrnamentDesign } from './types';
import MainPage from './components/MainPage';
import SurveyCommon from './components/SurveyCommon';
import SurveyGrade from './components/SurveyGrade';
import EnvelopeAnimation from './components/EnvelopeAnimation';
import OrnamentCustomizer from './components/OrnamentCustomizer';
import TreeScene from './components/TreeScene';
import RankingPage from './components/RankingPage';
import CommentBoard from './components/CommentBoard';

const initialUserData: UserData = {
  name: '',
  affiliation: '', // Grade
  interests: [],
  theme: '',
  title: '',
  content: ''
};

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('main');
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [design, setDesign] = useState<OrnamentDesign | null>(null);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  // Helper to reset data and go to main
  const handleResetAndHome = () => {
    setUserData(initialUserData);
    setDesign(null);
    setStep('main');
  };

  const renderStep = () => {
    switch (step) {
      case 'main':
        return <MainPage onStart={() => {
            // Reset on start to be double sure
            setUserData(initialUserData);
            setStep('survey_common');
        }} />;
      
      case 'survey_common':
        return (
          <SurveyCommon 
            userData={userData}
            updateUserData={updateUserData}
            onNext={() => setStep('survey_grade')}
            onHome={handleResetAndHome}
          />
        );
      
      case 'survey_grade':
        return (
          <SurveyGrade
            userData={userData}
            updateUserData={updateUserData}
            onNext={() => setStep('animation')}
            onBack={() => setStep('survey_common')}
          />
        );

      case 'animation':
        return (
          <EnvelopeAnimation 
            userData={userData}
            onAnimationComplete={() => setStep('customize')}
          />
        );

      case 'customize':
        return (
          <OrnamentCustomizer 
            userData={userData}
            onConfirm={(selectedDesign) => {
              setDesign(selectedDesign);
              setStep('tree');
            }}
          />
        );

      case 'tree':
        return design ? (
          <TreeScene 
            userData={userData}
            userOrnamentDesign={design}
            onBack={handleResetAndHome}
            onGoRanking={() => setStep('ranking')}
            onGoComments={() => setStep('comments')}
          />
        ) : <div>Loading...</div>;

      case 'ranking':
        return <RankingPage onBack={() => {
            if (design) setStep('tree');
            else handleResetAndHome();
        }} />;

      case 'comments':
        return <CommentBoard 
            onBack={() => {
                if (design) setStep('tree');
                else handleResetAndHome();
            }}
            onGoRanking={() => setStep('ranking')}
            onGoNewCard={() => {
                handleResetAndHome();
                setTimeout(() => setStep('survey_common'), 0);
            }}
        />;

      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <main className="w-full min-h-screen">
      {renderStep()}
    </main>
  );
};

export default App;