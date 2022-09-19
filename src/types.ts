export type Diagnose = {
    code: string;
    name: string;
    latin?: string;
};

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: "male" | "female";
    occupation: string;
    ssn: string;
}

export type SensitivePatient = Omit<Patient, 'ssn'>;
