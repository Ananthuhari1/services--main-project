import React, { useState } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { updateCartItemQuantity } from '../assistance/userAssistance';
import { toast } from 'react-toastify';

const CartCard = ({ service, onRemove, loading }) => {
  const [quantity, setQuantity] = useState(service.quantity || 1);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(true);
      // Call your API to update the cart item quantity
      // await updateCartItemQuantity(service.serviceId?._id || service.serviceId, newQuantity);
      setQuantity(newQuantity);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(error.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl shadow-md overflow-hidden mb-4">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Service Image */}
          <div className="w-full md:w-32 h-32 bg-base-200 rounded-xl overflow-hidden flex-shrink-0">
            {service.serviceId?.image ? (
              <img
                src={service.serviceId.image}
                alt={service.serviceId.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/30">
                <svg
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Service Details */}
          <div className="flex-1">
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-base-content line-clamp-1">
                  {service.serviceId?.name || 'Service Name'}
                </h3>
                <p className="text-sm text-base-content/70 line-clamp-2 mt-1">
                  {service.serviceId?.description || 'Service description not available'}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {/* Quantity Selector */}
                <div className="flex items-center border border-base-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={updating || loading}
                    className="px-3 py-1 bg-base-200 hover:bg-base-300 transition-colors disabled:opacity-50"
                  >
                    <FaMinus className="h-3 w-3" />
                  </button>
                  <span className="px-4 py-1 bg-base-100 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={updating || loading}
                    className="px-3 py-1 bg-base-200 hover:bg-base-300 transition-colors disabled:opacity-50"
                  >
                    <FaPlus className="h-3 w-3" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    ₹{(service.serviceId?.price * quantity).toFixed(2)}
                  </p>
                  {quantity > 1 && (
                    <p className="text-xs text-base-content/50">
                      ₹{service.serviceId?.price?.toFixed(2)} each
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <div className="flex items-start">
            <button
              onClick={() => onRemove(service.serviceId?._id || service.serviceId)}
              disabled={loading}
              className={`p-2 rounded-full hover:bg-base-200 transition-colors ${
                loading ? 'opacity-50' : 'text-error hover:text-error-focus'
              }`}
              aria-label="Remove item"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaTrash className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;