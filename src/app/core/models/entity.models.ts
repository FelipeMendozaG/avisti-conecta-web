/** Estado de verificación del perfil institucional. */
export type VerificationStatus = 'PENDING' | 'VERIFIED' | (string & {});

/** Tipo de entidad institucional (valor libre según la API; ej. `ONG`). */
export type EntityType = string;

/** Perfil institucional (tabla `entities`). */
export interface Entity {
  entity_id: number;
  tax_id: string;
  company_name: string;
  entity_type: EntityType;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  verification_status: VerificationStatus;
  registration_date: string;
  user_id: number;
}

/** Payload de alta del perfil institucional (`POST /entities/`). */
export interface CreateEntityRequest {
  tax_id: string;
  company_name: string;
  entity_type: EntityType;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
}

/** Payload de actualización (`PUT /entities/:id`); todos los campos opcionales. */
export interface UpdateEntityRequest {
  tax_id?: string;
  company_name?: string;
  entity_type?: EntityType;
  address?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}
