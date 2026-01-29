export interface Patient {
  id: string;
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  documentPhotoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePatientDto = Omit<Patient, 'id' | 'documentPhotoUrl' | 'createdAt' | 'updatedAt'> & {
  documentPhoto: File;
};

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

