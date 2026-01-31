import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { Table, Pagination, Spinner, Modal, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { deleteEvent } from 'src/service/deleteEvent';

const EventTable = ({ events, totalPages, getEvents, searchText, loading }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (event: any) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEvent(eventToDelete._id);
      setShowDeleteModal(false);
      setEventToDelete(null);
      // Refresh the events list
      getEvents(currentPage);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    getEvents(currentPage);
  }, [currentPage, searchText]);

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Icon
            key={index}
            icon="solar:star-bold"
            height={16}
            className={index < rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating > 0 ? rating.toFixed(1) : '0'}/5
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
          <Icon icon="solar:calendar-mark-bold-duotone" className="text-5xl text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">No events yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          Create your first event to get started
        </p>
        <Link
          to="/Event/add"
          className="px-6 py-2.5 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center gap-2"
        >
          <Icon icon="solar:add-circle-bold" height={20} />
          Create Event
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-xl border-gray-200 dark:border-gray-700 overflow-x-auto">
        <Table hoverable>
          <Table.Head className="bg-gray-50 dark:bg-gray-800">
            <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Icon icon="solar:calendar-mark-bold" height={16} />
                Event
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Icon icon="solar:calendar-bold" height={16} />
                Date
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Icon icon="solar:clock-circle-bold" height={16} />
                Time
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Icon icon="solar:star-bold" height={16} />
                Ratings
              </div>
            </Table.HeadCell>
            <Table.HeadCell className="font-bold text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Icon icon="solar:settings-bold" height={16} />
                Actions
              </div>
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y divide-gray-100 dark:divide-gray-700">
            {events.map((item: any) => (
              <Table.Row
                key={item?._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Table.Cell>
                  <div className="flex gap-3 items-center">
                    <img
                      src={item?.banner_Image}
                      alt="Event Banner"
                      className="h-14 w-14 rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <h6 className="font-semibold text-gray-800 dark:text-white text-sm max-w-[200px] truncate">
                        {item?.title}
                      </h6>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <Icon icon="solar:tag-bold" height={12} />
                        {item?.category?.service_name || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {format(new Date(item.startDate), 'd')}
                      </span>
                      <span className="text-[10px] text-blue-500 dark:text-blue-400 uppercase -mt-1">
                        {format(new Date(item.startDate), 'MMM')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(item.startDate), 'yyyy')}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:clock-circle-bold" height={16} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(item?.startTime)} - {formatTime(item?.endTime)}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {renderRating(item?.ratings || 0)}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2 items-center">
                    <Link to={`/Event/${item._id}`}>
                      <button className="px-4 py-3 bg-gradient-to-r from-[#b03052] to-[#8a2542] text-white rounded-lg font-medium text-xs hover:shadow-lg hover:shadow-[#b03052]/30 transition-all flex items-center gap-1.5">
                        <Icon icon="solar:chart-2-bold" height={16} />
                        Dashboard
                      </button>
                    </Link>
                    <Link to={`/Event/edit/${item._id}`}>
                      <button className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-1.5">
                        <Icon icon="solar:pen-bold" height={16} />
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium text-xs hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-1.5"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" height={16} />
                      Delete
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            showIcons
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        size="md"
        onClose={handleCancelDelete}
        popup
        className="rounded-xl"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Icon
                icon="solar:trash-bin-trash-bold"
                className="text-red-500 dark:text-red-400"
                height={32}
              />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Delete Event
            </h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{eventToDelete?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                color="gray"
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                color="failure"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6"
              >
                {isDeleting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Icon icon="solar:trash-bin-trash-bold" height={16} className="mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EventTable;
