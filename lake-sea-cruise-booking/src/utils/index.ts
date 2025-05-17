export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const calculateTotalPrice = (pricePerSeat: number, numberOfSeats: number): number => {
    return pricePerSeat * numberOfSeats;
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 9);
};