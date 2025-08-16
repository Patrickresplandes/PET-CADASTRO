export interface Resident {
  id: string;
  userId: string;
  name: string;
  block: string;
  apartment: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  residentId: string;
  residentName: string;
  residentBlock: string;
  residentApartment: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  photo: string;
  createdAt: string;
}

export interface FormData {
  resident: Omit<Resident, 'id' | 'userId' | 'createdAt'>;
  pet: Omit<Pet, 'id' | 'residentId' | 'residentName' | 'residentBlock' | 'residentApartment' | 'createdAt'>;
}

export interface User {
  id: string;
  email: string;
}