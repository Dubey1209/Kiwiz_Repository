import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Download, Trash2, Grid, List, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

type LibraryItemType = 'created' | 'enhanced' | 'uploaded';

interface LibraryItem {
  id: string;
  title: string;
  type: LibraryItemType;
  date: string;
  category: string;
  isFavorite: boolean;
  imageUrl: string;
  userId: string;
}

// Mock API function to fetch user's library items
const fetchUserLibrary = async (userId: string): Promise<LibraryItem[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - in a real app, this would come from your backend
  const mockData: LibraryItem[] = [
    { 
      id: '1', 
      title: "Rainbow Butterfly", 
      type: "created", 
      date: "2024-01-15", 
      category: "animals", 
      isFavorite: true, 
      imageUrl: "/images/butterfly.jpg", 
      userId: "user-123"
    },
    { 
      id: '2', 
      title: "Magic Castle", 
      type: "enhanced", 
      date: "2024-01-14", 
      category: "fantasy", 
      isFavorite: false, 
      imageUrl: "/images/castle.jpg", 
      userId: "user-123"
    },
  ];
  
  return mockData.filter(item => item.userId === userId);
};

const MyLibrary = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  // Fetch user's library items
  const { 
    data: libraryItems = [], 
    isLoading, 
    error 
  } = useQuery<LibraryItem[], Error>({
    queryKey: ['library', user?.id],
    queryFn: () => user?.id ? fetchUserLibrary(user.id) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  // Handle query errors
  if (error) {
    console.error('Error fetching library:', error);
    toast({
      title: "Error",
      description: "Failed to load your library. Please try again.",
      variant: "destructive",
    });
  }

  // Update tab counts based on filtered data
  const tabs = [
    { 
      id: 'all' as const, 
      name: 'All', 
      getCount: (items: LibraryItem[]) => items.length
    },
    { 
      id: 'created' as const, 
      name: 'Created', 
      getCount: (items: LibraryItem[]) => items.filter(item => item.type === 'created').length
    },
    { 
      id: 'enhanced' as const, 
      name: 'Enhanced', 
      getCount: (items: LibraryItem[]) => items.filter(item => item.type === 'enhanced').length
    },
    { 
      id: 'favorites' as const, 
      name: 'Favorites', 
      getCount: (items: LibraryItem[]) => items.filter(item => item.isFavorite).length
    },
  ] as const;
  
  type TabId = typeof tabs[number]['id'];
  
  // Calculate tab counts
  const tabCounts = tabs.reduce((acc, tab) => {
    const count = tab.getCount(libraryItems);
    return {
      ...acc,
      [tab.id]: count
    };
  }, {} as Record<TabId, number>);

  // Filter items based on active tab
  const filteredItems = (() => {
    if (!Array.isArray(libraryItems)) return [];
    
    if (activeTab === 'all') return libraryItems;
    if (activeTab === 'favorites') return libraryItems.filter(item => item.isFavorite);
    return libraryItems.filter(item => item.type === activeTab);
  })();

  const handleFavorite = async (itemId: string): Promise<void> => {
    try {
      // In a real app, this would be an API call to update the favorite status
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast({
        title: "Updated favorites! ",
        description: "This item has been added to your favorites.",
      });
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    }
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
      description: `"${itemTitle}" is downloading now!`,
    });
  };

  const handleDelete = (itemTitle: string) => {
    toast({
      title: "Item deleted",
      description: `"${itemTitle}" has been removed from your library.`,
      variant: "destructive",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: LibraryItemType | 'favorites') => {
    switch (type) {
      case "created": return "bg-cute-blue/20 text-cute-blue";
      case "enhanced": return "bg-cute-purple/20 text-cute-purple";
      case "favorites": return "bg-cute-pink/20 text-cute-pink";
      default: return "bg-secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Failed to load your library</h3>
        <p className="text-muted-foreground mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 slide-up">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
              My Creative Library
            </h1>
            <p className="text-xl text-muted-foreground">
              All your child's digital artwork and coloring pages in one place.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex-1 justify-between rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-cute-pink/10 text-cute-pink hover:bg-cute-pink/20"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.name}</span>
              <Badge variant="secondary" className="ml-2 rounded-full bg-gray-200 text-xs">
                {tabCounts[tab.id]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Content */}
        {filteredItems.length === 0 ? (
          <Card className="cute-card text-center py-12">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-primary/60" />
              </div>
              <h3 className="text-xl font-bold text-foreground">No items yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start creating artwork or save some favorites to build your library!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="cute-button">
                  Create New Artwork
                </Button>
                <Button variant="outline" className="rounded-full">
                  Explore Gallery
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <Card key={item.id} className="cute-card group fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="relative">
                      <img 
                        src={`https://picsum.photos/300/300?random=${item.id}`}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <Badge className={getTypeColor(item.type)} variant="secondary">
                          {item.type}
                        </Badge>
                      </div>
                      {item.isFavorite && (
                        <div className="absolute top-3 left-3">
                          <Heart className="w-5 h-5 text-cute-pink fill-cute-pink" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(item.date)}
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                        
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:bg-cute-pink/20 hover:scale-110 transition-all duration-300"
                            onClick={() => handleFavorite(item.id)}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:bg-cute-blue/20 hover:scale-110 transition-all duration-300"
                            onClick={() => handleShare(item.title)}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:bg-cute-green/20 hover:scale-110 transition-all duration-300"
                            onClick={() => handleDownload(item.title)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full hover:bg-destructive/20 hover:scale-110 transition-all duration-300"
                            onClick={() => handleDelete(item.title)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <Card key={item.id} className="cute-card fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center gap-4">
                      <img 
                        src={`https://picsum.photos/100/100?random=${item.id}`}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-foreground text-lg truncate">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(item.date)} • {item.category}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(item.type)} variant="secondary">
                              {item.type}
                            </Badge>
                            {item.isFavorite && (
                              <Heart className="w-4 h-4 text-cute-pink fill-cute-pink" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full hover:bg-cute-blue/20"
                          onClick={() => handleShare(item.title)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full hover:bg-cute-green/20"
                          onClick={() => handleDownload(item.title)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full hover:bg-destructive/20"
                          onClick={() => handleDelete(item.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Stats Card */}
        <Card className="cute-card mt-12 fade-in-delay">
          <h3 className="text-xl font-bold text-foreground mb-4">📊 Your Creative Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-muted-foreground">Total Artworks</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-cute-yellow">8</div>
              <div className="text-sm text-muted-foreground">Created</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-cute-purple">4</div>
              <div className="text-sm text-muted-foreground">Enhanced</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-cute-pink">6</div>
              <div className="text-sm text-muted-foreground">Favorites</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MyLibrary;