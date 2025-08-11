import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Share2, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FilterDropdown } from "@/components/gallery/FilterDropdown";
import { cn } from "@/lib/utils";

// Generate more items for infinite scroll
const generateMoreItems = (startId: number, count: number) => {
  const categories = ["animals", "nature", "fantasy", "vehicles", "food", "toys"];
  const creators = ["Emma", "Liam", "Sophia", "Oliver", "Ava", "Noah", "Isabella", "Lucas"];
  
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    title: `Artwork #${startId + i}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    likes: Math.floor(Math.random() * 100) + 5,
    creator: creators[Math.floor(Math.random() * creators.length)],
    age: Math.floor(Math.random() * 3) + 3 // Age 3-5
  }));
};

const PAGE_SIZE = 10;

const ExploreGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const { toast } = useToast();
  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreItems();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMoreItems = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newItems = generateMoreItems(items.length + 1, PAGE_SIZE);
      setItems(prevItems => [...prevItems, ...newItems]);
      setPage(prevPage => prevPage + 1);
      setLoading(false);
      // In a real app, you would check if there are more items from the API
      if (items.length > 50) { // Just for demo purposes
        setHasMore(false);
      }
    }, 1000);
  };

  useEffect(() => {
    // Initial load
    setItems(generateMoreItems(1, PAGE_SIZE * 2));
  }, []);

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const filters = [
    { id: "animals", name: "Animals", count: 12 },
    { id: "nature", name: "Nature", count: 8 },
    { id: "fantasy", name: "Fantasy", count: 10 },
    { id: "vehicles", name: "Vehicles", count: 6 },
    { id: "food", name: "Food", count: 7 },
    { id: "toys", name: "Toys", count: 5 },
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Filter by search query
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.creator.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by selected categories
      const matchesCategory = selectedFilters.length === 0 || 
                            selectedFilters.includes(item.category);
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedFilters]);

  const handleLike = (itemId: number) => {
    toast({
      title: "Added to favorites! ",
      description: "This artwork has been liked and saved to your favorites.",
    });
  };

  const handleShare = (itemTitle: string) => {
    toast({
      title: "Link copied! ",
      description: `Share "${itemTitle}" with friends and family.`,
    });
  };

  const handleDownload = (itemTitle: string) => {
    toast({
      title: "Download started",
      description: `"${itemTitle}" is downloading as a coloring page!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 slide-up">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Explore Creative Masterpieces
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing artwork created by toddlers around the world. Get inspired and find new coloring pages to enjoy!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm pb-4 pt-2">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for coloring pages..."
                  className="pl-10 pr-10 py-6 rounded-full bg-background/80 backdrop-blur-sm border-border/50 focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-shrink-0">
                <FilterDropdown
                  options={filters}
                  selectedFilters={selectedFilters}
                  onFilterChange={setSelectedFilters}
                />
              </div>
            </div>
            
            {/* Active filters */}
            {selectedFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedFilters.map(filterId => {
                  const filter = filters.find(f => f.id === filterId);
                  return filter ? (
                    <div 
                      key={filter.id}
                      className="inline-flex items-center bg-[#898AC4]/10 text-[#898AC4] px-3 py-1 rounded-full text-sm"
                    >
                      {filter.name}
                      <button 
                        onClick={() => toggleFilter(filter.id)}
                        className="ml-2 hover:bg-[#898AC4]/20 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : null;
                })}
                <button 
                  onClick={clearFilters}
                  className="text-sm text-[#898AC4] hover:underline ml-2 self-center"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Grid - 3 Column Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-4 max-w-5xl mx-auto">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              ref={index === filteredItems.length - 1 ? lastItemRef : null}
              className="relative group w-full"
            >
              <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className="relative aspect-[2/3] bg-muted/50 flex-shrink-0">
                  <img 
                    src={`https://picsum.photos/300/450?random=${item.id}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center">
                          <span className="text-xs font-bold">{item.creator.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{item.creator}, {item.age}</p>
                          <p className="text-xs text-white/80">@{item.creator.toLowerCase()}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3 line-clamp-2">{item.title}</p>
                    
                    {/* Action Buttons */}
                    <div className="absolute right-2 bottom-10 flex flex-col items-center space-y-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                        onClick={() => handleLike(item.id)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <span className="text-xs font-medium">{item.likes}</span>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                        onClick={() => handleShare(item.title)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 text-white"
                        onClick={() => handleDownload(item.title)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
          
          {/* Loading indicator - spans full width */}
          {loading && (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          
          {/* No more items - spans full width */}
          {!hasMore && (
            <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 text-center py-8 text-muted-foreground">
              You've reached the end of the gallery!
            </div>
          )}
        </div>

        {/* Community Guidelines */}
        <Card className="cute-card mt-12 fade-in-delay">
          <h3 className="text-xl font-bold text-foreground mb-4">🌟 Community Guidelines</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Safe & Positive Space</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• All artwork is moderated for child safety</li>
                <li>• Only age-appropriate content is featured</li>
                <li>• Positive encouragement for all young artists</li>
                <li>• No personal information is shared</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">How to Participate</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Like artwork to show appreciation</li>
                <li>• Download coloring pages for your child</li>
                <li>• Share favorites with family and friends</li>
                <li>• Upload your child's art to inspire others</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExploreGallery;