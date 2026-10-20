import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
  Filter,
  Brain,
} from 'lucide-react';
import { EXAM_DOMAINS } from '../data/domains';
import { DomainId } from '../types';

interface Flashcard {
  id: string;
  domainId: DomainId;
  term: string;
  definition: string;
  examTrap: string;
  analogy: string;
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 'fc-1',
    domainId: 'domain_1',
    term: 'High Availability (HA)',
    definition: 'Designing systems to ensure maximum uptime without significant service interruption, usually backed by an SLA percentage (e.g., 99.99%).',
    examTrap: 'HA is NOT Disaster Recovery. HA protects against local hardware breakdowns; DR protects against catastrophic regional disasters.',
    analogy: 'Having two fuel tanks in a long-distance bus so the engine keeps running if one fuel line clogs.',
  },
  {
    id: 'fc-2',
    domainId: 'domain_1',
    term: 'Scalability vs. Elasticity',
    definition: 'Scalability is the ability to handle increased workload (scaling up or out). Elasticity is the automated, dynamic allocation of resources during demand peaks and valleys.',
    examTrap: 'Scalability is capacity capability; Elasticity is automatic real-time scaling out and in.',
    analogy: 'Scalability is a taxi fleet capable of operating 100 cars. Elasticity is calling extra drivers onto the road at 8 AM and sending them home at 11 AM automatically.',
  },
  {
    id: 'fc-3',
    domainId: 'domain_1',
    term: 'Shared Responsibility Model',
    definition: 'A framework dividing security tasks between Microsoft and the customer depending on whether you use IaaS, PaaS, or SaaS.',
    examTrap: 'In ALL cloud models (even SaaS), the CUSTOMER is ALWAYS responsible for data, credentials, and endpoint devices.',
    analogy: 'Renting an apartment: the landlord maintains the building structure, but you are always responsible for locking your doors and protecting your valuables.',
  },
  {
    id: 'fc-4',
    domainId: 'domain_1',
    term: 'CapEx vs. OpEx',
    definition: 'CapEx: upfront spending on physical servers and real estate with depreciation. OpEx: pay-as-you-go operational expenses deducted in the current tax year.',
    examTrap: 'Cloud computing shifts IT budgeting from CapEx to OpEx with consumption pricing.',
    analogy: 'Buying a commercial generator (CapEx) vs paying the monthly power utility bill for units consumed (OpEx).',
  },
  {
    id: 'fc-5',
    domainId: 'domain_2',
    term: 'Availability Zones',
    definition: 'Physically separated datacenters within the SAME Azure region, each equipped with independent power, cooling, and networking.',
    examTrap: 'Availability Zones are within one region (low latency). Region Pairs are separated by at least 300 miles.',
    analogy: 'Three branches of the same bank in Westlands, Upperhill, and Kilimani connected by private fiber optic cable.',
  },
  {
    id: 'fc-6',
    domainId: 'domain_2',
    term: 'Region Pairs',
    definition: 'Each Azure region is paired with another region in the same geography (at least 300 miles apart) for coordinated sequential updates and disaster recovery.',
    examTrap: 'Microsoft updates paired regions sequentially to prevent global platform outages.',
    analogy: 'A company storing active files in Nairobi and keeping mirrored offsite backups in Mombasa for hurricane/emergency resilience.',
  },
  {
    id: 'fc-7',
    domainId: 'domain_2',
    term: 'Resource Group Lifecycle Rule',
    definition: 'A logical container that holds related Azure resources. Deleting a resource group automatically cascades and deletes every resource within it.',
    examTrap: 'A resource can ONLY belong to ONE resource group at any given time.',
    analogy: 'A project folder on your computer: dragging the folder to the trash deletes all documents and spreadsheets inside it.',
  },
  {
    id: 'fc-8',
    domainId: 'domain_2',
    term: 'ExpressRoute',
    definition: 'A dedicated, private physical fiber connection between your on-premises datacenter and Microsoft Azure that completely bypasses the public internet.',
    examTrap: 'ExpressRoute does NOT travel over the public internet, unlike VPNs which create encrypted tunnels across public networks.',
    analogy: 'A private underground highway with dedicated security checkpoints vs driving on the public toll road.',
  },
  {
    id: 'fc-9',
    domainId: 'domain_2',
    term: 'Azure Blob Storage Archive Tier',
    definition: 'Ultra-low-cost storage tier for rarely accessed data that can tolerate retrieval (rehydration) delays of several hours.',
    examTrap: 'Archive tier data is NOT immediately readable; it must be rehydrated to Hot or Cool tier first.',
    analogy: 'Sending paper tax files to an offsite underground document archive vault.',
  },
  {
    id: 'fc-10',
    domainId: 'domain_2',
    term: 'Authentication vs. Authorization',
    definition: 'Authentication (AuthN) proves WHO you are. Authorization (AuthZ) decides WHAT you are allowed to access and do.',
    examTrap: 'AuthN verifies identity; AuthZ checks permissions and RBAC roles.',
    analogy: 'Showing your National ID to enter a government office (AuthN) vs having security clearance to enter the Minister’s private boardroom (AuthZ).',
  },
  {
    id: 'fc-11',
    domainId: 'domain_3',
    term: 'Azure Policy vs. RBAC',
    definition: 'RBAC governs WHO can perform actions on resources. Azure Policy enforces WHAT properties, locations, or configurations resources must have.',
    examTrap: 'RBAC grants permissions; Azure Policy establishes compliance guardrails regardless of user role.',
    analogy: 'A driver’s license allows you to drive a car (RBAC); traffic speed limit laws dictate you cannot exceed 100 km/h (Policy).',
  },
  {
    id: 'fc-12',
    domainId: 'domain_3',
    term: 'Resource Locks (CanNotDelete vs ReadOnly)',
    definition: 'CanNotDelete allows modifying but prevents deleting. ReadOnly allows viewing but prevents modifying or deleting.',
    examTrap: 'Resource locks override RBAC Owner permissions! Even an Owner must delete the lock before deleting the resource.',
    analogy: 'A physical padlock on a master breaker switch that prevents accidental toggling.',
  },
];

const STORAGE_KEY_MASTERED = 'cloudready_flashcards_mastered_v1';
const STORAGE_KEY_NEEDS_REVIEW = 'cloudready_flashcards_needs_review_v1';

export const FlashcardCoach: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [filterNeedsReview, setFilterNeedsReview] = useState<boolean>(false);

  // Persistence for spaced repetition
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MASTERED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [needsReviewIds, setNeedsReviewIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_NEEDS_REVIEW);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const saveMastered = (ids: string[]) => {
    setMasteredIds(ids);
    localStorage.setItem(STORAGE_KEY_MASTERED, JSON.stringify(ids));
  };

  const saveNeedsReview = (ids: string[]) => {
    setNeedsReviewIds(ids);
    localStorage.setItem(STORAGE_KEY_NEEDS_REVIEW, JSON.stringify(ids));
  };

  // Filtered Cards
  const activeDeck = FLASHCARDS_DATA.filter((c) => {
    if (selectedDomain !== 'all' && c.domainId !== selectedDomain) return false;
    if (filterNeedsReview) return needsReviewIds.includes(c.id);
    return true;
  });

  const currentCard = activeDeck[currentIndex] || activeDeck[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < activeDeck.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : activeDeck.length - 1));
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    const newMastered = Array.from(new Set([...masteredIds, currentCard.id]));
    const newReview = needsReviewIds.filter((id) => id !== currentCard.id);
    saveMastered(newMastered);
    saveNeedsReview(newReview);
    handleNext();
  };

  const handleMarkNeedsReview = () => {
    if (!currentCard) return;
    const newReview = Array.from(new Set([...needsReviewIds, currentCard.id]));
    const newMastered = masteredIds.filter((id) => id !== currentCard.id);
    saveNeedsReview(newReview);
    saveMastered(newMastered);
    handleNext();
  };

  // Keyboard shortcuts for effortless card flipping and navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input or textarea is active
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleMarkNeedsReview();
      } else if (e.key === '2') {
        e.preventDefault();
        handleMarkMastered();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDeck, currentIndex, isFlipped, currentCard]);



  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
          <Brain className="w-4 h-4" />
          <span>Challenge: Flashcard Coach & Spaced Repetition</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          AZ-900 Memory & Concept Coach
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Revise high-yield terms, exam traps, and analogies. Focus your study on concepts you keep missing.
        </p>
      </div>

      {/* Filter and Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => {
              setSelectedDomain('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedDomain === 'all' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({FLASHCARDS_DATA.length})
          </button>
          {EXAM_DOMAINS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDomain(d.id);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedDomain === d.id ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {d.shortTitle}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setFilterNeedsReview((prev) => !prev);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 cursor-pointer ${
            filterNeedsReview
              ? 'bg-rose-50 border-rose-300 text-rose-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Focus on Difficult ({needsReviewIds.length})</span>
        </button>
      </div>

      {activeDeck.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Zero Difficult Cards Remaining!</h3>
          <p className="text-xs text-slate-500">
            You have marked all cards in this category as mastered. Toggle off the filter to review all cards.
          </p>
          <button
            onClick={() => setFilterNeedsReview(false)}
            className="px-4 py-2 text-xs font-bold text-white bg-sky-600 rounded-lg cursor-pointer"
          >
            View Full Deck
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress Counters */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Card <strong className="text-slate-800">{currentIndex + 1}</strong> of{' '}
              <strong className="text-slate-800">{activeDeck.length}</strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-700 font-semibold">{masteredIds.length} Mastered</span>
              <span className="text-rose-700 font-semibold">{needsReviewIds.length} Need Review</span>
            </div>
          </div>

          {/* Instruction Pill */}
          <div className="flex items-center justify-between text-xs bg-sky-50 text-sky-800 border border-sky-100 rounded-lg px-3 py-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>
                <strong>How to flip:</strong> Click anywhere on the card, click the button below, or press <strong>Spacebar</strong>.
              </span>
            </span>
            <span className="text-[11px] font-semibold bg-white/80 px-2 py-0.5 rounded text-sky-900 border border-sky-200">
              {isFlipped ? 'Showing Back' : 'Showing Front'}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className={`rounded-2xl p-6 sm:p-8 border-2 min-h-[320px] flex flex-col justify-between cursor-pointer transition-all shadow-sm hover:shadow-md relative select-none ${
              isFlipped
                ? 'bg-slate-50/90 border-sky-300'
                : 'bg-white border-slate-200 hover:border-sky-300'
            }`}
          >
            {/* Card Top Meta */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sky-700 uppercase tracking-wider">
                  {EXAM_DOMAINS.find((d) => d.id === currentCard.domainId)?.shortTitle}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {isFlipped ? 'Side B: Answer' : 'Side A: Term'}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped((prev) => !prev);
                }}
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Show Front' : 'Flip Card'}</span>
              </button>
            </div>

            {/* Card Content (Front vs Back) */}
            <div className="my-auto py-4 text-center space-y-4">
              {!isFlipped ? (
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">
                    Core Azure Concept
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                    {currentCard.term}
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-sky-600 font-semibold bg-sky-50 px-3 py-1.5 rounded-full">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Click card or press Space to flip & see answer</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 text-left text-xs leading-relaxed">
                  <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-100 text-sky-950">
                    <span className="font-bold block mb-1 text-sky-900 text-xs uppercase tracking-wide">
                      📘 Definition & Role:
                    </span>
                    <p className="text-slate-800 text-xs sm:text-sm font-normal">
                      {currentCard.definition}
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    <span className="font-bold block mb-1 text-amber-900 text-xs uppercase tracking-wide">
                      ⚠️ Common AZ-900 Exam Trap:
                    </span>
                    <p className="text-slate-800 text-xs sm:text-sm font-normal">
                      {currentCard.examTrap}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-slate-700 shadow-2xs">
                    <span className="font-bold block mb-1 text-slate-900 text-xs uppercase tracking-wide">
                      🌍 Real-World Analogy:
                    </span>
                    <p className="text-slate-700 text-xs sm:text-sm font-normal">
                      {currentCard.analogy}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card Hint */}
            <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>{isFlipped ? 'Click anywhere or tap Space to turn back' : 'Click anywhere or tap Space to turn over'}</span>
            </div>
          </div>

          {/* Prominent Flip Card Button */}
          <button
            type="button"
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {isFlipped
                ? '🔄 Flip Back to Concept (or press Space)'
                : '🔄 Flip Card to Reveal Definition & Exam Trap (or press Space)'}
            </span>
          </button>

          {/* Spaced Repetition Controls */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleMarkNeedsReview}
              className="px-4 py-3 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Still Learning [Key 1]</span>
            </button>

            <button
              onClick={handleMarkMastered}
              className="px-4 py-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mastered [Key 2]</span>
            </button>
          </div>

          {/* Next / Previous Navigation & Keyboard Hints */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous [←]</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600">Space</span>
              <span>Flip</span>
              <span className="mx-1">•</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600">1</span>
              <span>Review</span>
              <span className="mx-1">•</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600">2</span>
              <span>Master</span>
            </div>

            <button
              onClick={handleNext}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer font-medium transition-colors"
            >
              <span>Next [→]</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
