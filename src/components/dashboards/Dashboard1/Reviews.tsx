import { useState, useMemo } from 'react';
import CardBox from '../../shared/CardBox';
import { Button, Badge, Avatar } from 'flowbite-react';
import SimpleBar from 'simplebar-react';
import { formatDateTime } from 'src/service/formatDate';
import { updateReviewStatusToAdmin } from 'src/service/review';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

const Reviews = ({ usersList, EventReviews }: any) => {
  const [activeRating, setActiveRating] = useState<number | null>(null);

  const handleRatingClick = (rating: number | null) => {
    setActiveRating(rating);
  };

  const handleUpdateStatus = async (reviewId: any) => {
    try {
      await updateReviewStatusToAdmin(reviewId);
      EventReviews();
    } catch (error) {
      console.error('Failed to update review status:', error);
    }
  };

  const filteredReviews = useMemo(() => {
    if (!usersList) return [];
    return usersList.filter((review: any) =>
      activeRating === null || review.rating === activeRating
    );
  }, [usersList, activeRating]);

  const stats = useMemo(() => {
    if (!usersList || usersList.length === 0) return { avg: 0, total: 0 };
    const total = usersList.length;
    const sum = usersList.reduce((acc: number, r: any) => acc + r.rating, 0);
    return { avg: (sum / total).toFixed(1), total };
  }, [usersList]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            icon={star <= rating ? 'solar:star-bold' : 'solar:star-linear'}
            className={star <= rating ? 'text-amber-400' : 'text-gray-300'}
            width={16}
          />
        ))}
      </div>
    );
  };

  return (
    <CardBox className="h-full flex flex-col overflow-hidden">
      {/* Enhanced Header Section */}
      <div className="relative mb-8 p-6 -m-6 bg-gradient-to-r from-gray-50/50 to-transparent dark:from-dark-muted/20 border-b border-gray-100 dark:border-darkborder mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-dark-muted rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-darkborder">
              <Icon icon="solar:star-fall-2-bold-duotone" className="text-primary" width={28} />
            </div>
            <div>
              <h5 className="text-lg font-black text-gray-900 dark:text-white ">
                Guest Experience
              </h5>
              <p className="text-xs font- text-gray-400 mt-0.5">
                Ratings & Reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-10 w-[1px] bg-gray-200 dark:bg-darkborder hidden sm:block" />
            <div className="flex items-center gap-3 bg-white dark:bg-dark px-4 py-2 rounded-2xl shadow-sm border border-gray-50 dark:border-darkborder">
              <div className="text-right">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.avg}</span>
                  <Icon icon="solar:star-bold" className="text-amber-400" width={18} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
                  {stats.total} REVIEWS
                </p>
              </div>
              <div className="flex items-center gap-0.5 ml-2 border-l border-gray-100 dark:border-darkborder pl-3">
                {renderStars(Math.round(Number(stats.avg)))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Filters */}
      <div className="mb-6 overflow-x-auto">
        <SimpleBar>
          <div className="flex gap-2 p-1 bg-gray-50 dark:bg-dark-muted rounded-xl w-fit">
            <button
              onClick={() => handleRatingClick(null)}
              className={`relative px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeRating === null ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
            >
              {activeRating === null && (
                <motion.div
                  layoutId="activeRatingPill"
                  className="absolute inset-0 bg-primary rounded-lg shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">All</span>
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap ${activeRating === rating ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
              >
                {activeRating === rating && (
                  <motion.div
                    layoutId="activeRatingPill"
                    className="absolute inset-0 bg-primary rounded-lg shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  {rating} <Icon icon="solar:star-bold" width={14} />
                </span>
              </button>
            ))}
          </div>
        </SimpleBar>
      </div>

      <div className="flex-1 overflow-hidden">
        <SimpleBar style={{ maxHeight: '300px' }}>
          <div className="space-y-4 pr-3">
            <AnimatePresence mode="popLayout">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review: any, index: number) => (
                  <motion.div
                    key={review._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 bg-white dark:bg-dark border border-gray-100 dark:border-darkborder rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0">
                          <Avatar
                            placeholderInitials={review?.userId?.full_name?.charAt(0).toUpperCase()}
                            rounded
                            size="md"
                            className="shadow-sm"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-primary transition-colors">
                            {review?.userId?.full_name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {renderStars(review.rating)}
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {formatDateTime(review?.updatedAt).split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        {review?.review_status === 'Organizer' ? (
                          <Button
                            size="xs"
                            color="light"
                            className="!px-3 !py-1 rounded-lg border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-[10px] font-bold uppercase tracking-wider"
                            onClick={() => handleUpdateStatus(review?._id)}
                          >
                            <Icon icon="solar:danger-triangle-linear" className="mr-1" width={14} />
                            Report
                          </Button>
                        ) : review?.review_status === 'Admin' ? (
                          <Badge color="failure" className="!px-3 !py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Reported to Admin
                          </Badge>
                        ) : (
                          <Badge color="gray" className="!px-3 !py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Reverted
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 relative">
                      <Icon icon="solar:double-quotes-l-bold" className="absolute -left-1 -top-1 text-gray-100 dark:text-gray-800" width={24} />
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed relative z-10 pl-4 italic">
                        {review?.comment}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-50 dark:bg-dark-muted rounded-full flex items-center justify-center">
                    <Icon icon="solar:star-ring-linear" className="text-gray-300" width={32} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">No reviews found</p>
                    <p className="text-sm text-gray-500">Try adjusting your rating filters</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SimpleBar>
      </div>
    </CardBox>
  );
};

export default Reviews;
