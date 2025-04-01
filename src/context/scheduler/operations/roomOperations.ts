
import { Room } from '../types';
import { toast } from 'sonner';

export const createRoomOperations = (
  rooms: Room[],
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>
) => {
  const getRoomById = (id: string) => rooms.find(r => r.id === id);
  
  const addRoom = (roomData: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`
    };
    
    setRooms(prev => [...prev, newRoom]);
    toast.success(`Room ${roomData.number} added successfully`);
  };
  
  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
    toast.success(`Room ${updatedRoom.number} updated successfully`);
  };
  
  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    toast.success("Room deleted successfully");
  };

  return {
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom
  };
};
