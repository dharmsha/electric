'use client';

import { useState, useEffect } from 'react';
import { subscribeToOrder, updateTechnicianLocation } from '@/app/components/lib/orderService';
import { Order } from '@/app/components/lib/orderService';

interface RealTimeOrderTrackingProps {
  orderId: string;
  isTechnician?: boolean;
}

export default function RealTimeOrderTracking({ orderId, isTechnician = false }: RealTimeOrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [technicianLocation, setTechnicianLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to order updates
    const unsubscribe = subscribeToOrder(orderId, (updatedOrder) => {
      if (updatedOrder) {
        setOrder(updatedOrder);
        if (updatedOrder.tracking?.currentLocation) {
          setTechnicianLocation({
            lat: updatedOrder.tracking.currentLocation.lat,
            lng: updatedOrder.tracking.currentLocation.lng
          });
        }
      } else {
        setOrder(null);
      }
    });

    // If technician, start sharing location
    if (isTechnician && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setTechnicianLocation(location);
          setIsLocationSharing(true);
          setLocationError(null);
          
          // Update location in Firebase
          updateTechnicianLocation(orderId, location).catch(error => {
            console.error('Error updating location:', error);
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Failed to get location. Please enable location services.');
          setIsLocationSharing(false);
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 10000,
          timeout: 5000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, [orderId, isTechnician]);

  const handleToggleLocationSharing = () => {
    if (!isTechnician) return;
    
    // In a real app, you would implement start/stop location sharing
    alert('Location sharing controls would be implemented here');
  };

  if (!order) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-gray-600">Loading order details...</div>
      </div>
    );
  }

  // Define status steps
  const statusSteps = [
    { key: 'pending', label: 'Pending' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'technician_assigned', label: 'Technician Assigned' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  // Check if a step is completed
  const isStepCompleted = (stepKey: string) => {
    if (stepKey === order.status) return true;
    
    const stepIndex = statusSteps.findIndex(s => s.key === stepKey);
    const currentIndex = statusSteps.findIndex(s => s.key === order.status);
    
    return stepIndex < currentIndex;
  };

  // Get current step index
  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="mr-2">📍</span>
        Order Tracking #{order.id.slice(0, 8)}
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
      </h3>
      
      {/* Status Timeline */}
      <div className="mb-8">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-500"
              style={{ 
                width: `${currentStepIndex >= 0 ? (currentStepIndex / (statusSteps.length - 1)) * 100 : 0}%` 
              }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mb-4 relative">
            {statusSteps.map((step, index) => {
              const isCompleted = isStepCompleted(step.key);
              const isCurrent = step.key === order.status;
              
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 relative z-10
                    ${isCurrent ? 'bg-green-500 text-white ring-4 ring-green-100' :
                      isCompleted ? 'bg-green-100 text-green-600 ring-2 ring-green-300' :
                      'bg-gray-100 text-gray-400'}`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <span className="text-sm font-medium text-center">{step.label}</span>
                  {isCurrent && (
                    <div className="text-xs text-green-600 mt-1">Current</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Technician Info */}
      {order.technician && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-3">
            <img 
              src={order.technician.photoUrl || '/default-avatar.png'} 
              alt={order.technician.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div className="flex-1">
              <div className="font-bold text-lg">{order.technician.name}</div>
              <div className="text-sm text-gray-600">Assigned Technician</div>
              {order.technician.phone && (
                <div className="text-sm text-gray-700 mt-1">
                  📞 {order.technician.phone}
                </div>
              )}
            </div>
            <div className="ml-auto flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-bold">{order.technician.rating?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
          
          {/* Location Sharing Controls */}
          {isTechnician && (
            <div className="mt-4 p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">Location Sharing</div>
                  <div className="text-sm text-gray-600">
                    {isLocationSharing ? 'Sharing your location' : 'Location sharing is off'}
                  </div>
                </div>
                <button
                  onClick={handleToggleLocationSharing}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    isLocationSharing 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isLocationSharing ? 'Stop Sharing' : 'Start Sharing'}
                </button>
              </div>
              
              {locationError && (
                <div className="text-red-600 text-sm mb-2 p-2 bg-red-50 rounded">
                  ⚠️ {locationError}
                </div>
              )}
            </div>
          )}
          
          {/* Location Display */}
          {technicianLocation && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Current Location:</div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2">●</span>
                    <span>Real-time tracking active</span>
                  </div>
                  <span className="text-green-600 text-sm font-medium">● Live</span>
                </div>
                {/* Map Placeholder */}
                <div className="mt-2 h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center relative">
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg shadow text-sm">
                    Lat: {technicianLocation.lat.toFixed(4)} | Lng: {technicianLocation.lng.toFixed(4)}
                  </div>
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">📍</div>
                    <div className="text-center">
                      <div>Map View</div>
                      <div className="text-sm">(Integrate Google Maps)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Service Type</div>
          <div className="font-medium capitalize">{order.type}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Service Category</div>
          <div className="font-medium">{order.service?.category || 'General Service'}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Scheduled Date</div>
          <div className="font-medium">
            {order.schedule?.preferredDate 
              ? new Date(order.schedule.preferredDate).toLocaleDateString()
              : 'Not scheduled'
            }
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Estimated Cost</div>
          <div className="font-medium">
            ₹{order.service?.estimatedCost?.min?.toLocaleString() || '0'} - 
            ₹{order.service?.estimatedCost?.max?.toLocaleString() || '0'}
          </div>
        </div>
      </div>
      
      {/* Status Updates */}
      <div className="mb-6">
        <h4 className="font-bold mb-4 text-lg">Recent Updates</h4>
        {order.tracking?.statusUpdates && order.tracking.statusUpdates.length > 0 ? (
          <div className="space-y-4">
            {[...order.tracking.statusUpdates]
              .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
              .slice(0, 3)
              .map((update, index) => (
                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 mr-3 flex-shrink-0 ${
                    update.status === 'completed' ? 'bg-green-500' :
                    update.status === 'cancelled' ? 'bg-red-500' :
                    update.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium capitalize text-sm">
                        {update.status.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {update.timestamp?.toDate().toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{update.message}</div>
                    <div className="text-xs text-gray-500">
                      Updated by: {update.updatedBy || 'System'} • 
                      {' '}{update.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
            No status updates yet
          </div>
        )}
      </div>
      
      {/* ETA and Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {order.tracking?.estimatedArrival && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⏱️</span>
              <div>
                <div className="font-bold">Estimated Arrival</div>
                <div className="text-xl font-bold text-green-700">
                  {order.tracking.estimatedArrival.toDate().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Approximately {Math.round((order.tracking.estimatedArrival.toMillis() - Date.now()) / (1000 * 60))} minutes
                </div>
              </div>
            </div>
          </div>
        )}
        
        {order.location && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">📍</span>
              <div className="font-medium">Service Location</div>
            </div>
            <div className="text-sm text-gray-700">
              {order.location.address}
              {order.location.city && `, ${order.location.city}`}
              {order.location.pincode && ` - ${order.location.pincode}`}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {order.location.type === 'home' ? 'Home Service' : 'Shop Visit'}
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons for Technician */}
      {isTechnician && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Start Service
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">
              Mark Complete
            </button>
            <button className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg font-medium hover:bg-red-200 transition">
              Report Issue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}