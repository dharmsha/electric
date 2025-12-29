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

  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (updatedOrder) => {
      setOrder(updatedOrder);
      if (updatedOrder.tracking.currentLocation) {
        setTechnicianLocation({
          lat: updatedOrder.tracking.currentLocation.lat,
          lng: updatedOrder.tracking.currentLocation.lng
        });
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
          updateTechnicianLocation(orderId, location);
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 10000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, [orderId, isTechnician]);

  if (!order) {
    return <div className="text-center py-8">Loading order details...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="mr-2">📍</span>
        Order Tracking #{order.id.slice(0, 8)}
      </h3>
      
      {/* Status Timeline */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['pending', 'accepted', 'in_progress', 'completed'].map((status, index) => (
            <div key={status} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${order.status === status ? 'bg-green-500 text-white' :
                  order.tracking.statusUpdates.some(s => s.status === status) ? 'bg-green-100 text-green-600' :
                  'bg-gray-100 text-gray-400'}`}>
                {index + 1}
              </div>
              <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Technician Info */}
      {order.technician && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center mb-3">
            <img 
              src={order.technician.photoUrl} 
              alt={order.technician.name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <div className="font-bold">{order.technician.name}</div>
              <div className="text-sm text-gray-600">Assigned Technician</div>
            </div>
            <div className="ml-auto flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{order.technician.rating.toFixed(1)}</span>
            </div>
          </div>
          
          {technicianLocation && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Current Location:</div>
              <div className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span>📱 Real-time tracking active</span>
                  <span className="text-green-600 text-sm">● Live</span>
                </div>
                {/* In production, integrate Google Maps here */}
                <div className="mt-2 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  Map View - Technician Location
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Status Updates */}
      <div>
        <h4 className="font-bold mb-4">Recent Updates</h4>
        <div className="space-y-4">
          {order.tracking.statusUpdates.slice(-3).reverse().map((update, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-3 h-3 rounded-full mt-2 mr-3 ${
                update.status === 'completed' ? 'bg-green-500' :
                update.status === 'cancelled' ? 'bg-red-500' :
                'bg-blue-500'
              }`}></div>
              <div>
                <div className="font-medium capitalize">{update.status.replace('_', ' ')}</div>
                <div className="text-sm text-gray-600">{update.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {update.timestamp.toDate().toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ETA */}
      {order.tracking.estimatedArrival && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⏱️</span>
            <div>
              <div className="font-bold">Estimated Arrival</div>
              <div className="text-lg">
                {order.tracking.estimatedArrival.toDate().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}