import { Icon } from '@iconify/react';
import { useMemo } from 'react';

interface BookingUser {
    _id: string;
    userId: string;
    eventId: string;
    ticketId: string;
    ticketsCount: number;
    amountPaid: number;
    bookingDate: string;
    bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled';
    bookingId: string;
    userDetails: {
        _id: string;
        full_name: string;
        email: string;
        phone: string;
    };
    ticketDetails: {
        ticketName: string;
        ticketPrice: number;
        quantity: number;
        _id: string;
    };
}

interface StatCardsProps {
    usersList: BookingUser[] | null;
}

const StatCards = ({ usersList }: StatCardsProps) => {
    const stats = useMemo(() => {
        if (!usersList || usersList.length === 0) {
            return {
                totalBookings: 0,
                totalTicketsSold: 0,
                totalRevenue: 0,
                pendingBookings: 0,
                confirmedBookings: 0,
                uniqueUsers: 0,
                avgTicketsPerBooking: 0,
                avgRevenuePerBooking: 0,
            };
        }

        const totalBookings = usersList.length;
        const totalTicketsSold = usersList.reduce((acc, booking) => acc + booking.ticketsCount, 0);
        const totalRevenue = usersList.reduce((acc, booking) => acc + booking.amountPaid, 0);
        const pendingBookings = usersList.filter((b) => b.bookingStatus === 'Pending').length;
        const confirmedBookings = usersList.filter((b) => b.bookingStatus === 'Confirmed').length;
        const uniqueUsers = new Set(usersList.map((b) => b.userId)).size;
        const avgTicketsPerBooking = totalBookings > 0 ? (totalTicketsSold / totalBookings).toFixed(1) : 0;
        const avgRevenuePerBooking = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

        return {
            totalBookings,
            totalTicketsSold,
            totalRevenue,
            pendingBookings,
            confirmedBookings,
            uniqueUsers,
            avgTicketsPerBooking,
            avgRevenuePerBooking,
        };
    }, [usersList]);

    const statCardsData = [
        {
            id: 1,
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: 'solar:ticket-sale-bold-duotone',
            gradient: 'from-indigo-500 via-purple-500 to-pink-500',
            bgLight: 'bg-gradient-to-br from-indigo-50 to-purple-50',
            iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
            change: null,
        },
        {
            id: 2,
            title: 'Tickets Sold',
            value: stats.totalTicketsSold,
            icon: 'solar:ticket-bold-duotone',
            gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
            bgLight: 'bg-gradient-to-br from-emerald-50 to-teal-50',
            iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            change: null,
        },
        {
            id: 3,
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: 'solar:wallet-money-bold-duotone',
            gradient: 'from-amber-500 via-orange-500 to-red-500',
            bgLight: 'bg-gradient-to-br from-amber-50 to-orange-50',
            iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
            change: null,
        },
        {
            id: 4,
            title: 'Unique Customers',
            value: stats.uniqueUsers,
            icon: 'solar:users-group-rounded-bold-duotone',
            gradient: 'from-blue-500 via-sky-500 to-blue-500',
            bgLight: 'bg-gradient-to-br from-blue-500 to-sky-500',
            iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
            change: null,
        },

    ];

    return (
        <div className="col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCardsData.map((card) => (
                    <div
                        key={card.id}
                        className={`relative overflow-hidden rounded-2xl  bg-white ₹ p-5 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    >
                        {/* Decorative gradient orb */}
                        <div
                            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-300`}
                        />

                        <div className="relative z-10">
                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center shadow-lg mb-4`}
                            >
                                <Icon icon={card.icon} className="text-white" width={24} height={24} />
                            </div>

                            {/* Title */}
                            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>

                            {/* Value */}
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>


                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatCards;
