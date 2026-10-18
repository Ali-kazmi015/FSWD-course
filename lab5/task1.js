
'use strict';

// ============================================
// 1. APPLICANT DATA
// ============================================

const applicants = [
    {
        id: 'A101',
        name: 'Sara Khan',
        age: '19',
        matricMarks: '91',
        intermediateMarks: '87',
        entryTest: '78',
        program: 'BSCS',
        feePaid: 'true'
    },
    {
        id: 'A102',
        name: 'Ahmed Ali',
        age: 'twenty',
        matricMarks: '88',
        intermediateMarks: '',
        entryTest: '72',
        program: 'BSSE',
        feePaid: 'false'
    },
    {
        id: 'A103',
        name: 'Hassan',
        age: '18',
        matricMarks: '76',
        intermediateMarks: '83',
        entryTest: '91',
        program: 'BSAI',
        feePaid: 'true'
    }
];

const supportedPrograms = ['BSCS', 'BSSE', 'BSAI'];


// ============================================
// 2. CHECK MISSING VALUES
// ============================================

function isMissing(value) {
    return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
    );
}


// ============================================
// 3. CONVERT VALUES INTO NUMBERS
// ============================================

function readNumber(value, fieldName, errors) {

    if (isMissing(value)) {
        errors.push(`${fieldName} is missing`);
        return null;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
        errors.push(`${fieldName} must be a number or numeric string`);
        return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        errors.push(`${fieldName} must be a valid number`);
        return null;
    }

    return number;
}


// ============================================
// 4. VALIDATE MARKS
// ============================================

function validateMarks(marks, fieldName, errors) {

    if (marks === null) {
        return;
    }

    if (marks < 0 || marks > 100) {
        errors.push(`${fieldName} must be between 0 and 100`);
    }
}


// ============================================
// 5. PROCESS AN INDIVIDUAL APPLICANT
// ============================================

function processApplicant(applicant) {

    const errors = [];

    // Check applicant record.
    if (
        applicant === null ||
        typeof applicant !== 'object' ||
        Array.isArray(applicant)
    ) {
        return {
            id: null,
            name: null,
            status: 'INVALID DATA',
            merit: null,
            errors: ['Applicant record must be an object']
        };
    }

    const { id, name, program } = applicant;

    // Validate ID and name.
    if (isMissing(id)) {
        errors.push('Applicant ID is missing');
    }

    if (isMissing(name)) {
        errors.push('Applicant name is missing');
    }

    // Validate program.
    if (isMissing(program)) {
        errors.push('Program is missing');
    } else if (
        typeof program !== 'string' ||
        !supportedPrograms.includes(program)
    ) {
        errors.push('Unsupported program');
    }

    // Convert numeric values.
    const age = readNumber(applicant.age, 'Age', errors);

    const matricMarks = readNumber(
        applicant.matricMarks,
        'Matric marks',
        errors
    );

    const intermediateMarks = readNumber(
        applicant.intermediateMarks,
        'Intermediate marks',
        errors
    );

    const entryTest = readNumber(
        applicant.entryTest,
        'Entry test marks',
        errors
    );

    // Validate age: 17 to 30.
    if (age !== null && (age < 17 || age > 30)) {
        errors.push('Age must be between 17 and 30');
    }

    // Validate marks: 0 to 100.
    validateMarks(matricMarks, 'Matric marks', errors);

    validateMarks(
        intermediateMarks,
        'Intermediate marks',
        errors
    );

    validateMarks(entryTest, 'Entry test marks', errors);

    // Explicitly convert feePaid to a boolean.
    let feePaid = null;

    if (typeof applicant.feePaid === 'boolean') {
        feePaid = applicant.feePaid;
    } else if (applicant.feePaid === 'true') {
        feePaid = true;
    } else if (applicant.feePaid === 'false') {
        feePaid = false;
    } else {
        errors.push('Fee payment status must be true or false');
    }

    // Do not calculate merit if the data is invalid.
    if (errors.length > 0) {
        return {
            id: id ?? null,
            name: name ?? null,
            program: program ?? null,
            status: 'INVALID DATA',
            merit: null,
            feePaid,
            errors
        };
    }

    // ========================================
    // 6. CALCULATE MERIT
    // ========================================

    const merit =
        matricMarks * 0.20 +
        intermediateMarks * 0.30 +
        entryTest * 0.50;

    const roundedMerit = Number(merit.toFixed(2));

    // ========================================
    // 7. CHECK ELIGIBILITY
    // ========================================

    const eligible =
        roundedMerit >= 70 &&
        entryTest >= 60 &&
        intermediateMarks >= 60;

    // ========================================
    // 8. ASSIGN ADMISSION STATUS
    // ========================================

    let status;

    if (!eligible) {
        status = 'REJECTED';
    } else if (roundedMerit >= 80) {
        status = 'SELECTED';
    } else {
        status = 'WAITING';
    }

    // Return the processed applicant.
    return {
        id,
        name,
        age,
        matricMarks,
        intermediateMarks,
        entryTest,
        program,
        feePaid,
        merit: roundedMerit,
        eligible,
        status,
        errors
    };
}


// ============================================
// 9. PROCESS ALL APPLICANTS
// ============================================

function processAllApplicants(applicantList) {

    if (!Array.isArray(applicantList)) {
        throw new TypeError('Applicants must be an array');
    }

    return applicantList.map(processApplicant);
}


// ============================================
// 10. GENERATE FINAL SUMMARY
// ============================================

function generateSummary(results) {

    const validApplicants = results.filter(
        applicant => applicant.status !== 'INVALID DATA'
    );

    const invalidApplicants = results.filter(
        applicant => applicant.status === 'INVALID DATA'
    );

    const summary = {
        totalApplicants: results.length,
        validApplicants: validApplicants.length,
        invalidApplicants: invalidApplicants.length,
        highestMeritApplicant: null,
        lowestMerit: null,
        averageMerit: null,
        programCounts: {
            BSCS: 0,
            BSSE: 0,
            BSAI: 0
        }
    };

    // Count applicants in each supported program.
    for (const applicant of results) {

        if (supportedPrograms.includes(applicant.program)) {

            switch (applicant.program) {

                case 'BSCS':
                    summary.programCounts.BSCS++;
                    break;

                case 'BSSE':
                    summary.programCounts.BSSE++;
                    break;

                case 'BSAI':
                    summary.programCounts.BSAI++;
                    break;
            }
        }
    }

    // Handle the case where no valid applicants exist.
    if (validApplicants.length === 0) {
        return summary;
    }

    let highest = validApplicants[0];
    let lowestMerit = validApplicants[0].merit;
    let totalMerit = 0;

    // Calculate highest, lowest, and total merit.
    for (const applicant of validApplicants) {

        totalMerit += applicant.merit;

        if (applicant.merit > highest.merit) {
            highest = applicant;
        }

        if (applicant.merit < lowestMerit) {
            lowestMerit = applicant.merit;
        }
    }

    summary.highestMeritApplicant = {
        id: highest.id,
        name: highest.name,
        merit: highest.merit
    };

    summary.lowestMerit = lowestMerit;

    summary.averageMerit = Number(
        (totalMerit / validApplicants.length).toFixed(2)
    );

    return summary;
}


// ============================================
// 11. RUN THE PROGRAM
// ============================================

const results = processAllApplicants(applicants);

const summary = generateSummary(results);

console.log('========== APPLICANT RESULTS ==========');
console.log(JSON.stringify(results, null, 2));

console.log('\n========== FINAL SUMMARY ==========');
console.log(JSON.stringify(summary, null, 2));


// ============================================
// 12. ADDITIONAL TEST CASES
// ============================================

const testApplicants = [
    {
        id: 'T101',
        name: 'Boundary Age',
        age: '17',
        matricMarks: '100',
        intermediateMarks: '100',
        entryTest: '100',
        program: 'BSCS',
        feePaid: 'true'
    },
    {
        id: 'T102',
        name: 'Invalid Marks',
        age: '19',
        matricMarks: '105',
        intermediateMarks: '80',
        entryTest: '75',
        program: 'BSSE',
        feePaid: 'true'
    },
    {
        id: 'T103',
        name: 'Unsupported Program',
        age: '20',
        matricMarks: '80',
        intermediateMarks: '85',
        entryTest: '90',
        program: 'BSIT',
        feePaid: 'true'
    },
    {
        id: 'T104',
        name: 'Low Entry Test',
        age: '21',
        matricMarks: '90',
        intermediateMarks: '90',
        entryTest: '55',
        program: 'BSAI',
        feePaid: 'true'
    },
    {
        id: 'T105',
        name: 'Waiting Applicant',
        age: '22',
        matricMarks: '70',
        intermediateMarks: '70',
        entryTest: '80',
        program: 'BSCS',
        feePaid: 'true'
    }
];

const testResults = processAllApplicants(testApplicants);

console.log('\n========== ADDITIONAL TEST CASES ==========');

for (const applicant of testResults) {
    console.log({
        id: applicant.id,
        name: applicant.name,
        merit: applicant.merit,
        status: applicant.status,
        errors: applicant.errors
    });
}

