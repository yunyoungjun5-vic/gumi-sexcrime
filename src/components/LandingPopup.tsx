import React, { useState, useEffect } from 'react';
import { X, Calendar, ArrowRight, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingPopupProps {
  reservationUrl: string;
}

const FIRST_POPUP_IMAGE_URL = "https://res.cloudinary.com/dxjz9ksjg/image/upload/v1790737575/ChatGPT_%EC%9D%B4%EB%AF%B8%EC%A7%80_2026%EB%85%84_9%EC%9B%94_30%EC%9D%BC_%EC%98%A4%EC%A0%84_11_56_46_n73yqz.png";
const SECOND_POPUP_IMAGE_URL = "https://res.cloudinary.com/dxjz9ksjg/image/upload/v1792067983/%EC%A3%BC%EC%9A%94_%EB%B0%A9%EC%86%A1_%EC%96%B8%EB%A1%A0_%EA%B0%95%EC%A1%B0_%EC%83%81%EB%8B%B4%EC%84%BC%ED%84%B0_%ED%8F%AC%EC%8A%A4%ED%84%B0_e6ln84.png";

const STORAGE_KEY_FIRST = 'gumi_landing_popup_hide_until';
const STORAGE_KEY_SECOND = 'gumi_landing_popup_media_hide_until';

export const LandingPopup: React.FC<LandingPopupProps> = ({ reservationUrl }) => {
  const [activePopup, setActivePopup] = useState<'first' | 'second' | null>(null);

  const isSuppressed = (key: string): boolean => {
    try {
      const hideUntil = localStorage.getItem(key);
      if (hideUntil) {
        const expiryTime = parseInt(hideUntil, 10);
        if (!isNaN(expiryTime) && Date.now() < expiryTime) {
          return true;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
    return false;
  };

  const getEndOfDayTimestamp = () => {
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    ).getTime();
  };

  useEffect(() => {
    const firstSuppressed = isSuppressed(STORAGE_KEY_FIRST);
    const secondSuppressed = isSuppressed(STORAGE_KEY_SECOND);

    if (!firstSuppressed) {
      setActivePopup('first');
    } else if (!secondSuppressed) {
      setActivePopup('second');
    } else {
      setActivePopup(null);
    }
  }, []);

  const handleCloseFirst = (advanceToSecond: boolean = true) => {
    if (advanceToSecond && !isSuppressed(STORAGE_KEY_SECOND)) {
      setTimeout(() => {
        setActivePopup('second');
      }, 150);
    } else {
      setActivePopup(null);
    }
  };

  const handleHideTodayFirst = () => {
    try {
      localStorage.setItem(STORAGE_KEY_FIRST, getEndOfDayTimestamp().toString());
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    handleCloseFirst(true);
  };

  const handleCloseSecond = () => {
    setActivePopup(null);
  };

  const handleHideTodaySecond = () => {
    try {
      localStorage.setItem(STORAGE_KEY_SECOND, getEndOfDayTimestamp().toString());
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    setActivePopup(null);
  };

  if (!activePopup) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 animate-fadeIn"
      onClick={activePopup === 'first' ? () => handleCloseFirst(true) : handleCloseSecond}
      role="dialog"
      aria-modal="true"
      aria-label={activePopup === 'first' ? "상담 안내 팝업" : "방송 출연 및 강연 안내 팝업"}
    >
      <div 
        key={activePopup}
        className={
          activePopup === 'first'
            ? "relative w-[94vw] max-w-[660px] sm:max-w-[700px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 flex flex-col max-h-[94vh] animate-fadeIn"
            : "relative w-[94vw] max-w-[572px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 flex flex-col max-h-[94vh] animate-fadeIn"
        }
        style={
          activePopup === 'second'
            ? { maxWidth: 'min(572px, 94vw)' }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          type="button"
          onClick={activePopup === 'first' ? () => handleCloseFirst(true) : handleCloseSecond}
          aria-label="창 닫기"
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container if viewport height is limited */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {activePopup === 'first' ? (
            <>
              {/* First Popup Image: 100% width, full image completely exposed with zero letterboxing */}
              <a
                href={reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCloseFirst(true)}
                className="w-full block group relative cursor-pointer overflow-hidden isolate"
              >
                <img
                  src={FIRST_POPUP_IMAGE_URL}
                  alt="성범죄 가해자 상담 및 재범방지 교육 안내"
                  className="w-full h-auto block select-none transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="eager"
                />
              </a>

              {/* Action Button: 상담예약하러 가기 */}
              <a
                href={reservationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleCloseFirst(true)}
                className="w-full py-3.5 sm:py-4 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-center text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-inner"
              >
                <Calendar className="w-5 h-5 text-emerald-100" />
                <span>상담예약하러 가기</span>
                <ArrowRight className="w-5 h-5 text-emerald-100" />
              </a>
            </>
          ) : (
            <>
              {/* Second Popup: 방송 출연 · 언론 보도 · 강연 안내 */}
              <Link
                to="/media/appearance"
                onClick={handleCloseSecond}
                className="w-full block group relative cursor-pointer overflow-hidden isolate"
              >
                <img
                  src={SECOND_POPUP_IMAGE_URL}
                  alt="주요 방송 언론 보도 및 강연 안내 포스터"
                  className="w-full h-auto block select-none transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="eager"
                />
              </Link>

              {/* Action Button: 방송 출연 · 강연 기록보기 */}
              <Link
                to="/media/appearance"
                onClick={handleCloseSecond}
                className="w-full py-3.5 sm:py-4 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-center text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-inner"
              >
                <Tv className="w-5 h-5 text-indigo-100" />
                <span>방송 출연 · 강연 기록보기</span>
                <ArrowRight className="w-5 h-5 text-indigo-100" />
              </Link>
            </>
          )}
        </div>

        {/* Bottom Bar: 오늘 하루 보지 않기 & 창 닫기 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-slate-300 text-xs sm:text-sm border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={activePopup === 'first' ? handleHideTodayFirst : handleHideTodaySecond}
            className="hover:text-white transition-colors py-1 px-1 flex items-center gap-1.5 underline-offset-2 hover:underline cursor-pointer"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={activePopup === 'first' ? () => handleCloseFirst(true) : handleCloseSecond}
            className="hover:text-white font-semibold transition-colors py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
          >
            창 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPopup;
