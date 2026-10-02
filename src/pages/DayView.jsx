import React, { lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

// Lazy load memory interactions
const FirstMeetupDay = lazy(() => import('../components/interactions/FirstMeetupDay'));
const KoilKeychainDay = lazy(() => import('../components/interactions/KoilKeychainDay'));
const CopperKitchenDay = lazy(() => import('../components/interactions/CopperKitchenDay'));
const MuttonBiriyaniDay = lazy(() => import('../components/interactions/MuttonBiriyaniDay'));
const ChocolateMilkshakeDay = lazy(() => import('../components/interactions/ChocolateMilkshakeDay'));
const AutoSignDay = lazy(() => import('../components/interactions/AutoSignDay'));
const GodBlessDay = lazy(() => import('../components/interactions/GodBlessDay'));
const MemoryVaultDay = lazy(() => import('../components/interactions/MemoryVaultDay'));

const DayView = () => {
  const { dayId } = useParams();
  const dayIndex = parseInt(dayId);

  // Map index to component
  const renderInteraction = () => {
      switch(dayIndex) {
          case 0: return <FirstMeetupDay />;
          case 1: return <KoilKeychainDay />;
          case 2: return <CopperKitchenDay />;
          case 3: return <MuttonBiriyaniDay />;
          case 4: return <ChocolateMilkshakeDay />;
          case 5: return <AutoSignDay />;
          case 6: return <GodBlessDay />;
          case 7: return <MemoryVaultDay />;
          default: return <div className="text-amber-300">Quest not found...</div>;
      }
  };

  if (isNaN(dayIndex)) return <div className="text-center p-8 text-amber-300">Memory not found</div>;

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Top Navigation */}
      <div className="p-4 pb-2 flex justify-start">
        <Link to="/" className="inline-flex items-center gap-2 bg-[#26233a] border-2 border-[#eb6f92] px-3 py-1 text-xs text-[#eb6f92] hover:bg-[#eb6f92] hover:text-[#191724] transition-colors shadow">
          <ArrowLeft size={16} />
          <span className="font-bold">Back to Map</span>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center"
        >
           <Suspense fallback={<div className="text-amber-400 font-pixel text-xs animate-pulse">LOADING MEMORY QUEST...</div>}>
               {renderInteraction()}
           </Suspense>
        </motion.div>
      </div>
    </div>
  );
};

export default DayView;
