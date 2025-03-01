import React, { useState } from 'react';

const SeatSelection = ({ showtime, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'available') {
      const isSelected = selectedSeats.find(
        s => s.row === seat.row && s.number === seat.number
      );

      let newSelectedSeats;
      if (isSelected) {
        newSelectedSeats = selectedSeats.filter(
          s => !(s.row === seat.row && s.number === seat.number)
        );
      } else {
        newSelectedSeats = [...selectedSeats, seat];
      }

      setSelectedSeats(newSelectedSeats);
      onSeatSelect(newSelectedSeats);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.status === 'booked') return 'bg-gray-500';
    if (seat.status === 'reserved') return 'bg-yellow-500';
    if (selectedSeats.find(s => s.row === seat.row && s.number === seat.number)) {
      return 'bg-green-500';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  // Group seats by row
  const seatsByRow = showtime.availableSeats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto">
      {/* Screen */}
      <div className="w-full h-8 bg-gray-300 rounded-t-lg mb-8 text-center text-sm text-gray-600">
        Screen
      </div>

      {/* Seats */}
      <div className="space-y-2">
        {Object.entries(seatsByRow).map(([row, seats]) => (
          <div key={row} className="flex justify-center gap-2">
            <span className="w-6 text-center">{row}</span>
            {seats.map((seat) => (
              <button
                key={`${seat.row}${seat.number}`}
                onClick={() => handleSeatClick(seat)}
                disabled={seat.status !== 'available'}
                className={`
                  w-8 h-8 rounded-t-lg text-white text-sm font-semibold
                  ${getSeatColor(seat)}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {seat.number}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection; 