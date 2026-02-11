import { Label } from 'flowbite-react';
import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import { useState } from 'react';

// Custom Calendar Component - Single Date Selection Only
const CustomCalendar = ({
    selectedDate,
    onDateSelect
}: {
    selectedDate: string;
    onDateSelect: (date: string) => void;
}) => {
    const [currentMonth, setCurrentMonth] = useState(
        selectedDate ? new Date(selectedDate) : new Date()
    );

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const formattedDate = `${year}-${month}-${dayStr}`;
        onDateSelect(formattedDate);
    };

    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const formattedDate = `${year}-${month}-${dayStr}`;
        return formattedDate === selectedDate;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentMonth.getMonth() === today.getMonth() &&
            currentMonth.getFullYear() === today.getFullYear()
        );
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-10" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(
            <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
          ${isSelected(day)
                        ? 'bg-primary text-white'
                        : isToday(day)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <Icon icon="tabler:chevron-left" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <Icon icon="tabler:chevron-right" className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                    <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">{days}</div>
        </div>
    );
};

// Time Picker Component
const TimePicker = ({ label, value, onChange, icon }: { label: string; value: string; onChange: (time: string) => void; icon: string }) => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = ['00', '15', '30', '45'];

    const parseTime = (timeStr: string) => {
        if (!timeStr) return { hour: '12', minute: '00', period: 'AM' };
        const [h, m] = timeStr.split(':');
        const hour24 = parseInt(h);
        const period = hour24 >= 12 ? 'PM' : 'AM';
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        return { hour: hour12.toString().padStart(2, '0'), minute: m, period };
    };

    const { hour, minute, period } = parseTime(value);

    const handleChange = (newHour: string, newMinute: string, newPeriod: string) => {
        let hour24 = parseInt(newHour);
        if (newPeriod === 'PM' && hour24 !== 12) hour24 += 12;
        if (newPeriod === 'AM' && hour24 === 12) hour24 = 0;
        const timeStr = `${hour24.toString().padStart(2, '0')}:${newMinute}`;
        onChange(timeStr);
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon icon={icon} className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
            </div>

            <div className="flex items-center gap-2">
                {/* Hour */}
                <div className="flex-1">
                    <select
                        value={hour}
                        onChange={(e) => handleChange(e.target.value, minute, period)}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-semibold text-lg focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        {hours.map((h) => (
                            <option key={h} value={h}>{h}</option>
                        ))}
                    </select>
                </div>

                <span className="text-2xl font-bold text-gray-300">:</span>

                {/* Minute */}
                <div className="flex-1">
                    <select
                        value={minute}
                        onChange={(e) => handleChange(hour, e.target.value, period)}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center font-semibold text-lg focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                        {minutes.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* AM/PM */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => handleChange(hour, minute, 'AM')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${period === 'AM'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        AM
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChange(hour, minute, 'PM')}
                        className={`px-4 py-3 text-sm font-semibold transition-colors ${period === 'PM'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        PM
                    </button>
                </div>
            </div>
        </div>
    );
};

// Edit Mode - Only Date & Time, no Activity Type selection
const EditEventSchedule = ({ eventData, setEventData }: any) => {
    const [drawerMode, setDrawerMode] = useState<'calendar' | 'time' | null>(null);

    const handleDateSelect = (date: string) => {
        setEventData({ ...eventData, startDate: date });
    };

    const handleStartTimeChange = (time: string) => {
        setEventData({ ...eventData, startTime: time });
    };

    const handleEndTimeChange = (time: string) => {
        setEventData({ ...eventData, endTime: time });
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return 'Select date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDisplayTime = (timeStr: string) => {
        if (!timeStr) return '--:--';
        const [h, m] = timeStr.split(':');
        const hour24 = parseInt(h);
        const period = hour24 >= 12 ? 'PM' : 'AM';
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        return `${hour12}:${m} ${period}`;
    };

    const closeDrawer = () => setDrawerMode(null);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Card - Event Type Info (Read-only) */}
                <CardBox>
                    <div className="flex items-center gap-3 -mt-5 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon icon="tabler:category" className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold text-dark dark:text-white">Activity Type</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Event frequency type</p>
                        </div>
                    </div>

                    {/* Display current type as read-only */}
                    <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary text-white">
                            <Icon icon={eventData.type === 'Single' ? 'tabler:calendar' : 'tabler:repeat'} className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <span className="font-semibold text-dark dark:text-white">
                                {eventData.type === 'Single'
                                    ? 'Single Activity'
                                    : eventData.type === 'Routine'
                                        ? 'Routine Subscription'
                                        : 'Recurring Activity'}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {eventData.type === 'Single'
                                    ? 'One-time event'
                                    : eventData.type === 'Routine'
                                        ? 'Weekly classes with flexible dates'
                                        : 'Repeats on multiple dates'}
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Cannot change</span>
                        </div>
                    </div>
                </CardBox>

                {/* Right Card - Date & Time */}
                <CardBox>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon icon="tabler:calendar-event" className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h5 className="text-lg font-semibold text-dark dark:text-white">Event Schedule</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Set date and time</p>
                        </div>
                    </div>

                    {/* Date - Opens Calendar Drawer */}
                    <div className="mb-5">
                        <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                            Event Date <span className="text-error">*</span>
                        </Label>
                        <button
                            type="button"
                            onClick={() => setDrawerMode('calendar')}
                            className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all bg-white dark:bg-gray-800"
                        >
                            <div className="flex items-center gap-3">
                                <Icon icon="tabler:calendar" className="w-5 h-5 text-primary" />
                                <span className={eventData.startDate ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                                    {formatDisplayDate(eventData.startDate)}
                                </span>
                            </div>
                            <Icon icon="tabler:chevron-right" className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    {/* Times - Opens Time Drawer */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                                Start Time <span className="text-error">*</span>
                            </Label>
                            <button
                                type="button"
                                onClick={() => setDrawerMode('time')}
                                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all bg-white dark:bg-gray-800"
                            >
                                <Icon icon="tabler:clock" className="w-5 h-5 text-primary" />
                                <span className={eventData.startTime ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                                    {formatDisplayTime(eventData.startTime)}
                                </span>
                            </button>
                        </div>
                        <div>
                            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                                End Time <span className="text-error">*</span>
                            </Label>
                            <button
                                type="button"
                                onClick={() => setDrawerMode('time')}
                                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary transition-all bg-white dark:bg-gray-800"
                            >
                                <Icon icon="tabler:clock-off" className="w-5 h-5 text-primary" />
                                <span className={eventData.endTime ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}>
                                    {formatDisplayTime(eventData.endTime)}
                                </span>
                            </button>
                        </div>
                    </div>

                </CardBox>
            </div>

            {/* Drawer */}
            {drawerMode && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={closeDrawer} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-darkgray z-50 shadow-2xl overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-darkgray border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Icon icon={drawerMode === 'calendar' ? 'tabler:calendar' : 'tabler:clock'} className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {drawerMode === 'calendar' ? 'Select Date' : 'Set Time'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {drawerMode === 'calendar' ? 'Choose event date' : 'Set start and end time'}
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={closeDrawer} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Icon icon="tabler:x" className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        {drawerMode === 'calendar' ? (
                            <CustomCalendar
                                selectedDate={eventData.startDate || ''}
                                onDateSelect={handleDateSelect}
                            />
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                <TimePicker label="Start Time" value={eventData.startTime} onChange={handleStartTimeChange} icon="tabler:clock" />
                                <TimePicker label="End Time" value={eventData.endTime} onChange={handleEndTimeChange} icon="tabler:clock-off" />
                            </div>
                        )}

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white dark:bg-darkgray border-t border-gray-200 dark:border-gray-700 p-4">
                            <button
                                type="button"
                                onClick={closeDrawer}
                                className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon icon="tabler:check" className="w-5 h-5" />
                                Done
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default EditEventSchedule;
