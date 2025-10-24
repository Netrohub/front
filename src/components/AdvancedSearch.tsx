import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  type: "product" | "category" | "seller";
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Premium Instagram Account - 50K",
    category: "Social Media",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    type: "product",
  },
  {
    id: "2",
    title: "Steam Account - 200+ Games",
    category: "Gaming",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    type: "product",
  },
  {
    id: "3",
    title: "TikTok Creator Account",
    category: "Social Media",
    price: 599.99,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    type: "product",
  },
];

const trendingSearches = [
  "Instagram accounts",
  "Steam games",
  "YouTube channels",
  "TikTok accounts",
  "Gaming accounts",
];

const recentSearches = [
  "Premium Instagram",
  "Steam account",
  "YouTube 10k",
];

interface AdvancedSearchProps {
  onClose?: () => void;
}

const AdvancedSearch = ({ onClose }: AdvancedSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearchList, setRecentSearchList] = useState(recentSearches);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setIsOpen(true);
      // Simulate search
      const filtered = mockResults.filter((result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (!recentSearchList.includes(searchTerm) && searchTerm.length > 0) {
      setRecentSearchList([searchTerm, ...recentSearchList.slice(0, 4)]);
    }
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearchList(recentSearchList.filter((s) => s !== search));
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary/70" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products, accounts, or categories..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-10 h-14 glass-card border-primary/30 focus:border-primary/50 text-base"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full glass-card border border-primary/30 max-h-[600px] overflow-y-auto z-50">
          <div className="p-4 space-y-6">
            {query.length === 0 ? (
              <>
                {/* Recent Searches */}
                {recentSearchList.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-foreground/60" />
                        <h3 className="text-sm font-semibold text-foreground">Recent Searches</h3>
                      </div>
                      <button
                        onClick={() => setRecentSearchList([])}
                        className="text-xs text-foreground/60 hover:text-primary transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {recentSearchList.map((search) => (
                        <div
                          key={search}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer group"
                          onClick={() => handleSearch(search)}
                        >
                          <span className="text-sm text-foreground/70">{search}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecentSearch(search);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-foreground/40 hover:text-destructive" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Trending Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Search Results */}
                {results.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">
                      Results for "{query}"
                    </h3>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <Link
                          key={result.id}
                          to={`/products/${result.id}`}
                          onClick={() => {
                            handleSearch(query);
                            setIsOpen(false);
                            onClose?.();
                          }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground truncate">
                              {result.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20 text-xs"
                              >
                                {result.category}
                              </Badge>
                              <span className="text-xs text-foreground/60">${result.price}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-foreground/60">No results found for "{query}"</p>
                    <p className="text-sm text-foreground/40 mt-2">
                      Try different keywords or browse our categories
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
