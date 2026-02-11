import GeneralDetail from 'src/components/apps/ecommerce/addProduct/GeneralDetail';
import Pricing from 'src/components/apps/ecommerce/addProduct/Pricing';
import ProductData from 'src/components/apps/ecommerce/addProduct/ProductData';
import Status from 'src/components/apps/ecommerce/addProduct/Status';
import Variation from 'src/components/apps/ecommerce/addProduct/Variation';
import SupportingImages from 'src/components/apps/ecommerce/addProduct/SupportingImages';
import Thumbnail from 'src/components/apps/ecommerce/editProduct/Thumbnail';
import Inclusions from 'src/components/apps/ecommerce/addProduct/Inclusions';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Button } from 'flowbite-react';
import { useContext, useState } from 'react';
import { createEvent, CreateEventPayload } from 'src/service/createEvent';
import { useNavigate } from 'react-router';
import { AuthContext } from 'src/context/authContext/AuthContext';
import LockScreen from 'src/views/authentication/lockScreen/LockScreen';
import Spinner from 'src/views/spinner/Spinner';
import { Icon } from '@iconify/react';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Add Event',
  },
];

// Step configuration
const STEPS = [
  { id: 1, title: 'Basic Info', icon: 'tabler:file-description' },
  { id: 2, title: 'Date & Time', icon: 'tabler:calendar-event' },
  { id: 3, title: 'Category', icon: 'tabler:category' },
  { id: 4, title: 'Inclusions', icon: 'tabler:list-check' },
  { id: 5, title: 'Media', icon: 'tabler:photo' },
  { id: 6, title: 'Pricing', icon: 'tabler:tag' },
];

const AddProduct = () => {
  const { user }: any = useContext(AuthContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: number]: string }>({});
  const [eventData, setEventData] = useState({
    title: '',
    category: '',
    type: '',
    eventDates: [] as string[],
    startTime: '',
    endTime: '',
    routine: {
      mode: 'Weekly',
      startDate: '',
      endDate: '',
      sessionsPerMonth: 0,
      daysOfWeek: [] as number[],
      customDates: [] as string[],
    },
    subscriptionPricing: {
      billingCycle: 'Monthly',
      price: '',
    },
    subscriptionCapacity: 0,
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
    description: '',
    isTicketed: true,
    tickets: [],
    inclusions: [] as { id: string; text: string }[],
    exclusions: [] as { id: string; text: string }[],
    organizerId: user?._id,
  });
  const navigate = useNavigate();
  const [banner, setBanner] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [supportingImages, setSupportingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: '' }));
    }
  };

  const handleBannerChange = (file: File) => {
    setBannerFile(file);
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: '' }));
    }
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!eventData.title.trim()) {
          setStepErrors({ ...stepErrors, 1: 'Event name is required' });
          return false;
        }
        if (!eventData.location.address) {
          setStepErrors({ ...stepErrors, 1: 'Location is required' });
          return false;
        }
        return true;
      case 2:
        if (!eventData.type) {
          setStepErrors({ ...stepErrors, 2: 'Please select activity type' });
          return false;
        }
        if (eventData.type === 'Routine') {
          const routine = eventData.routine || {};
          if (routine.mode === 'Weekly') {
            if (!routine.startDate) {
              setStepErrors({ ...stepErrors, 2: 'Please select a start date' });
              return false;
            }
            if (!routine.endDate) {
              setStepErrors({ ...stepErrors, 2: 'Please select an end date' });
              return false;
            }
            if (!routine.daysOfWeek || routine.daysOfWeek.length === 0) {
              setStepErrors({ ...stepErrors, 2: 'Please select at least one weekday' });
              return false;
            }
          }
          if (routine.mode === 'Custom') {
            if (!routine.customDates || routine.customDates.length === 0) {
              setStepErrors({ ...stepErrors, 2: 'Please select at least one date' });
              return false;
            }
          }
        } else if (!eventData.eventDates || eventData.eventDates.length === 0) {
          setStepErrors({ ...stepErrors, 2: 'Please select at least one date' });
          return false;
        }
        if (!eventData.startTime) {
          setStepErrors({ ...stepErrors, 2: 'Start time is required' });
          return false;
        }
        if (!eventData.endTime) {
          setStepErrors({ ...stepErrors, 2: 'End time is required' });
          return false;
        }
        return true;
      case 3:
        if (!eventData.category) {
          setStepErrors({ ...stepErrors, 3: 'Please select a category' });
          return false;
        }
        return true;
      case 4:
        // Inclusions step - optional, no validation required
        return true;
      case 5:
        if (!bannerFile) {
          setStepErrors({ ...stepErrors, 5: 'Please upload a banner image' });
          return false;
        }
        return true;
      case 6:
        if (eventData.type === 'Routine') {
          if (!eventData.subscriptionPricing?.price) {
            setStepErrors({ ...stepErrors, 6: 'Please enter subscription price' });
            return false;
          }
          if (!eventData.subscriptionCapacity || eventData.subscriptionCapacity < 1) {
            setStepErrors({ ...stepErrors, 6: 'Please enter subscription capacity' });
            return false;
          }
        } else if (eventData.isTicketed && eventData.tickets.length === 0) {
          setStepErrors({ ...stepErrors, 6: 'Please add at least one ticket' });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    // Only allow going back, or staying on current step
    // User cannot skip ahead without completing current step
    if (step < currentStep) {
      setCurrentStep(step);
    } else if (step === currentStep) {
      // Stay on current step
    } else {
      // Trying to go forward - validate all steps up to that point
      for (let i = currentStep; i < step; i++) {
        if (!validateStep(i)) {
          return;
        }
      }
      setCurrentStep(step);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(5)) {
      return;
    }

    setIsLoading(true);
    const eventPayload: CreateEventPayload = {
      ...eventData,
      eventDates: eventData.eventDates,
      bannerImage: bannerFile!,
      supportingImages: supportingImages,
    };

    console.log('Submitting event:', eventPayload);
    try {
      await createEvent(eventPayload);
      navigate('/Event/list');
    } catch (err) {
      console.error('Create event failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-7 col-span-12">
              <GeneralDetail
                title={eventData.title}
                description={eventData.description}
                handleChange={handleChange}
              />
            </div>
            <div className="lg:col-span-5 col-span-12">
              <Status eventData={eventData} setEventData={setEventData} />
            </div>
          </div>
        );
      case 2:
        return (
          <Variation eventData={eventData} setEventData={setEventData} />
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto">
            <ProductData eventData={eventData} setEventData={setEventData} />
          </div>
        );
      case 4:
        return (
          <div className="max-xl mx-auto">
            <Inclusions eventData={eventData} setEventData={setEventData} />
          </div>
        );
      case 5:
        return (
          <div className="max-w-2xl mx-auto">
            <Thumbnail onBannerChange={handleBannerChange} setBanner={setBanner} banner={banner} />
            <SupportingImages
              supportingImages={supportingImages}
              setSupportingImages={setSupportingImages}
            />
          </div>
        );
      case 6:
        return (
          <Pricing eventData={eventData} setEventData={setEventData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className='relative'>
      <LockScreen />
      {isLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative z-10">
            <Spinner />
          </div>
        </div>
      )}
      <BreadcrumbComp title="Add Event" items={BCrumb} />


      {/* Error Message */}
      {stepErrors[currentStep] && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 animate-shake">
          <Icon icon="solar:danger-triangle-bold" className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{stepErrors[currentStep]}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="mb-24 animate-fadeIn">{renderStepContent()}</div>

      {/* Navigation Buttons - Fixed Footer */}
      <div className="fixed bottom-0 left-0 xl:left-[270px] right-0 bg-white/90 dark:bg-black/30 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 
      px-4 md:px-6 py-5 z-40">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <Button
            color="light"
            size="sm"
            className="flex items-center gap-2"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <Icon icon="tabler:arrow-left" className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Mini Stepper */}
          <div className="flex items-center">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              const isClickable = step.id <= currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step Circle */}
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    disabled={!isClickable}
                    className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 font-semibold text-sm ${isActive
                      ? 'bg-primary text-white '
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-2 border-gray-200 dark:border-gray-600'
                      } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-40'}`}
                  >
                    {isCompleted ? (
                      <Icon icon="tabler:check" className="w-5 h-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </button>

                  {/* Connector Line */}
                  {index < STEPS.length - 1 && (
                    <div className={`w-1 md:w-16 lg:w-20 h-[3px] rounded-full mx-1 transition-all duration-500 ${step.id < currentStep
                      ? 'bg-gradient-to-r from-green-500 to-green-400'
                      : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Next/Submit Button */}
          {currentStep < STEPS.length ? (
            <Button
              color="primary"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleNext}
            >
              <span className="hidden sm:inline">Next</span>
              <Icon icon="tabler:arrow-right" className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              color="primary"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSubmit}
            >
              <Icon icon="tabler:check" className="w-4 h-4" />
              <span className="hidden sm:inline">Publish Event</span>
            </Button>
          )}
        </div>

        {/* Current Step Title - Mobile */}
        <p className="text-center text-xs text-gray-500 mt-2 md:hidden">
          {STEPS.find(s => s.id === currentStep)?.title}
        </p>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;
