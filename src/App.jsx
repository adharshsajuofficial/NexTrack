import { useState, useEffect } from 'react'
import { SearchBar } from './components/SearchBar'
import { TabsNavigation } from './components/TabsNavigation'
import { DashboardGrid } from './components/DashboardGrid'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

function calculateDaysLeft(deadline) {
  if (!deadline) return 'Unknown';
  const diffTime = new Date(deadline) - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 'Expired' : diffDays;
}

function App() {
  const [activeTab, setActiveTab] = useState('All')
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'opportunities'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          daysLeft: calculateDaysLeft(docData.deadline)
        };
      });
      console.log("Real-time data from Firebase:", data);
      setItems(data);
    }, (error) => {
      console.error("Error fetching real-time data:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Get unique locations for dropdown
  const locations = [...new Set(items.map(item => item.location).filter(Boolean))];

  const filteredItems = items.filter(item => {
    // 1. Tab Filtering
    if (activeTab !== 'All') {
      if (!item.category) return false;
      const itemCat = item.category.toLowerCase();
      const tabCat = activeTab.toLowerCase();
      
      let tabMatch = false;
      if (tabCat === 'internships' && (itemCat === 'internship' || itemCat === 'internships')) tabMatch = true;
      else if (tabCat === 'hackathons' && (itemCat === 'hackathon' || itemCat === 'hackathons')) tabMatch = true;
      else if (tabCat === 'scholarships' && (itemCat === 'scholarship' || itemCat === 'scholarships')) tabMatch = true;
      else if (tabCat === 'exams' && (itemCat === 'exam' || itemCat === 'exams')) tabMatch = true;
      else if (itemCat === tabCat) tabMatch = true;
      
      if (!tabMatch) return false;
    }

    // 2. Location Filtering
    if (locationFilter && item.location !== locationFilter) {
      return false;
    }

    // 3. Search Query Filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(query);
      const matchCategory = item.category?.toLowerCase().includes(query);
      const matchLocation = item.location?.toLowerCase().includes(query);
      
      if (!matchTitle && !matchCategory && !matchLocation) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="app-container">
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        locationFilter={locationFilter} 
        setLocationFilter={setLocationFilter}
        locations={locations}
      />
      
      <main style={{ paddingBottom: '4rem', position: 'relative' }}>
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <DashboardGrid items={filteredItems} />
      </main>
    </div>
  )
}

export default App
