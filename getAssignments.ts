interface Course {
  id: number;
  name: string;
}

interface Assignment {
  name: string;
  // Add other fields as needed
}

interface Quiz {
due_at: string;
// Add other fields as needed
}

interface Test {
due_at: string;
// Add other fields as needed
}

// Your Canvas API URL and Token
const UflApiUrl = 'https://ufl.instructure.com/api/v1/';
const PbscApiUrl = 'https://palmbeachstate.instructure.com/api/v1/';
const UFL_API_KEY = "1016~Q57LX8lIdvUKXdk07DtEWZCcH2dqquT8fJEbAQ8sv7bqlqJu9EnZRCIwPuHaAZh9";
const PBSC_API_KEY = "3~JpiAAGvL8vwLSeCJ4OfvwEPFv0DhLDK10KndtukGHFJbshNRBFzacQGURPsgcacs";

// Function to fetch courses
async function fetchCourses(): Promise<Course[]> {
const response = await fetch(`${PbscApiUrl}courses`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PBSC_API_KEY}`
  }
});
return await response.json();
}

// Function to fetch assignments for a given course
async function fetchAssignments(courseId: number): Promise<Assignment[]> {
const response = await fetch(`${PbscApiUrl}courses/${courseId}/assignments`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PBSC_API_KEY}`
  }
});
return await response.json();
}

// Function to fetch quizzes for a given course
async function fetchQuizzes(courseId: number): Promise<Quiz[]> {
const response = await fetch(`${PbscApiUrl}courses/${courseId}/quizzes`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PBSC_API_KEY}`
  }
});
return await response.json();
}

// Function to fetch tests for a given course
async function fetchTests(courseId: number): Promise<Test[]> {
const response = await fetch(`${PbscApiUrl}courses/${courseId}/quizzes`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${PBSC_API_KEY}`
  }
});
return await response.json();
}

// Main function to fetch all assignments from all courses
async function fetchAllAssignments(): Promise<void> {
const courses = await fetchCourses();
for (const course of courses) {
  console.log(`Course: ${course.name}`);
  const assignments = await fetchAssignments(course.id);
  console.log(assignments);
  try {
    for (const assignment of assignments) {
      console.log(`Course: ${course.name}, Assignment: ${assignment.name}`);
    }
  } catch (error) {
    console.log("No assignments");
  }
}
}

// Main function to fetch all quizzes from all courses
async function fetchAllQuizzes(): Promise<void> {
const courses = await fetchCourses();
for (const course of courses) {
  console.log(`Course: ${course.name}`);
  const quizzes = await fetchQuizzes(course.id);
  console.log(quizzes);
  try {
    for (const quiz of quizzes) {
      console.log(`Course: ${course.name}, Quiz Due At: ${quiz.due_at}`);
    }
  } catch (error) {
    console.log("No quizzes");
  }
}
}

// Main function to fetch all tests from all courses
async function fetchAllTests(): Promise<void> {
const courses = await fetchCourses();
for (const course of courses) {
  console.log(`Course: ${course.name}`);
  const tests = await fetchTests(course.id);
  console.log(tests);
  try {
    for (const test of tests) {
      console.log(`Course: ${course.name}, Test Due At: ${test.due_at}`);
    }
  } catch (error) {
    console.log("No tests");
  }
}
}

// Main function to fetch all
async function fetchAll(): Promise<void> {
const tests = await fetchAllTests();
const quizzes = await fetchAllQuizzes();
const assignments = await fetchAllAssignments();

const newList: (Test | Quiz | Assignment)[] = [];

for (const test of tests) {
  newList.push(test);
}
for (const quiz of quizzes) {
  newList.push(quiz);
}
for (const assignment of assignments) {
  newList.push(assignment);
}

// Sort by due date
newList.sort(function(a: any, b: any) {
  return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
});

console.log(newList);
}

// Execute the main function
fetchAllAssignments().catch(error => {
console.error('Error fetching assignments:', error);
});