import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import RevenueByProduct from 'src/components/dashboards/Dashboard1/RevenueByProduct';
import Reviews from 'src/components/dashboards/Dashboard1/Reviews';
// import SalesOverview from 'src/components/dashboards/Dashboard1/SalesOverview';
import YourPerformance from 'src/components/dashboards/Dashboard1/YourPerformance';
import StatCards from 'src/components/dashboards/dashboard3/StatCards';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { getEventReview } from 'src/service/eventReview';
import getBookingStatistics, {
  getBookingPerformance,
  getBookingUsers,
} from 'src/service/getEventStats';
import LockScreen from '../authentication/lockScreen/LockScreen';

const Dashboard3 = () => {
  const { id } = useParams<{ id: string }>(); // Get eventId from URL
  const [stats, setStats] = useState<any>(null);
  const [performance, setPerformence] = useState<any>(null);
  const [usersList, setUsersList] = useState<any>(null);
  const [reviewList, setReviewList] = useState<any>(null);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getBookingStatistics(id);
      setStats(response);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getBookingUsers(id);
      console.log('=>users', response?.result);
      setUsersList(response?.result);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const BookingPerformance = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getBookingPerformance(id);
      console.log('=>performance', response);
      setPerformence(response);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const EventReviews = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await getEventReview(id);
      console.log('=>reviews', response);
      setReviewList(response);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    EventReviews();
  }, [id]);

  useEffect(() => {
    fetchStats();
  }, [id]);

  useEffect(() => {
    BookingPerformance();
  }, [id]);

  useEffect(() => {
    fetchUsers();
  }, [id]);

  const BCrumb = [
    {
      to: '/',
      title: 'Home',
    },
    {
      title: 'Event list',
    },
    {
      title: 'Event stats',
    },
  ];
  return (
    <>
      <LockScreen />
      <BreadcrumbComp title={`Event: ${stats?.eventDetails?.title}`} items={BCrumb} />
      <div className="grid grid-cols-12 gap-30">

        {/* Stat Cards */}
        <StatCards usersList={usersList} />

        <div className="lg:col-span-12 col-span-12">
          <RevenueByProduct usersList={usersList} fetchUsers={fetchUsers} />
        </div>

        <div className="lg:col-span-5 col-span-12">
          <YourPerformance performence={performance} />
        </div>
        <div className="lg:col-span-7 col-span-12">
          <Reviews usersList={reviewList} EventReviews={EventReviews} />
        </div>

        {/* <div className="lg:col-span-8 col-span-12">
          <RevenueByProduct />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <TotalSettelment />
        </div>
        <div className="col-span-12">
          <CalendarApp />
        </div> */}
      </div>
    </>
  );
};

export default Dashboard3;
