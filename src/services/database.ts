import { supabase } from '../lib/supabase';
import { Resident, Pet, FormData } from '../types';

export const databaseService = {
  // Residents
  async createResident(resident: Omit<Resident, 'id' | 'userId' | 'createdAt'>, userId: string): Promise<Resident> {
    const { data, error } = await supabase
      .from('residents')
      .insert([{
        user_id: userId,
        name: resident.name,
        apartment: resident.apartment,
        phone: resident.phone,
        email: resident.email
      }])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      apartment: data.apartment,
      phone: data.phone,
      email: data.email,
      createdAt: data.created_at
    };
  },

  async getResidents(): Promise<Resident[]> {
    const { data, error } = await supabase
      .from('residents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(resident => ({
      id: resident.id,
      userId: resident.user_id,
      name: resident.name,
      apartment: resident.apartment,
      phone: resident.phone,
      email: resident.email,
      createdAt: resident.created_at
    }));
  },

  async getUserResident(userId: string): Promise<Resident | null> {
    try {
      const { data, error } = await supabase
        .from('residents')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        console.error('Erro ao buscar residente:', error);
        
        // Se for erro 406, retornar null em vez de lançar erro
        if (error.code === '406' || error.message.includes('406')) {
          console.warn('Erro 406 - RLS pode estar bloqueando acesso. Retornando null.');
          return null;
        }
        
        throw new Error(`Erro ao buscar dados do morador: ${error.message}`);
      }
    
      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        apartment: data.apartment,
        phone: data.phone,
        email: data.email,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Erro inesperado ao buscar residente:', error);
      return null;
    }
  },

  // Pets
  async createPet(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert([{
        resident_id: pet.residentId,
        resident_name: pet.residentName,
        resident_apartment: pet.residentApartment,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        description: pet.description,
        photo: pet.photo
      }])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      residentId: data.resident_id,
      residentName: data.resident_name,
      residentApartment: data.resident_apartment,
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      description: data.description,
      photo: data.photo,
      createdAt: data.created_at
    };
  },

  async getPets(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(pet => ({
      id: pet.id,
      residentId: pet.resident_id,
      residentName: pet.resident_name,
      residentApartment: pet.resident_apartment,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      photo: pet.photo,
      createdAt: pet.created_at
    }));
  },

  async getUserPets(userId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select(`
        *,
        residents!inner(user_id)
      `)
      .eq('residents.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(pet => ({
      id: pet.id,
      residentId: pet.resident_id,
      residentName: pet.resident_name,
      residentApartment: pet.resident_apartment,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      description: pet.description,
      photo: pet.photo,
      createdAt: pet.created_at
    }));
  },

  async registerPetWithResident(formData: FormData, userId: string): Promise<{ resident: Resident; pet: Pet }> {
    // First create the resident
    const resident = await this.createResident(formData.resident, userId);
    
    // Then create the pet with resident information
    const pet = await this.createPet({
      residentId: resident.id,
      residentName: resident.name,
      residentApartment: resident.apartment,
      ...formData.pet
    });

    return { resident, pet };
  },

  async addPetToExistingResident(petData: Omit<Pet, 'id' | 'residentId' | 'residentName' | 'residentApartment' | 'createdAt'>, resident: Resident): Promise<Pet> {
    return this.createPet({
      residentId: resident.id,
      residentName: resident.name,
      residentApartment: resident.apartment,
      ...petData
    });
  }
};