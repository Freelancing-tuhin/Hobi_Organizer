import { Icon } from '@iconify/react/dist/iconify.js';
import { Modal, Button, TextInput, Label, Checkbox } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { editEvent } from 'src/service/editEvent';
import CustomTextEditor from '../addProduct/CustomTextEditor';

const EditEventModal = ({ open, onClose, eventData, getEvents }: any) => {
  const [editedEvent, setEditedEvent] = useState(eventData);
  const [step, setStep] = useState(1);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setEditedEvent((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    if (!editedEvent?.tickets) return; // Ensure tickets exist

    const updatedTickets = [...editedEvent.tickets]; // Clone array
    updatedTickets[index] = { ...updatedTickets[index], [field]: value }; // Update ticket

    setEditedEvent({ ...editedEvent, tickets: updatedTickets }); // Update state
  };

  const addTicket = () => {
    setEditedEvent((prevEvent: any) => ({
      ...prevEvent,
      tickets: [...(prevEvent?.tickets || []), { ticketName: '', ticketPrice: '' }],
    }));
  };

  const removeTicket = (index: number) => {
    setEditedEvent((prevEvent: any) => ({
      ...prevEvent,
      tickets: prevEvent?.tickets?.filter((_: any, i: any) => i !== index) || [],
    }));
  };
  const handleSave = async () => {
    // onSave(editedEvent);
    try {
      const updatedData = editedEvent;
      const eventId = eventData?._id;
      await editEvent(eventId, updatedData);
      getEvents();
      onClose();
    } catch (error) { }
  };

  useEffect(() => {
    setEditedEvent(eventData);
  }, [eventData]);

  return (
    <Modal show={open} onClose={onClose} title="Edit Event" size="2xl" dismissible className="">
      <div className="p-6 space-y-4 max-h-[80rem]">
        <div className="">
          <div className="text-2xl font-semibold text-gray-800">Edit Event</div>
          <div className="text-sm text-gray-600 mb-4 mt-2">Edit details of the selected event</div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
          <div
            className="h-full bg-[#b03052] transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
        {/* <div className="flex justify-between text-sm text-gray-600">
          <span>Step 1</span>
          <span>Step 2</span>
          <span>Step 3</span>
        </div> */}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title" value="Event Title" />
              <TextInput
                id="title"
                name="title"
                value={editedEvent?.title || ''}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description" value="Description" className="mb-2 block" />
              <CustomTextEditor
                value={editedEvent?.description || ''}
                onChange={(content) => setEditedEvent((prev: any) => ({ ...prev, description: content }))}
                placeholder="Enter event description..."
              />
            </div>
            {/* <div>
              <Label htmlFor="category" value="Category" />
              <TextInput
                id="category"
                name="category"
                value={editedEvent?.category || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="type" value="Type" />
              <TextInput
                id="type"
                name="type"
                value={editedEvent?.type || ''}
                onChange={handleChange}
              />
            </div> */}
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate" value="Start Date" />
              <TextInput
                id="startDate"
                name="startDate"
                type="date"
                value={editedEvent?.startDate || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="startTime" value="Start Time" />
              <TextInput
                id="startTime"
                name="startTime"
                type="time"
                value={editedEvent?.startTime || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="endTime" value="End Time" />
              <TextInput
                id="endTime"
                name="endTime"
                type="time"
                value={editedEvent?.endTime || ''}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="location" value="Location" />
              <TextInput
                id="location"
                name="location"
                value={editedEvent?.location?.address || ''}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-2 col-span-2">
              <Checkbox
                id="isTicketed"
                name="isTicketed"
                checked={editedEvent?.isTicketed || false}
                onChange={handleChange}
              />
              <Label htmlFor="isTicketed" value="Is Ticketed" />
            </div>
            {editedEvent?.isTicketed && (
              <>
                {editedEvent.tickets.map((ticket: any, index: number) => (
                  <div key={index} className="relative border p-4 rounded-lg shadow-sm bg-white">
                    {/* Cross Icon for Removing Ticket */}
                    <button
                      onClick={() => removeTicket(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                    >
                      <Icon
                        icon="solar:trash-bin-trash-linear"
                        height="18"
                        className="text-ld text-red-700"
                      />
                    </button>

                    {/* Ticket Name Input */}
                    <div className="mb-2">
                      <Label
                        htmlFor={`ticketName-${index}`}
                        value={`Ticket ${index + 1}`}
                        className="font-semibold"
                      />
                    </div>
                    <TextInput
                      id={`ticketName-${index}`}
                      type="text"
                      name="ticketName"
                      value={ticket.ticketName}
                      onChange={(e) => handleInputChange(index, 'ticketName', e.target.value)}
                      placeholder="Enter ticket name"
                      className="w-full"
                    />

                    {/* Ticket Price Input */}
                    <div className="mt-3">
                      <Label
                        htmlFor={`ticketPrice-${index}`}
                        value="Ticket Price"
                        className="font-medium"
                      />
                      <TextInput
                        id={`ticketPrice-${index}`}
                        type="number"
                        name="ticketPrice"
                        value={ticket.ticketPrice}
                        onChange={(e) => handleInputChange(index, 'ticketPrice', e.target.value)}
                        placeholder="Enter ticket price"
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
                <Button color="primary" className="mt-3 h-10 w-32" onClick={addTicket}>
                  Add Ticket
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <Modal.Footer className="flex justify-between">
        {step > 1 && (
          <Button color="light" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        {step < 3 ? (
          <Button color="success" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        ) : (
          <Button color="success" onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditEventModal;
