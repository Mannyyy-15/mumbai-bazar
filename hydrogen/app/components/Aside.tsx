import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useId} from 'react';
import {X, ShoppingBag} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A luxury side drawer matching the original Mumbai Bazar design
 */
export function Aside({
  children,
  heading,
  type,
  count,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  count?: number;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`fixed inset-0 z-[70] overflow-hidden transition-[visibility] duration-300 ${
        expanded ? 'visible pointer-events-auto' : 'invisible delay-300 pointer-events-none'
      }`}
      role="dialog"
      aria-labelledby={id}
    >
      {/* Dark backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          expanded ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />

      {/* Drawer panel */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] shadow-2xl will-change-transform transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gold/25 bg-white px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <h2 id={id} className="font-serif text-lg font-bold text-ink">
              Shopping Bag
            </h2>
            {typeof count === 'number' && count > 0 && (
              <span className="text-xs font-semibold text-ink/50">
                ({count})
              </span>
            )}
          </div>

          <button
            onClick={close}
            aria-label="Close bag"
            className="grid h-8 w-8 place-items-center rounded-full text-ink/60 hover:text-maroon hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto flex flex-col">{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
