import { useContext } from 'react';
import { Label, Radio, TextInput, Button, Alert } from 'flowbite-react';
import { Icon } from '@iconify/react';
import CardBox from 'src/components/shared/CardBox';
import { AuthContext } from 'src/context/authContext/AuthContext';

const Pricing = ({ eventData, setEventData }: any) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const hasGST = !!user?.GST;
  const isRoutine = eventData.type === 'Routine';
  const handleRadioChange = (event: any) => {
    setEventData({ ...eventData, isTicketed: event.target.value === 'ticketed', tickets: [] });
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedTickets = eventData.tickets.map((ticket: any, i: number) => {
      if (i !== index) return ticket;

      const newTicket = { ...ticket, [field]: value };

      if (field === 'ticketPrice') {
        newTicket.enteredPrice = value;
        const basePrice = parseFloat(value) || 0;

        if (user?.GST) {
          console.log("===>", user?.GST)
          const gstAmt = basePrice * 0.18;
          newTicket.gst_amount = gstAmt;
          newTicket.ticketPrice = (basePrice + gstAmt).toFixed(2);
        } else {
          console.log("===>user not gst", user?.GST)
          newTicket.ticketPrice = value;
          newTicket.gst_amount = 0;
        }
      }
      return newTicket;
    });

    setEventData({ ...eventData, tickets: updatedTickets });
  };

  const addTicket = () => {
    setEventData({
      ...eventData,
      tickets: [...eventData.tickets, { ticketName: '', ticketPrice: '', enteredPrice: '', gst_amount: 0, quantity: '' }],
    });
  };

  const removeTicket = (index: any) => {
    const updatedTickets = eventData.tickets.filter((_: any, i: any) => i !== index);
    setEventData({ ...eventData, tickets: updatedTickets });
  };

  const updateSubscriptionTicket = (billingCycle: string, price: string, capacity: number) => {
    const basePrice = parseFloat(price) || 0;
    let gstAmt = 0;
    let finalPrice = basePrice;

    if (user?.GST) {
      gstAmt = basePrice * 0.18;
      finalPrice = basePrice + gstAmt;
    }

    const ticket = {
      ticketName: `${billingCycle} Subscription`,
      ticketPrice: Number(finalPrice.toFixed(2)),
      enteredPrice: price,
      gst_amount: Number(gstAmt.toFixed(2)),
      quantity: capacity || 0
    };

    setEventData({
      ...eventData,
      isTicketed: true,
      tickets: [ticket],
      subscriptionPricing: {
        billingCycle,
        price
      },
      subscriptionCapacity: capacity
    });
  };

  return (
    <div className={`grid gap-6 items-start ${eventData.isTicketed && !isRoutine ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
      {/* Left Side - Activity Type Selection */}
      <CardBox>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
            <Icon icon="tabler:ticket" className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h5 className="text-lg font-semibold text-dark dark:text-white">Pricing</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">Set your event pricing</p>
          </div>
        </div>

        {!isRoutine && (
          <>
            {/* Activity Type Selection */}
            <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3 block">
              Activity Type
            </Label>
            <div className="space-y-3">
              <label
                htmlFor="free-activity"
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${!eventData.isTicketed
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${!eventData.isTicketed ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  <Icon icon="tabler:gift" className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm text-dark dark:text-white">Free Activity</span>
                  <p className="text-xs text-gray-500">No ticket required</p>
                </div>
                <Radio
                  id="free-activity"
                  name="isTicketed"
                  value="free"
                  checked={!eventData.isTicketed}
                  onChange={handleRadioChange}
                  className="sr-only"
                />
                {!eventData.isTicketed && (
                  <Icon icon="tabler:circle-check-filled" className="w-5 h-5 text-primary" />
                )}
              </label>

              <label
                htmlFor="ticketed-activity"
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${eventData.isTicketed
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${eventData.isTicketed ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  <Icon icon="tabler:ticket" className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm text-dark dark:text-white">Ticketed Activity</span>
                  <p className="text-xs text-gray-500">Sell tickets</p>
                </div>
                <Radio
                  id="ticketed-activity"
                  name="isTicketed"
                  value="ticketed"
                  checked={eventData.isTicketed}
                  onChange={handleRadioChange}
                  className="sr-only"
                />
                {eventData.isTicketed && (
                  <Icon icon="tabler:circle-check-filled" className="w-5 h-5 text-primary" />
                )}
              </label>
            </div>
          </>
        )}

        {isRoutine && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Icon icon="tabler:info-circle" className="w-4 h-4" />
                <span>Routine subscriptions are always ticketed.</span>
              </div>
            </div>

            {hasGST && (
              <Alert color="info" className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                <div className="flex items-start gap-3">
                  <Icon icon="tabler:info-circle" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    If you have a GST registered so please enter the ticket amount without GST.
                  </p>
                </div>
              </Alert>
            )}

            <div>
              <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                Billing Cycle
              </Label>
              <div className="flex items-center gap-2">
                {['Weekly', 'Monthly'].map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => updateSubscriptionTicket(cycle, eventData.subscriptionPricing?.price || '', eventData.subscriptionCapacity || 0)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border ${eventData.subscriptionPricing?.billingCycle === cycle
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                Subscription Price
              </Label>
              <TextInput
                type="number"
                min={0}
                value={eventData.subscriptionPricing?.price || ''}
                onChange={(e) => updateSubscriptionTicket(eventData.subscriptionPricing?.billingCycle || 'Monthly', e.target.value, eventData.subscriptionCapacity || 0)}
                placeholder="Enter price"
              />
              {hasGST && eventData.subscriptionPricing?.price && (
                <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  GST 18%: ₹{(Number(eventData.subscriptionPricing.price || 0) * 0.18).toFixed(2)} | Total: ₹{(Number(eventData.subscriptionPricing.price || 0) * 1.18).toFixed(2)}
                </p>
              )}
            </div>

            <div>
              <Label className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                Capacity (per session)
              </Label>
              <TextInput
                type="number"
                min={1}
                value={eventData.subscriptionCapacity || ''}
                onChange={(e) => updateSubscriptionTicket(eventData.subscriptionPricing?.billingCycle || 'Monthly', eventData.subscriptionPricing?.price || '', Number(e.target.value))}
                placeholder="Enter capacity"
              />
            </div>
          </div>
        )}

        {/* Free Activity Message */}
        {!eventData.isTicketed && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3">
              <Icon icon="tabler:check" className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Free Event</p>
                <p className="text-xs text-green-600 dark:text-green-300">No tickets will be required</p>
              </div>
            </div>
          </div>
        )}
      </CardBox>

      {/* Right Side - Tickets (Only shown when ticketed) */}
      {eventData.isTicketed && !isRoutine && (
        <CardBox>
          {/* Tickets Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#f8e8ec] flex items-center justify-center">
                <Icon icon="tabler:list-details" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h5 className="text-lg font-semibold text-dark dark:text-white">Tickets</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">{eventData.tickets.length} ticket type{eventData.tickets.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <Button
              size="sm"
              color="primary"
              onClick={addTicket}
              className="flex items-center gap-1"
            >
              <Icon icon="tabler:plus" className="w-4 h-4" />
              Add
            </Button>
          </div>
          {hasGST && (
            <Alert color="info" className="mb-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex items-start gap-3">
                <Icon icon="tabler:info-circle" className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  If you have a GST registered so please enter the ticket amount without GST.
                </p>
              </div>
            </Alert>
          )}

          {/* Tickets List */}
          {eventData.tickets.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-3">
                <Icon icon="tabler:ticket-off" className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No tickets added</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add" to create a ticket</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {eventData.tickets.map((ticket: any, index: any) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  {/* Ticket Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm text-dark dark:text-white">
                        {ticket.ticketName || `Ticket ${index + 1}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTicket(index)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Icon icon="tabler:trash" className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Ticket Fields */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Name</Label>
                      <TextInput
                        type="text"
                        value={ticket.ticketName}
                        onChange={(e) => handleInputChange(index, 'ticketName', e.target.value)}
                        placeholder="VIP"
                        sizing="sm"
                        className="form-control"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Price (₹)</Label>
                      <TextInput
                        type="number"
                        value={ticket.enteredPrice ?? ticket.ticketPrice}
                        onChange={(e) => handleInputChange(index, 'ticketPrice', e.target.value)}
                        placeholder="500"
                        sizing="sm"
                        className="form-control"
                      />
                      {hasGST && ticket.enteredPrice && (
                        <p className="text-[10px] text-primary mt-1 font-medium">
                          Total: ₹{ticket.ticketPrice} (inc. 18% GST)
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Qty</Label>
                      <TextInput
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        placeholder="100"
                        sizing="sm"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          {eventData.tickets.length > 0 && (
            <div className="mt-4 p-3 bg-primary/5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="tabler:chart-pie" className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">
                  Total capacity
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {eventData.tickets.reduce((sum: number, t: any) => sum + (parseInt(t.quantity) || 0), 0)} seats
              </span>
            </div>
          )}
        </CardBox>
      )}
    </div>
  );
};

export default Pricing;
