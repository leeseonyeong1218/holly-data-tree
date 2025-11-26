import React, { useEffect, useState } from 'react';
import { getPostList, getComments, saveComment } from '../utils/api';
import { PostListItem, Comment } from '../types';
import { ASSETS } from '../constants';

interface Props {
  onBack: () => void;
  onGoRanking: () => void;
  onGoNewCard: () => void;
}

const CommentBoard: React.FC<Props> = ({ onBack, onGoRanking, onGoNewCard }) => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostListItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  
  // Comment Form State
  const [commentName, setCommentName] = useState('');
  const [commentAffiliation, setCommentAffiliation] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const AFFILIATIONS = ["1학년", "2학년", "3학년", "전공심화", "교수님"];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getPostList();
    setPosts(data);
    setLoading(false);
  };

  const handlePostClick = async (post: PostListItem) => {
    setSelectedPost(post);
    setComments([]);
    setCommentName('');
    setCommentAffiliation('');
    setCommentContent('');
    setSendStatus('');
    
    setCommentLoading(true);
    const fetchedComments = await getComments(post.ID);
    setComments(fetchedComments);
    setCommentLoading(false);
  };

  const handleSendComment = async () => {
    if (!selectedPost) return;
    if (!commentName.trim()) return alert("닉네임을 입력해주세요.");
    if (!commentAffiliation) return alert("소속(학년)을 선택해주세요.");
    if (!commentContent.trim()) return alert("댓글 내용을 입력해주세요.");

    setSending(true);
    setSendStatus("전송 중...");
    
    const result = await saveComment(selectedPost.ID, commentName, commentAffiliation, commentContent);
    
    if (result.success) {
        setSendStatus("전송 완료!");
        setCommentContent('');
        // Refresh comments
        const updatedComments = await getComments(selectedPost.ID);
        setComments(updatedComments);
        setTimeout(() => setSendStatus(""), 2000);
    } else {
        setSendStatus("전송 실패");
        alert(result.message || "오류가 발생했습니다.");
    }
    setSending(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f20]/85 bg-cover bg-fixed font-noto"
         style={{ backgroundImage: `url('${ASSETS.rankingBg}')` }}>
         
         <div className="max-w-6xl mx-auto p-4">
             {/* Header */}
            <div className="text-center mb-10 pt-10">
                <h2 className="text-7xl font-playfair font-bold mb-4 text-[#C5A059]">Share</h2>
                <p className="text-base text-[#C5A059]">"고민이 담긴 카드에 당신의 응원을 선물해주세요."</p>
            </div>

            {/* Post List */}
            <div 
                id="post-list-area" 
                className="w-full md:w-2/3 mx-auto h-[530px] overflow-y-auto p-4 shadow-xl mb-12 rounded-2xl border border-white/10 bg-[#0b0f20]/85 custom-gold-scroll"
            >
                {loading ? (
                    <p className="text-center text-white mt-10">글 목록을 불러오는 중...</p>
                ) : posts.length === 0 ? (
                    <p className="text-center text-white mt-10">아직 작성된 카드가 없습니다.</p>
                ) : (
                    posts.map(post => (
                        <div 
                            key={post.ID}
                            onClick={() => handlePostClick(post)}
                            className="cursor-pointer p-5 border-b border-white/10 hover:bg-white/10 transition-colors rounded-lg mb-1"
                        >
                            <p className="text-sm text-gray-300 mb-1">ID : {post.Name}</p>
                            <p className="text-xl font-bold text-white">Title : {post.Title}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center w-full md:w-2/3 mx-auto pb-10">
                <button 
                    onClick={onGoNewCard}
                    className="bg-[#d6d6d6] text-[#4a2d2d] px-8 py-2 rounded-full font-bold shadow hover:bg-[#b0b0b0] hover:-translate-y-0.5 transition-all"
                >
                    ← 새 카드 작성
                </button>
                <button 
                    onClick={onGoRanking}
                    className="bg-[#C9302C] text-white px-8 py-2 rounded-full font-bold shadow hover:bg-[#a92522] hover:-translate-y-0.5 transition-all"
                >
                    랭킹 보기 →
                </button>
            </div>
            
            {/* Back to Tree Button (Extra) */}
            <div className="text-center pb-10">
                <button 
                     onClick={onBack}
                     className="text-white underline hover:text-[#C5A059] transition-colors"
                >
                    돌아가기
                </button>
            </div>
         </div>

         {/* Modal */}
         {selectedPost && (
            <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-[9999] p-4" onClick={() => setSelectedPost(null)}>
                <div 
                    className="flex flex-col md:flex-row w-full max-w-[1500px] h-[85vh] gap-6 justify-center items-stretch relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Left: Letter Content */}
                    <div 
                        className="flex-[1.5] h-full relative bg-contain bg-no-repeat bg-center pl-[15%] pr-[20%] pt-[8%] pb-[15%] overflow-hidden"
                        style={{ backgroundImage: `url('${ASSETS.modalBg}')`, backgroundSize: '100% 100%' }}
                    >
                         <div className="w-full h-full flex flex-col pt-[10%]">
                            <h2 className="font-noto font-bold text-left border-b-2 border-[#9d5050] pb-3 mb-2 text-xl text-[#4a2d2d]">
                                {selectedPost.Title}
                            </h2>
                            <p className="text-sm italic mb-4 text-right text-[#5c4040]">
                                From. {selectedPost.Name} ({selectedPost.Affiliation})
                            </p>
                            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar text-[#4a2d2d] whitespace-pre-wrap font-noto leading-8 text-sm"
                                 style={{
                                    backgroundImage: 'linear-gradient(to bottom, transparent 95%, #d6c0a0 95%)',
                                    backgroundSize: '100% 2.2rem',
                                    backgroundAttachment: 'local'
                                 }}
                            >
                                {selectedPost.Content}
                            </div>
                         </div>
                    </div>

                    {/* Right: Comments */}
                    <div className="w-full md:w-[550px] flex flex-col bg-[#1e233c]/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden font-noto">
                        <button 
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white text-3xl transition-colors z-50"
                        >
                            &times;
                        </button>

                        <div className="p-6 border-b border-white/10 bg-[#15192b]/50 shrink-0">
                            <h3 className="text-xl font-bold text-white">Cheer Up Message</h3>
                            <p className="text-xs text-gray-400 mt-1">따뜻한 응원의 한마디를 남겨주세요.</p>
                        </div>

                        <div id="comments-list" className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
                            {commentLoading ? (
                                <p className="text-center text-[#9d5050]">로딩 중...</p>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-gray-500 text-sm">댓글이 없습니다.</p>
                            ) : (
                                comments.map((c, idx) => (
                                    <div key={idx} className="bg-white/10 p-3 rounded-lg border border-white/10">
                                        <p className="text-sm font-bold text-[#C5A059] mb-1">{c.CommenterName} ({c.Affiliation})</p>
                                        <p className="text-white text-xs leading-relaxed">{c.CommentContent}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-4 bg-[#15192b]/80 border-t border-white/10 shrink-0">
                            <div className="mb-3 space-y-2">
                                <input 
                                    type="text"
                                    value={commentName}
                                    onChange={e => setCommentName(e.target.value)}
                                    className="w-full bg-white/5 border-b border-white/20 text-[#C5A059] text-sm py-1 px-2 focus:outline-none focus:border-[#C5A059] placeholder-white/30"
                                    placeholder="닉네임 (작성자 이름)"
                                />
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {AFFILIATIONS.map(aff => (
                                        <button
                                            key={aff}
                                            onClick={() => setCommentAffiliation(aff)}
                                            className={`text-xs px-2 py-1 rounded-full border transition-all ${
                                                commentAffiliation === aff
                                                ? 'bg-[#C5A059] text-white border-[#C5A059] font-bold'
                                                : 'bg-white/10 text-gray-400 border-white/20 hover:border-[#C5A059]'
                                            }`}
                                        >
                                            {aff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea
                                value={commentContent}
                                onChange={e => setCommentContent(e.target.value)}
                                rows={2}
                                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:border-[#C5A059] resize-none text-sm"
                                placeholder="응원 메시지를 입력하세요..."
                            />
                            <div className="text-right mt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-400">{sendStatus}</span>
                                <button 
                                    onClick={handleSendComment}
                                    disabled={sending}
                                    className="bg-[#C9302C] hover:bg-[#a92522] text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md disabled:opacity-50"
                                >
                                    보내기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         )}
    </div>
  );
};

export default CommentBoard;