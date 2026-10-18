'use strict';

class Person {
constructor(name, email) {
this.name = name;
this.email = email;
}


introduce() {
    return `Hello, my name is ${this.name}. My email is ${this.email}.`;
}


}

class Student extends Person {
constructor(name, email, rollNo, marks) {
super(name, email);
this.rollNo = rollNo;
this.marks = marks;
}


introduce() {
    const parentIntroduction = super.introduce();
    return `${parentIntroduction} I am a student. My roll number is ${this.rollNo}.`;
}

getResult() {
    if (
        typeof this.marks !== 'number' ||
        !Number.isFinite(this.marks) ||
        this.marks < 0 ||
        this.marks > 100
    ) {
        return 'Invalid marks';
    }

    return this.marks >= 50 ? 'PASS' : 'FAIL';
}


}

class FacultyMember extends Person {
constructor(name, email, employeeId, department) {
super(name, email);
this.employeeId = employeeId;
this.department = department;
}


introduce() {
    const parentIntroduction = super.introduce();
    return `${parentIntroduction} I am a faculty member. My employee ID is ${this.employeeId}, and I work in the ${this.department} department.`;
}


}

const student1 = new Student(
'Ali',
'[ali@university.edu](mailto:ali@university.edu)',
'CS-101',
85
);

const student2 = new Student(
'Sara',
'[sara@university.edu](mailto:sara@university.edu)',
'CS-102',
42
);

const faculty1 = new FacultyMember(
'Dr. Ahmed',
'[ahmed@university.edu](mailto:ahmed@university.edu)',
'EMP-501',
'Computer Science'
);

const faculty2 = new FacultyMember(
'Dr. Hina',
'[hina@university.edu](mailto:hina@university.edu)',
'EMP-502',
'Artificial Intelligence'
);

const users = [
student1,
faculty1,
student2,
faculty2
];

console.log('========== USER INTRODUCTIONS ==========');

users.forEach(user => console.log(user.introduce()));

console.log('\n========== STUDENT RESULTS ==========');

console.log(`${student1.name}: ${student1.getResult()}`);
console.log(`${student2.name}: ${student2.getResult()}`);

console.log('\n========== instanceof CHECKS ==========');

console.log('student1 instanceof Student:', student1 instanceof Student);
console.log('student1 instanceof Person:', student1 instanceof Person);
console.log('faculty1 instanceof FacultyMember:', faculty1 instanceof FacultyMember);
console.log('faculty1 instanceof Person:', faculty1 instanceof Person);
console.log('student1 instanceof FacultyMember:', student1 instanceof FacultyMember);

const guest = {
name: 'Dr. Ahmed',
email: '[ahmed@example.com](mailto:ahmed@example.com)'
};

console.log('\n========== call() CHALLENGE ==========');

console.log(Person.prototype.introduce.call(guest));

console.log('\n========== DETACHED METHOD CHALLENGE ==========');

const fn = student1.introduce;

try {
console.log(fn());
} catch (error) {
console.log('Detached method error:', error.message);
}

console.log('\n========== bind() CHALLENGE ==========');

const boundIntroduction = student1.introduce.bind(student1);

console.log(boundIntroduction());

console.log('\n========== call() WITH ANOTHER OBJECT ==========');

const anotherGuest = {
name: 'Professor Usman',
email: '[usman@example.com](mailto:usman@example.com)',
rollNo: 'SE-202'
};

console.log(Student.prototype.introduce.call(anotherGuest));
