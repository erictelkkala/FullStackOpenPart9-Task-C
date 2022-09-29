import {Entry, Gender, newPatient, Patient, NewEntry} from "./types";
import {v4 as uuidv4} from 'uuid';
import isDate from "date-fns/isDate";
import patients from "../data/patients";

const isGender = (gender: unknown): gender is string => {
    return typeof gender === 'string' || gender instanceof String;
};

const isValidGender = (gender: Gender): boolean => {
    // Check if the provided gender exists in the Gender enum
    return Object.values(Gender).includes(gender);
};

const isName = (name: unknown): name is string => {
    return typeof name === 'string' || name instanceof String;
};

const isDoB = (DoB: string): DoB is string => {
    // Patter for the date of birth, YYYY-MM-DD
    const pattern = new RegExp('\\d{4}-\\d{2}-\\d{2}');
    if (!pattern.test(DoB)) {
        throw new Error('Invalid date of birth');
    }
    // Create a date from the input string and check if it is a valid date
    return isDate(new Date(DoB));
};

const isOccupation = (occupation: unknown): occupation is string => {
    return typeof occupation === 'string' || occupation instanceof String;
};

const isSSN = (ssn: unknown): ssn is string => {
    return typeof ssn === 'string' || ssn instanceof String;
};

const isValidSSN = (ssn: string): boolean => {
    // Check if the provided ssn is valid
    // The current SSNs that are valid are 123456-123A and 123456-123B/1234
    // Also ignore the case of the letters in case of user input
    const pattern = new RegExp('\\d{6}[-|A]\\d{3}[\\d-A-Z]', 'i');
    return pattern.test(ssn);
};

export const toNewPatient = (patient: newPatient): Patient => {
    return {
        // Generate a new ID for the patient
        id: uuidv4(),
        name: patient.name,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        occupation: patient.occupation,
        entries: [],
        ssn: patient.ssn
    };
};

export const verifyRequest = (patient: newPatient): boolean => {
    console.log('Verifying request...');
    if (!patient.name || !patient.dateOfBirth || !patient.gender || !patient.occupation || !patient.ssn) {
        throw new Error('Missing required fields');
    } else if (!isGender(patient.gender)) {
        throw new Error('Gender is not of a valid type');
    } else if (!isValidGender(patient.gender)) {
        throw new Error('Value of the chosen gender is not valid');
    } else if (!isName(patient.name)) {
        throw new Error('The provided name is not of a valid type');
    } else if (!isDoB(patient.dateOfBirth)) {
        throw new Error('The provided date of birth is not of a valid type');
    } else if (!isOccupation(patient.occupation)) {
        throw new Error('The provided occupation is not of a valid type');
    } else if (!isSSN(patient.ssn)) {
        throw new Error('The provided social security number is not of a valid type');
    } else if (!isValidSSN(patient.ssn)) {
        throw new Error('The provided social security number is not of a valid format');
    } else {
        console.log('Verifying complete');
        return true;
    }
};

export const toNewEntry = (entry: NewEntry): Entry => {
    return {
        id: uuidv4(),
        ...entry
    };
};

const verifyHealthCheckEntry = (entry: NewEntry): boolean => {
    console.log('Verifying health check entry...');
    console.log('Entry: ', entry);
    if (entry.type !== 'HealthCheck') {
        throw new Error('Invalid type of entry');
    } else if (typeof entry.healthCheckRating !== 'number') {
        throw new Error('Health check rating is not of a valid type');
    } else if (!entry.description || !entry.date || !entry.specialist) {
        throw new Error('Missing required fields');
    } else if (entry.healthCheckRating < 0 || entry.healthCheckRating > 3) {
        throw new Error('Invalid health check rating');
    }
    return true;
};

const verifyOccupationalHealthcareEntry = (entry: NewEntry): boolean => {
    if (entry.type !== 'OccupationalHealthcare') {
        throw new Error('Invalid type of entry');
    } else if (!entry.description || !entry.date || !entry.specialist || !entry.employerName) {
        throw new Error('Missing required fields');
    }
    return true;
};

const verifyHospitalEntry = (entry: NewEntry): boolean => {
    if (entry.type !== 'Hospital') {
        throw new Error('Invalid type of entry');
    } else if (!entry.description || !entry.date || !entry.specialist || !entry.discharge) {
        throw new Error('Missing required fields');
    }
    return true;
};

export const verifyEntry = (entry: NewEntry): boolean => {
    console.log('Verifying entry...');
    console.log('Entry to verify:', entry);
    switch (entry.type) {
        case 'HealthCheck':
            return verifyHealthCheckEntry(entry);
        case 'OccupationalHealthcare':
            return verifyOccupationalHealthcareEntry(entry);
        case 'Hospital':
            return verifyHospitalEntry(entry);
        default:
            throw new Error('Invalid entry type');
    }
};

export const getAllPatients = (): Patient[] => {
    return patients;
};