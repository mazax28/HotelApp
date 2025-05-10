import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import ReservationsListPage from './pages/ReservationsListPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/reservations" element={<ReservationsListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
