import patientData from '../../data/patients';
import {
    SensitivePatient,
    newPatient,
    Patient,
    TypedRequestBody,
    TypedRequestBodyEntry, NewEntry
} from '../types';
import {verifyRequest, toNewPatient, toNewEntry, getAllPatients, verifyEntry} from '../utils';
import express from 'express';

const router = express.Router();

// Type assertion to make sure the data is in the correct format
const patients: Array<SensitivePatient> = patientData as Array<SensitivePatient>;


// Return all the patients, excluding ssn
const getPatients = (): SensitivePatient[] => {
    // The SSN will still need to be removed from the data by mapping the array
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
    }));
};

// Find a single patient by ID
// This can also return an undefined value
const getSinglePatient = (id: string): SensitivePatient | undefined => {
    console.log('id', id);
    return patients.find((patient) => patient.id === id);
};

const getPatientEntries = (id: string): Patient | undefined => {
    console.log('id in getPatientEntries', id);
    const allPatients = getAllPatients();
    // console.log('allPatients', allPatients);

    // Find the patient with the provided ID
    // Doesn't work with patient.id === id, need to specify the id property
    const patient = allPatients.find(({id}) => id === id);
    // console.log('patient in getPatientEntries', patient);
    if (patient) {
        return patient;
    }
    return undefined;
};

const addPatient = (patient: newPatient): newPatient => {
        // Verify that the request is valid
        verifyRequest(patient);
        // Generate a new ID for the patient
        const newPatient = toNewPatient(patient);
        patients.push(newPatient);
        return newPatient;
};

const addEntryToPatient = (patient: Patient, entry: NewEntry): Patient => {
    const newEntry = toNewEntry(entry);
    // Add the entry to the patient
    patient.entries.push(newEntry);
    return patient;
};

router.get('/', (_req, res) => {
    res.send(getPatients());
});

router.get('/:id', (req, res) => {
    const patient = getSinglePatient(req.params.id);
    // If patient is found, return it, otherwise return 404
    if (patient) {
        res.send(patient);
    } else {
        res.sendStatus(404);
    }
});

router.post('/', (req: TypedRequestBody, res) => {
    try {
        const newPatient: newPatient = addPatient(req.body);
        res.json(newPatient);
    } catch (e: unknown) {
        let errorMessage = 'Something went wrong.';
        if (e instanceof Error) {
        errorMessage += ' Error: ' + e.message;
    }
        res.status(400).send(errorMessage);
    }
});

router.post('/:id/entries', (req: TypedRequestBodyEntry, res) => {
    console.log('Adding entry to patient');
    // console.log('req.body', req.body);
    // console.log('req.params.id', req.params.id);
    try {
        // Verify that the request is valid
        verifyEntry(req.body);
        const patient = getPatientEntries(req.params.id);
        // console.log('patient', patient);
        if (patient) {
            // Add the entry to the patient
            const updatedPatient = addEntryToPatient(patient, req.body);
            // Return the updated patient
            res.json(updatedPatient);
        } else {
            new Error('Patient not found');
        }
    } catch (e: unknown) {
        let errorMessage = 'Something went wrong.';
        if (e instanceof Error) {
            errorMessage += ' Error: ' + e.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;