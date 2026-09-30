import React, { useState, useEffect } from 'react';
import { X, Calendar, ArrowRight } from 'lucide-react';

interface LandingPopupProps {
  reservationUrl: string;
}

const POPUP_IMAGE_URL = "https://res.cloudinary.com/dxjz9ksjg/image/upload/v1790737575/ChatGPT_%EC%9D%B4%EB%AF%B8%EC%A7%80_2026%EB%85%84_9%EC%9B%94_30%EC%9D%BC_%EC%98%A4%EC%A0%84_11_56_46_n73yqz.png";
const STORAGE_KEY = 'gumi_landing_popup_hide_until';

export const LandingPopup: React.FC<LandingPopupProps> = ({ reservationUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hideUntil = localStorage.getItem(STORAGE_KEY);
      if (hideUntil) {
        const expiryTime = parseInt(hideUntil, 10);
        if (!isNaN(expiryTime) && Date.now() < expiryTime) {
          // Suppressed for today
          return;
        }
      }
      setIsOpen(true);
    } catch {
      // Fallback if localStorage is inaccessible
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleHideToday = () => {
    try {
      const now = new Date();
      // Set to 23:59:59.999 of the current day
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
      ).getTime();
      localStorage.setItem(STORAGE_KEY, endOfDay.toString());
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/70 backdrop-blur-[2px] transition-opacity duration-200 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="상담 안내 팝업"
    >
      <div 
        className="relative w-[94vw] max-w-[660px] sm:max-w-[700px] bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="창 닫기"
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm transition-all hover:scale-105 shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container if viewport height is limited */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {/* Image Content: 100% width, full image completely exposed with zero letterboxing */}
          <a
            href={reservationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block group relative cursor-pointer overflow-hidden isolate"
          >
            <img
              src={POPUP_IMAGE_URL}
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
            className="w-full py-3.5 sm:py-4 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-center text-sm sm:text-base flex items-center justify-center gap-2 transition-colors shadow-inner"
          >
            <Calendar className="w-5 h-5 text-emerald-100" />
            <span>상담예약하러 가기</span>
            <ArrowRight className="w-5 h-5 text-emerald-100" />
          </a>
        </div>

        {/* Bottom Bar: 오늘 하루 보지 않기 & 창 닫기 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-slate-300 text-xs sm:text-sm border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={handleHideToday}
            className="hover:text-white transition-colors py-1 px-1 flex items-center gap-1.5 underline-offset-2 hover:underline cursor-pointer"
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            onClick={handleClose}
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
