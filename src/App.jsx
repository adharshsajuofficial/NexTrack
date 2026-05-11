import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SearchBar } from './components/SearchBar'
import { TabsNavigation } from './components/TabsNavigation'
import { DashboardGrid } from './components/DashboardGrid'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { useUser } from './contexts/UserContext'

// Import new pages
import Applied from './pages/Applied'
import Recommended from './pages/Recommended'
import Shortlisted from './pages/Shortlisted'

function calculateDaysLeft(deadline) {
  if (!deadline) return 'Unknown';
  const diffTime = new Date(deadline) - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 0 ? 'Expired' : diffDays;
}

function Dashboard({ items, subscriptions, activeTab, setActiveTab, searchQuery, setSearchQuery, locationFilter, setLocationFilter, locations }) {
  const filteredItems = items.filter(item => {
    // 1. Tab Filtering
    if (activeTab !== 'All') {
      if (activeTab === 'For You') {
        if (!subscriptions.includes(item.id)) return false;
      } else {
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
    <>
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <DashboardGrid items={filteredItems} subscriptions={subscriptions} />
    </>
  );
}

function App() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('All')
  const [items, setItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      return;
    }
    const q = query(collection(db, 'user_subscriptions'), where('uid', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSubscriptions(snapshot.docs.map(doc => doc.data().opportunityId));
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (Notification.permission === 'granted' && subscriptions.length > 0 && items.length > 0) {
      subscriptions.forEach(subId => {
        const item = items.find(i => i.id === subId);
        if (item && item.daysLeft === 2) {
          const notifiedKey = `notified_${item.id}`;
          if (!localStorage.getItem(notifiedKey)) {
            new Notification('Deadline Approaching!', {
              body: `${item.title} is closing in exactly 2 days! Don't forget to apply.`,
              icon: '/vite.svg'
            });
            localStorage.setItem(notifiedKey, 'true');
          }
        }
      });
    } else if (Notification.permission === 'default' && user) {
      Notification.requestPermission();
    }
  }, [subscriptions, items, user]);

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
      setItems(data);
    }, (error) => {
      console.error("Error fetching real-time data:", error);
    });

    return () => unsubscribe();
  }, []);

  const locations = [...new Set(items.map(item => item.location).filter(Boolean))];

  return (
    <BrowserRouter>
      <div className="app-container">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          locationFilter={locationFilter} 
          setLocationFilter={setLocationFilter}
          locations={locations}
        />
        
        <main style={{ paddingBottom: '4rem', position: 'relative' }}>
          <Routes>
            <Route path="/" element={
              <Dashboard 
                items={items} 
                subscriptions={subscriptions} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                locationFilter={locationFilter}
                setLocationFilter={setLocationFilter}
                locations={locations}
              />
            } />
            <Route path="/applied" element={<Applied />} />
            <Route path="/recommended" element={<Recommended />} />
            <Route path="/shortlisted" element={<Shortlisted />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

