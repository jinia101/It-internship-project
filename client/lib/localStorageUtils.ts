import { v4 as uuidv4 } from 'uuid';

interface Service {
  id: string;
  name: string;
  summary: string;
  applicationMode: string;
  eligibility: string;
  contactName?: string;
  designation?: string;
  contact?: string;
  email?: string;
  district?: string;
  subDistrict?: string;
  block?: string;
  serviceDetails?: string;
  status: 'pending' | 'published';
  processNew?: string;
  processUpdate?: string;
  processLost?: string;
  processSurrender?: string;
  docNew?: string;
  docUpdate?: string;
  docLost?: string;
  docSurrender?: string;
  onlineUrl?: string;
  offlineAddress?: string;
  tags: string[];
}

const LOCAL_STORAGE_KEY = 'services';

export const getServices = (): Service[] => {
  const services = localStorage.getItem(LOCAL_STORAGE_KEY);
  return services ? JSON.parse(services) : [];
};

export const saveService = (service: Omit<Service, 'id'>): Service => {
  const services = getServices();
  const newService = { ...service, id: uuidv4() };
  services.push(newService);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  return newService;
};

export const updateService = (updatedService: Service): Service => {
  let services = getServices();
  services = services.map((service) =>
    service.id === updatedService.id ? updatedService : service
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  return updatedService;
};

export const deleteService = (id: string): void => {
  let services = getServices();
  services = services.filter((service) => service.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
};

export const getServiceById = (id: string): Service | undefined => {
  const services = getServices();
  return services.find(service => service.id === id);
};
