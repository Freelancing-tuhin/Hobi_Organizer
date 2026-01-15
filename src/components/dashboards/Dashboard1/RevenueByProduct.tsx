import { useState, useMemo } from 'react';
import CardBox from '../../shared/CardBox';
import { Badge, Table, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import SimpleBar from 'simplebar-react';
import { formatDateTime } from 'src/service/formatDate';
import { updateBookingStatus } from 'src/service/updateBookingStatus';
import { motion, AnimatePresence } from 'framer-motion';

const RevenueByProduct = ({ usersList, fetchUsers }: any) => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  // Get unique ticket names for tabs
  const ticketTabs = useMemo(() => {
    const tabs = ['All'];
    if (usersList) {
      const uniqueTickets = Array.from(new Set(usersList.map((user: any) => user.ticketDetails?.ticketName)));
      tabs.push(...uniqueTickets.filter(Boolean) as string[]);
    }
    return tabs;
  }, [usersList]);

  const filteredUsers = useMemo(() => {
    if (!usersList) return [];
    return usersList.filter((user: any) => {
      const matchesTab = activeTab === 'All' || user.ticketDetails?.ticketName === activeTab;
      const matchesSearch =
        user.userDetails?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userDetails?.phone?.includes(searchQuery);
      return matchesTab && matchesSearch;
    });
  }, [usersList, activeTab, searchQuery]);

  return (
    <CardBox className="overflow-visible">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h5 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Icon icon="solar:users-group-rounded-bold-duotone" className="text-primary" width={24} />
            Users & Bookings
          </h5>
          <p className="text-sm text-gray-500 mt-1">Manage event attendees and booking statuses</p>
        </div>

        <div className="w-full md:w-72">
          <TextInput
            placeholder="Search name, email or phone..."
            icon={() => <Icon icon="solar:magnifer-linear" className="text-gray-400" width={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="mb- overflow-x-auto">
        <SimpleBar>
          <div className="flex bg-gray-100/50 dark:bg-dark-muted p-1 rounded-xl w-fit min-w-full sm:min-w-0">
            {ticketTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`relative px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-primary rounded-lg shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon
                    icon={tab === 'All' ? 'solar:globus-linear' : 'solar:ticket-linear'}
                    width={16}
                  />
                  {tab}
                </span>
              </button>
            ))}
          </div>
        </SimpleBar>
      </div>

      <div className="overflow-x-auto relative -mt-5">
        <SimpleBar style={{ maxHeight: '500px' }}>
          <Table hoverable className="min-w-full">
            <Table.Head className="bg-gray-50 dark:bg-dark-muted/20 border-b dark:border-darkborder sticky top-0 z-20">
              <Table.HeadCell className="py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Attendee</Table.HeadCell>
              <Table.HeadCell className="text-xs font-bold uppercase text-gray-500 tracking-wider">Ticket Info</Table.HeadCell>
              <Table.HeadCell className="text-xs font-bold uppercase text-gray-500 tracking-wider">Contact</Table.HeadCell>
              <Table.HeadCell className="text-xs font-bold uppercase text-gray-500 tracking-wider">Date & Time</Table.HeadCell>
              <Table.HeadCell className="text-xs font-bold uppercase text-gray-500 tracking-wider">Paid Amount</Table.HeadCell>
              <Table.HeadCell className="text-xs font-bold uppercase text-gray-500 tracking-wider">Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-100 dark:divide-darkborder">
              <AnimatePresence mode="popLayout">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any, index: number) => (
                    <motion.tr
                      key={user.bookingId || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="bg-white dark:bg-dark group hover:bg-gray-50 dark:hover:bg-darkborder/30 transition-colors"
                    >
                      <Table.Cell className="whitespace-nowrap py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm
                            ${user.userDetails?.gender === 'MALE' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' : 'bg-gradient-to-br from-pink-400 to-rose-600'}`}>
                            {user.userDetails?.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors">
                              {user.userDetails?.full_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{user.bookingId?.slice(-6)}</p>
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex flex-col gap-1">
                          <Badge color="red" size="xs" className="w-fit">
                            {user.ticketDetails?.ticketName}
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Qty: {user.ticketsCount}
                          </p>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex flex-col gap-1">
                          <p className="text-sm flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                            <Icon icon="solar:letter-linear" className="text-gray-400" />
                            {user.userDetails?.email}
                          </p>
                          <p className="text-xs flex items-center gap-1.5 text-gray-500">
                            <Icon icon="solar:phone-linear" className="text-gray-400" />
                            {user.userDetails?.phone}
                          </p>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="text-sm text-gray-700 dark:text-gray-300 flex flex-col">
                          <span className="font-medium">{formatDateTime(user.bookingDate).split(',')[0]}</span>
                          <span className="text-xs text-gray-500">{formatDateTime(user.bookingDate).split(',')[1]}</span>
                        </div>
                      </Table.Cell>

                      <Table.Cell>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          ₹{user.amountPaid.toLocaleString()}
                        </p>
                      </Table.Cell>

                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${user.bookingStatus === 'Completed' ? 'bg-green-500' :
                            user.bookingStatus === 'Canceled' ? 'bg-red-500' :
                              user.bookingStatus === 'Pending' ? 'bg-amber-500' :
                                user.bookingStatus === 'in-progress' ? 'bg-indigo-500' :
                                  'bg-blue-500'
                            }`} />
                          <select
                            value={user.bookingStatus}
                            onChange={(e) => handleStatusChange(user.bookingId, e.target.value)}
                            className={`text-xs font-semibold rounded-lg border-none focus:ring-2 focus:ring-primary py-1.5 px-3 
                              bg-gray-100 dark:bg-dark-muted text-gray-700 dark:text-white cursor-pointer hover:bg-gray-200 
                              dark:hover:bg-darkborder transition-all
                              ${user.bookingStatus === 'Completed' ? 'text-green-600 dark:text-green-400' : ''}
                              ${user.bookingStatus === 'Canceled' ? 'text-red-600 dark:text-red-400' : ''}
                              ${user.bookingStatus === 'Pending' ? 'text-amber-600 dark:text-amber-400' : ''}
                            `}
                          >
                            {['Pending', 'check-in', 'in-progress', 'Completed', 'Canceled'].map(
                              (status) => (
                                <option key={status} value={status} className="text-gray-900 dark:text-white">
                                  {status}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </Table.Cell>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-dark"
                  >
                    <Table.Cell colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-dark-muted rounded-full flex items-center justify-center">
                          <Icon icon="solar:user-block-linear" className="text-gray-400" width={32} />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-800 dark:text-white">No attendees found</p>
                          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                        </div>
                      </div>
                    </Table.Cell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </Table.Body>
          </Table>
        </SimpleBar>
      </div>
    </CardBox>
  );
};

export default RevenueByProduct;
