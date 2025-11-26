import React, { useEffect, useState } from 'react';
import { getInterestRanking } from '../utils/api';
import { RankingItem } from '../types';
import { ASSETS, OFFICIAL_CATEGORIES, RANK_IMAGES } from '../constants';

interface Props {
  onBack: () => void;
}

const RankingPage: React.FC<Props> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState('');
  const [rankingData, setRankingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRanking(activeFilter);
  }, [activeFilter]);

  const fetchRanking = async (filter: string) => {
    setLoading(true);
    const data = await getInterestRanking(filter);
    const processed = processRankingData(data);
    setRankingData(processed);
    setLoading(false);
  };

  const processRankingData = (rawData: RankingItem[]) => {
    const counts: Record<string, number> = {};
    OFFICIAL_CATEGORIES.forEach(cat => counts[cat] = 0);
    const details: Record<string, Set<string>> = { "기타": new Set() }; 

    rawData.forEach(item => {
        let name = item.Interest; 
        let cleanName = name.replace(/[\s\/]/g, '').toLowerCase(); 

        let targetCategory = "기타"; 

        if (cleanName.includes("브랜드")) targetCategory = "브랜드 디자인";
        else if (cleanName.includes("편집") || cleanName.includes("출판")) targetCategory = "편집/출판 디자인";
        else if (cleanName.includes("ui") || cleanName.includes("ux")) targetCategory = "UI/UX 디자인";
        else if (cleanName.includes("그래픽") || cleanName.includes("일러스트") || cleanName.includes("캐릭터")) targetCategory = "그래픽/일러스트레이션";
        else if (cleanName.includes("모션") || cleanName.includes("영상")) targetCategory = "모션/영상 디자인";
        else if (cleanName.includes("3d") || cleanName.includes("제품") || cleanName.includes("비주얼")) targetCategory = "3D/제품 비주얼라이제이션 디자인";
        else if (cleanName.includes("레터링") || cleanName.includes("활자")) targetCategory = "레터링/활자 디자인";
        else targetCategory = "기타";

        if (counts[targetCategory] !== undefined) {
            counts[targetCategory] += item.Count;
        }

        if (targetCategory === "기타") {
            details["기타"].add(name);
        }
    });

    const sortedRanking = Object.keys(counts)
        .map(key => ({ 
            Interest: key, 
            Count: counts[key],
            Details: key === "기타" ? Array.from(details["기타"]).join(", ") : ""
        }))
        .filter(item => item.Count > 0) 
        .sort((a, b) => b.Count - a.Count);

    return sortedRanking;
  };

  const renderRankCircle = (item: any, rank: number) => {
    const imgUrl = RANK_IMAGES[item.Interest] || ASSETS.defaultRankIcon;
    let sizeClass = "w-[120px] h-[120px]";
    let badgeClass = "w-[35px] h-[35px] text-base";
    let orderClass = "";

    if (rank === 1) {
        sizeClass = "w-[150px] h-[150px]";
        badgeClass = "w-[45px] h-[45px] text-xl";
        orderClass = "order-2 mb-[30px]";
    } else if (rank === 2) {
        orderClass = "order-1";
    } else {
        orderClass = "order-3";
    }

    return (
        <div key={rank} className={`flex flex-col items-center relative ${orderClass}`}>
            <div 
                className={`${sizeClass} rounded-full bg-white bg-no-repeat bg-center shadow-lg border-[3px] border-transparent relative z-10`}
                style={{ backgroundImage: `url('${imgUrl}')`, backgroundSize: rank === 1 ? '85%' : '70%' }}
            >
                <div className={`absolute top-0 left-0 -translate-x-[10%] -translate-y-[10%] bg-[#C0392B] text-white rounded-full flex justify-center items-center font-bold shadow-sm z-20 ${badgeClass}`}>
                    {rank}
                </div>
            </div>
            
            <div className="mt-[-15px] bg-[#C0392B] text-white px-4 py-2 rounded-full font-bold text-sm z-20 shadow-md min-w-[80px] max-w-[140px] text-center whitespace-normal leading-tight break-keep">
                {item.Interest}
            </div>
            
            <div className="text-[#d1c4a0] text-sm font-bold mt-[15px] relative">
                <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 w-px h-[10px] bg-white/50"></div>
                {item.Count}표
            </div>
        </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f20] bg-cover bg-fixed font-noto overflow-y-auto"
         style={{ backgroundImage: `url('${ASSETS.rankingBg}')` }}>
        
        <div className="bg-[#0b0f20]/85 min-h-[80vh] max-w-6xl mx-auto p-4 md:p-10">
            <div className="text-center mb-10 pt-10">
                <h2 className="text-7xl font-playfair font-bold mb-4 text-[#C5A059]">Rank</h2>
                <p className="text-base text-[#C5A059]">"다른 사람들은 어떤 과목에 관심이 있는지 한번 알아보세요"</p>
            </div>

            {/* Filters */}
            <div className="flex justify-center gap-8 mb-12 flex-wrap">
                {['', '1학년', '2학년', '3학년', '전공심화'].map((label, idx) => {
                    const value = idx === 0 ? '' : label;
                    return (
                        <button
                            key={label}
                            onClick={() => setActiveFilter(value)}
                            className={`bg-transparent border-none text-[#888] text-lg font-bold pb-1 transition-all hover:text-white ${activeFilter === value ? 'text-white border-b-2 border-white' : ''}`}
                        >
                            {label || '전체 순위'}
                        </button>
                    )
                })}
            </div>

            {/* Top 3 */}
            <div className="flex justify-center items-end gap-8 mb-16 min-h-[250px] relative">
                {loading ? (
                    <p className="text-gray-400">집계 중...</p>
                ) : rankingData.length === 0 ? (
                    <p className="text-gray-400">데이터가 없습니다.</p>
                ) : (
                    <>
                        {rankingData[1] && renderRankCircle(rankingData[1], 2)}
                        {rankingData[0] && renderRankCircle(rankingData[0], 1)}
                        {rankingData[2] && renderRankCircle(rankingData[2], 3)}
                    </>
                )}
            </div>

            {/* Full List */}
            {!loading && rankingData.length > 3 && (
                <div className="bg-[#0b0f20]/85 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto mb-12 shadow-xl border border-white/10 text-[#d1c4a0]">
                    {rankingData.slice(3).map((item, idx) => (
                        <div key={idx} className="flex items-center py-4 border-b border-white/10 last:border-0 relative group">
                            <span className="text-2xl font-black w-12 text-[#C5A059]">{idx + 4}</span>
                            <span className="flex-grow text-lg font-bold text-white text-left">{item.Interest}</span>
                            <span className="text-sm text-[#aaa] font-bold">{item.Count}표</span>
                            
                            {/* Tooltip for 'Others' details */}
                            {item.Interest === "기타" && item.Details && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-black/90 text-white text-xs p-2 rounded border border-[#C5A059] shadow-lg z-50 whitespace-pre-wrap">
                                    {item.Details}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="text-center mt-12 mb-10 relative z-50">
                <button 
                    onClick={onBack}
                    className="bg-[#d6d6d6] text-[#4a2d2d] px-8 py-2 rounded-full border-none font-corinthia font-bold text-3xl shadow-md hover:bg-[#C5A059] hover:text-white hover:-translate-y-0.5 transition-all"
                >
                    ← Holly Data Tree
                </button>
            </div>
        </div>
    </div>
  );
};

export default RankingPage;