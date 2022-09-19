import diagnosesData from '../../data/diagnoses.json';
import { Diagnose } from '../types';
import express from 'express';

const router = express.Router();

// Return all the diagnoses
const getEntries = (): Array<Diagnose> => {
    return diagnosesData;
};

router.get('/', (_req, res) => {
    res.send(getEntries());
});

export default router;