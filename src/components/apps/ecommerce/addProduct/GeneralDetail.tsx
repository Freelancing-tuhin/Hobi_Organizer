import { Label, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import CustomTextEditor from './CustomTextEditor';

interface GeneralDetailProps {
  title: string;
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const GeneralDetail: React.FC<GeneralDetailProps> = ({ title, description, handleChange }) => {
  return (
    <CardBox>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
          <Icon icon="tabler:file-description" className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h5 className="text-lg font-semibold text-dark dark:text-white">Event Details</h5>
          <p className="text-xs text-gray-500 dark:text-gray-400">Basic information about your event</p>
        </div>
      </div>

      {/* Event Name Input */}
      <div className="mb-6">
        <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
          Event Name <span className="text-error">*</span>
        </Label>
        <div className="relative">

          <TextInput
            id="event-name"
            name="title"
            type="text"
            value={title}
            onChange={handleChange}
            sizing="md"
            className="form-control [&>input]:pl-10"
            placeholder="Enter your event name"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Choose a clear, descriptive name that represents your event
        </p>
      </div>

      {/* Description Input */}
      <div>
        <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
          Description
        </Label>
        <CustomTextEditor
          value={description}
          onChange={(content) => handleChange({ target: { name: 'description', value: content } } as any)}
          placeholder="Tell people what your event is about..."
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A good description helps attendees understand your event
          </p>
          <span className="text-xs text-gray-400">
            {description.replace(/<[^>]*>/g, '').length}/500
          </span>
        </div>
      </div>


    </CardBox>
  );
};

export default GeneralDetail;
