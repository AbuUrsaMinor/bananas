import { format } from 'date-fns';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Calendar } from './components/Calendar';
import { FruitCounter } from './components/FruitCounter';
import { DATE_FORMAT } from './constants';
import { testStore } from './store-test';
import { useFruitStore } from './store/fruitStore';

function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'counter'>('calendar');
  const [showAddFruitModal, setShowAddFruitModal] = useState(false);
  const today = new Date();
  const { addFruit } = useFruitStore();

  // For debugging - uncomment to clear storage
  // useEffect(() => {
  //   clearStorage();
  //   resetStore();
  //   console.log("Cleared storage and reset store on app start");
  // }, [resetStore]);

  // Calendar icon 
  const CalendarIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
      className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-ink-400'}`}>
      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
    </svg>
  );

  // Today/Counter icon
  const CounterIcon = ({ isActive }: { isActive: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
      className={`w-6 h-6 ${isActive ? 'text-accent' : 'text-ink-400'}`}>
      <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
  );

  // FAB Add icon
  const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  );

  const handleAddFruit = (fruit: 'banana' | 'apple' | 'orange') => {
    const todayStr = format(today, DATE_FORMAT);
    console.log('Adding fruit:', fruit, 'on', todayStr);
    addFruit(todayStr, fruit);
    setShowAddFruitModal(false);
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => activeTab === 'calendar' && setActiveTab('counter'),
    onSwipedRight: () => activeTab === 'counter' && setActiveTab('calendar'),
    preventScrollOnSwipe: true,
    trackMouse: false
  });

  return (
    <div className="h-full flex flex-col bg-surface-100">
      {/* Header - sticky */}
      <header className="h-14 flex items-center px-4 sticky top-0 z-10 bg-surface-0 bg-opacity-80 backdrop-blur-md shadow-sm">
        {activeTab === 'calendar' ? (
          <h1 className="text-lg font-medium text-ink-900">{format(today, 'MMMM yyyy')}</h1>
        ) : (
          <h1 className="text-lg font-medium text-ink-900">Today · {format(today, 'd MMMM yyyy')}</h1>
        )}
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 overflow-auto" {...swipeHandlers}>
        {activeTab === 'calendar' ? <Calendar /> : <FruitCounter />}
      </main>

      {/* Bottom navigation - fixed */}
      <nav className="h-14 flex items-center justify-around bg-surface-0 bg-opacity-90 backdrop-blur-md shadow-sm">
        <button
          onClick={() => setActiveTab('calendar')}
          className="flex flex-col items-center justify-center h-full px-4 py-1"
          aria-label="Calendar view"
        >
          <CalendarIcon isActive={activeTab === 'calendar'} />
          <span className={`text-xs mt-1 ${activeTab === 'calendar' ? 'text-accent' : 'text-ink-400'}`}>
            Calendar
          </span>
        </button>

        <button
          onClick={() => setActiveTab('counter')}
          className="flex flex-col items-center justify-center h-full px-4 py-1"
          aria-label="Today's fruits"
        >
          <CounterIcon isActive={activeTab === 'counter'} />
          <span className={`text-xs mt-1 ${activeTab === 'counter' ? 'text-accent' : 'text-ink-400'}`}>
            Today
          </span>
        </button>

        {/* Debug button - remove in production */}
        <button
          onClick={() => {
            testStore();
            console.log('Current fruits:', useFruitStore.getState().debug());
          }}
          className="flex flex-col items-center justify-center h-full px-4 py-1"
          aria-label="Test store"
        >
          <span className="text-xs">Debug</span>
        </button>
      </nav>

      {/* FAB - fixed */}
      <button
        onClick={() => setShowAddFruitModal(true)}
        className="fixed right-4 bottom-[72px] w-[56px] h-[56px] bg-accent text-white rounded-full flex items-center justify-center shadow-elevated active:scale-[0.97] transition-transform"
        aria-label="Add fruit"
      >
        <AddIcon />
      </button>

      {/* Add Fruit Modal */}
      {showAddFruitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div
            className="bg-surface-0 w-full max-w-md rounded-t-lg sm:rounded-lg shadow-lg p-4"
            style={{
              animation: 'slide-up 200ms cubic-bezier(.4,0,.2,1) forwards'
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-ink-900">Add fruit</h2>
              <button
                onClick={() => setShowAddFruitModal(false)}
                className="text-ink-400 hover:text-ink-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Simplified fruit selection */}
            <div className="space-y-2">
              <button
                className="w-full text-left p-3 flex items-center gap-3 bg-surface-100 hover:bg-surface-0 rounded-md"
                onClick={() => handleAddFruit('banana')}
              >
                <span className="text-2xl">🍌</span>
                <span>Banana</span>
              </button>

              <button
                className="w-full text-left p-3 flex items-center gap-3 bg-surface-100 hover:bg-surface-0 rounded-md"
                onClick={() => handleAddFruit('apple')}
              >
                <span className="text-2xl">🍎</span>
                <span>Apple</span>
              </button>

              <button
                className="w-full text-left p-3 flex items-center gap-3 bg-surface-100 hover:bg-surface-0 rounded-md"
                onClick={() => handleAddFruit('orange')}
              >
                <span className="text-2xl">🍊</span>
                <span>Orange</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          
          /* Responsive layouts for larger screens */
          @media (min-width: 600px) {
            .app-container {
              display: grid;
              grid-template-columns: 1fr 1fr;
            }
          }
          
          @media (min-width: 900px) {
            .app-container {
              grid-template-columns: 200px 1fr 300px;
            }
          }
        `}</style>
    </div>
  )
}

export default App
