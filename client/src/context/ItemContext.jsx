import React, { createContext, useContext, useState, useEffect } from 'react';

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'lost', 'found'
  const [activeModal, setActiveModal] = useState(null); // 'report', 'claim', 'aiMatch', 'chat'
  const [selectedItem, setSelectedItem] = useState(null);
  const [aiMatches, setAiMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search query to optimize API request frequency
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Items from Backend
  const fetchItems = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      if (selectedCategory && selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedType && selectedType !== 'all') queryParams.append('type', selectedType);

      const res = await fetch(`/api/items?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [debouncedSearch, selectedCategory, selectedType]);

  // Report New Item
  const reportItem = async (itemData) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => [data.item, ...prev]);
        fetchItems();
        return data;
      }
    } catch (err) {
      console.error("Failed to report item:", err);
    }
  };

  // Run AI Matcher for an item
  const getAIMatches = async (itemId) => {
    try {
      const res = await fetch(`/api/items/${itemId}/match`);
      const data = await res.json();
      if (data.success) {
        setAiMatches(data.matches);
        return data.matches;
      }
    } catch (err) {
      console.error("Failed to run AI Matcher:", err);
    }
    return [];
  };

  // Submit Claim
  const submitClaim = async (claimData) => {
    try {
      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to submit claim:", err);
    }
  };

  return (
    <ItemContext.Provider value={{
      items,
      loading,
      search,
      setSearch,
      selectedCategory,
      setSelectedCategory,
      selectedType,
      setSelectedType,
      activeModal,
      setActiveModal,
      selectedItem,
      setSelectedItem,
      aiMatches,
      getAIMatches,
      reportItem,
      submitClaim,
      notifications,
      setNotifications,
      activeChat,
      setActiveChat,
      refreshItems: fetchItems
    }}>
      {children}
    </ItemContext.Provider>
  );
};

export const useItems = () => useContext(ItemContext);
