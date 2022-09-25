export type Diagnose = {
    code: string;
    name: string;
    latin?: string;
};

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {}

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: Gender;
    occupation: string;
    ssn: string;
    entries: Entry[];
}

// We cannot get a new ID from the client, so omit it for new patients
export type newPatient = Omit<Patient, 'id'>;

export type SensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

// Type the request for new patients, so that the body is of type newPatient
export interface TypedRequestBody extends Express.Request {
    body: newPatient;
}