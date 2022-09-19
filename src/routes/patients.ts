import patientData from '../../data/patients.json';
import { SensitivePatient } from '../types';
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


router.get('/', (_req, res) => {
    res.send(getPatients());
});

export default router;