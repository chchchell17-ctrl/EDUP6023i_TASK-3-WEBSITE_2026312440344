import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Hand,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TRAFFIC_LIGHT_STATIONS } from '../../data/screen09Data.ts';
import type { Screen09Progress } from '../../types/game.ts';
import {
  playLoginSuccess,
  playPortalOpen,
  playVictorySound,
} from '../../utils/soundEffects.ts';

interface TrafficLightActivityProps {
  initialExplored: Screen09Progress['trafficLightExplored'];
  onUpdateExplored: (explored: Screen09Progress['trafficLightExplored']) => void;
  onFinishTrafficLight: () => void;
}

export const TrafficLightActivity: React.FC<TrafficLightActivityProps> = ({
  initialExplored,
  onUpdateExplored,
  onFinishTrafficLight,
}) => {
  const [explored, setExplored] = useState(initialExplored);
  const [activeStationId, setActiveStationId] = useState<'redStop' | 'yellowCheck' | 'greenDecide'>(
    'redStop'
  );

  const allThreeLit = explored.redStop && explored.yellowCheck && explored.greenDecide;

  const handleTapStation = (id: 'redStop' | 'yellowCheck' | 'greenDecide') => {
    setActiveStationId(id);
    if (!explored[id]) {
      const next = { ...explored, [id]: true };
      setExplored(next);
      onUpdateExplored(next);
      if (next.redStop && next.yellowCheck && next.greenDecide) {
        playVictorySound();
      } else {
        playLoginSuccess();
      }
    } else {
      playLoginSuccess();
    }
  };

  const activeStation =
    TRAFFIC_LIGHT_STATIONS.find((s) => s.id === activeStationId) ?? TRAFFIC_LIGHT_STATIONS[0];

  return (
    <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-5 pb-8 pointer-events-auto">
      <div className="rounded-[32px] border-2 border-white bg-white/95 p-5 sm:p-7 shadow-[0_24px_60px_-10px_rgba(21,128,61,0.34)] space-y-5">
        <div className="text-center space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97706]">
            SCENE 02 · THE GOLDEN DIGITAL RULE
          </p>
          <h2 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[#0E3558]">
            STOP, CHECK, DECIDE Traffic Light!
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#475569]">
            Tap each glowing traffic light station below to light up the whole Digital Safety
            Traffic Light!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Traffic Light Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="rounded-[38px] bg-slate-900 border-4 border-white shadow-2xl p-5 flex flex-col items-center gap-4">
              {TRAFFIC_LIGHT_STATIONS.map((station) => {
                const isLit = explored[station.id] || allThreeLit;
                const isSelected = activeStationId === station.id;
                const Icon =
                  station.id === 'redStop'
                    ? Hand
                    : station.id === 'yellowCheck'
                      ? Search
                      : ShieldCheck;

                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => handleTapStation(station.id)}
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      isLit
                        ? `bg-gradient-to-b ${station.bgGrad} text-white border-white shadow-xl scale-105`
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                    } ${isSelected ? 'ring-4 ring-sky-300' : ''}`}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="text-xs font-extrabold tracking-wider">
                      {station.shortLabel}
                    </span>
                    {explored[station.id] && (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Light Details Card */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div
              className={`rounded-[26px] border-2 ${activeStation.border} bg-white p-5 sm:p-6 shadow-md space-y-3`}
            >
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-extrabold ${activeStation.pillBg}`}
              >
                {activeStation.colorName}
              </span>

              <h3 className="font-[var(--font-display)] text-lg sm:text-xl font-bold text-[#0E3558]">
                {activeStation.headline}
              </h3>

              {'detail' in activeStation && activeStation.detail && (
                <p className="text-sm font-semibold text-[#334155] leading-relaxed">
                  {activeStation.detail}
                </p>
              )}

              {'points' in activeStation && activeStation.points && (
                <ul className="space-y-1.5 pt-1">
                  {activeStation.points.map((pt) => (
                    <li
                      key={pt}
                      className="rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2 text-xs sm:text-sm font-bold text-[#92400E]"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {allThreeLit ? (
              <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-400 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#14532D]">
                  <Sparkles className="h-5 w-5 text-[#16A34A]" />
                  <span>All 3 Traffic Light Stations Illuminated!</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPortalOpen();
                    onFinishTrafficLight();
                  }}
                  className="aero-glossy-btn min-h-[46px] rounded-full bg-gradient-to-b from-[#34D399] to-[#16A34A] px-6 py-2 text-xs sm:text-sm font-extrabold text-white inline-flex items-center gap-2 shadow cursor-pointer"
                >
                  <span>NEXT: MY DETECTIVE CHECK</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs font-bold text-[#475569]">
                Explored{' '}
                {Number(explored.redStop) + Number(explored.yellowCheck) + Number(explored.greenDecide)}{' '}
                of 3 stations — tap the remaining lights on the traffic signal!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
