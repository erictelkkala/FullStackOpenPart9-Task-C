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

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: Gender;
    occupation: string;
    ssn: string;
}

// We cannot get a new ID from the client, so omit it for new patients
export type newPatient = Omit<Patient, 'id'>;

export type SensitivePatient = Omit<Patient, 'ssn'>;

// Type the request for new patients, so that the body is of type newPatient
export interface TypedRequestBody extends Express.Request {
    body: newPatient;
}