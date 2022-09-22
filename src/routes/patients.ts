import patientData from '../../data/patients.json';
import { SensitivePatient, newPatient, TypedRequestBody } from '../types';
import { verifyRequest, toNewPatient } from '../utils';
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


const addPatient = (patient: newPatient): newPatient => {
        // Verify that the request is valid
        verifyRequest(patient);
        // Generate a new ID for the patient
        const newPatient = toNewPatient(patient);
        patients.push(newPatient);
        return newPatient;
};


router.get('/', (_req, res) => {
    res.send(getPatients());
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

export default router;