import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import NurseryForm from './components/NurseryForm';
import SaplingList from './components/SaplingList';
import { setSaplings, setDistricts } from './redux/nurserySlice';

// const [message, setMessage] = useState('');

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const saplingsData = await fetch('/data/saplings.json').then((res) => res.json());
        const districtsData = await fetch('/data/districts.json').then((res) => res.json());
        dispatch(setSaplings(saplingsData));
        dispatch(setDistricts(districtsData));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);


  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-800 ">
    {/* bg-gradient-to-b from-white to-white  */}
    
      <Header />
      <div className="flex-grow container mx-auto p-4">
        <NurseryForm />
        <SaplingList />
      </div>
      <Footer />
    </div>

  );
};

export default App;

// npm install react-router-dom @types/react-router-dom