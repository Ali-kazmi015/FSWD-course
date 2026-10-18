'use strict';

// =============================================
// 1. ORIGINAL STUDENT RESULTS
// =============================================

const results = [
    { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
    { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
    { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
    { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
    { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
    { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 }
];


// =============================================
// 2. GRADING POLICY
// =============================================

// Assumption: the institution uses a 4.0 GPA scale.
// The question provides letter grades but does not
// specify their grade-point equivalents.

const gradePoints = {
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    F: 0.0
};


// =============================================
// 3. FUNCTION TO DETERMINE GRADE
// =============================================

function getGrade(marks) {

    if (marks >= 85) {
        return 'A';
    } else if (marks >= 80) {
        return 'A-';
    } else if (marks >= 75) {
        return 'B+';
    } else if (marks >= 70) {
        return 'B';
    } else if (marks >= 65) {
        return 'B-';
    } else if (marks >= 60) {
        return 'C+';
    } else if (marks >= 50) {
        return 'C';
    } else {
        return 'F';
    }
}


// =============================================
// 4. VALIDATE MARKS
// =============================================

function isValidMarks(marks) {
    return (
        typeof marks === 'number' &&
        Number.isFinite(marks) &&
        marks >= 0 &&
        marks <= 100
    );
}


// =============================================
// 5. PART A: RESULT PROCESSING
// =============================================

// map() creates a NEW array.
// It does not modify the original results array.

const processedResults = results.map(student => {

    // Invalid marks must not receive a normal grade.
    if (!isValidMarks(student.marks)) {
        return {
            ...student,
            grade: 'INVALID',
            status: 'INVALID DATA',
            gradePoints: null
        };
    }

    const grade = getGrade(student.marks);

    const status = student.marks >= 50
        ? 'PASS'
        : 'FAIL';

    const points = gradePoints[grade];

    return {
        ...student,
        grade: grade,
        status: status,
        gradePoints: points
    };
});

console.log('========== PART A: PROCESSED RESULTS ==========');
console.log(JSON.stringify(processedResults, null, 2));


// =============================================
// 6. PART B: RANKED MERIT LIST
// =============================================

// sort() modifies the array on which it is called.
// Therefore, use [...processedResults] to create a copy
// before sorting.

const meritList = [...processedResults].sort((a, b) => {

    // Valid marks should appear before invalid marks.
    const aValid = isValidMarks(a.marks);
    const bValid = isValidMarks(b.marks);

    if (aValid && !bValid) {
        return -1;
    }

    if (!aValid && bValid) {
        return 1;
    }

    // If both are invalid, sort by name.
    if (!aValid && !bValid) {
        return a.name.localeCompare(b.name);
    }

    // Sort marks in descending order.
    if (b.marks !== a.marks) {
        return b.marks - a.marks;
    }

    // If marks are equal, sort alphabetically.
    return a.name.localeCompare(b.name);
});

console.log('\n========== PART B: MERIT LIST ==========');
console.log(JSON.stringify(meritList, null, 2));


// =============================================
// 7. PART C: DEPARTMENT STATISTICS
// =============================================

// reduce() builds an object containing statistics
// for every department encountered.
//
// New departments, such as DS, are handled automatically.

const departmentStats = processedResults.reduce(
    (statistics, student) => {

        // Create a department entry if it does not exist.
        if (!statistics[student.department]) {
            statistics[student.department] = {
                students: 0,
                totalMarks: 0,
                average: null,
                highest: null,
                passed: 0,
                failed: 0
            };
        }

        const department = statistics[student.department];

        department.students++;

        // Only valid marks contribute to mark statistics.
        if (isValidMarks(student.marks)) {

            department.totalMarks += student.marks;

            if (
                department.highest === null ||
                student.marks > department.highest
            ) {
                department.highest = student.marks;
            }

            if (student.marks >= 50) {
                department.passed++;
            } else {
                department.failed++;
            }
        }

        return statistics;

    },
    {}
);


// Calculate averages after collecting department totals.
Object.values(departmentStats).forEach(department => {

    // Count only students with valid marks.
    const validStudents = processedResults.filter(student =>
        student.department in departmentStats &&
        isValidMarks(student.marks) &&
        departmentStats[student.department] === department
    );

    if (validStudents.length > 0) {
        department.average = Number(
            (department.totalMarks / validStudents.length).toFixed(2)
        );
    }

    // Remove the temporary calculation field.
    delete department.totalMarks;
});

console.log('\n========== PART C: DEPARTMENT STATISTICS ==========');
console.log(JSON.stringify(departmentStats, null, 2));


// =============================================
// 8. PART D: ACADEMIC QUERIES
// =============================================


// QUERY 1: First student scoring more than 85
// find() returns the first matching student.

const firstAbove85 = processedResults.find(student =>
    isValidMarks(student.marks) &&
    student.marks > 85
);

console.log('\n1. First student scoring more than 85:');
console.log(firstAbove85 ?? 'No student found');


// QUERY 2: Index of the first failed student
// findIndex() returns the index of the first match.
// It returns -1 if no match exists.

const firstFailedIndex = processedResults.findIndex(student =>
    student.status === 'FAIL'
);

console.log('\n2. Index of first failed student:');
console.log(firstFailedIndex);


// QUERY 3: Whether at least one student failed
// some() returns true if at least one item matches.

const atLeastOneFailed = processedResults.some(student =>
    student.status === 'FAIL'
);

console.log('\n3. At least one student failed:');
console.log(atLeastOneFailed);


// QUERY 4: Whether every student has valid marks
// every() returns true only when all items pass the test.

const everyStudentHasValidMarks = processedResults.every(student =>
    isValidMarks(student.marks)
);

console.log('\n4. Every student has valid marks:');
console.log(everyStudentHasValidMarks);


// QUERY 5: All students scoring above the overall average

// reduce() calculates the sum of valid marks.
const validStudents = processedResults.filter(student =>
    isValidMarks(student.marks)
);

const totalMarks = validStudents.reduce(
    (sum, student) => sum + student.marks,
    0
);

const overallAverage = validStudents.length > 0
    ? totalMarks / validStudents.length
    : null;

// filter() returns every student above the average.
const studentsAboveAverage = overallAverage === null
    ? []
    : processedResults.filter(student =>
        isValidMarks(student.marks) &&
        student.marks > overallAverage
    );

console.log('\n5. Overall average:');
console.log(
    overallAverage === null
        ? 'No valid marks'
        : Number(overallAverage.toFixed(2))
);

console.log('Students scoring above the average:');
console.log(JSON.stringify(studentsAboveAverage, null, 2));


// QUERY 6: Names of the top three students
// slice() creates a new array containing the first three items.
// It does not modify the meritList.

const topThreeStudents = meritList
    .filter(student => isValidMarks(student.marks))
    .slice(0, 3)
    .map(student => student.name);

console.log('\n6. Names of the top three students:');
console.log(topThreeStudents);


// =============================================
// 9. EXTRA: DEMONSTRATE forEach()
// =============================================

// forEach() performs an action for every item.
// It does not create a new array of results.

console.log('\n========== forEach() DEMONSTRATION ==========');

processedResults.forEach(student => {
    console.log(
        `${student.name}: ${student.marks} marks, ` +
        `Grade ${student.grade}, ${student.status}`
    );
});


// =============================================
// 10. PROVE ORIGINAL ARRAY WAS NOT MODIFIED
// =============================================

console.log('\n========== ORIGINAL ARRAY CHECK ==========');

console.log(
    'Original results still contain only the original fields:',
    !Object.hasOwn(results[0], 'grade')
);

console.log(
    'Original first student:',
    results[0]
);