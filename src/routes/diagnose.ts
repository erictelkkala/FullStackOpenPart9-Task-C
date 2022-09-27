import diagnosesData from '../../data/diagnoses.json';
import { Diagnosis } from '../types';
import express from 'express';

const router = express.Router();

// Return all the diagnoses
const getEntries = (): Array<Diagnosis> => {
    return diagnosesData;
};

router.get('/', (_req, res) => {
    res.send(getEntries());
});

export default router;