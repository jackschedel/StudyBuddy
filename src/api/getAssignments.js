// Your Canvas API URL
const UflApiUrl = 'https://ufl.instructure.com/api/v1/';
const PbscApiUrl = 'https://palmbeachstate.instructure.com/api/v1/';

// Your Canvas API Token for authentication
const UFL_API_KEY = "1016~Q57LX8lIdvUKXdk07DtEWZCcH2dqquT8fJEbAQ8sv7bqlqJu9EnZRCIwPuHaAZh9"
const PBSC_API_KEY = "3~JpiAAGvL8vwLSeCJ4OfvwEPFv0DhLDK10KndtukGHFJbshNRBFzacQGURPsgcacs"

// Function to fetch courses
async function fetchCourses() {
    const response = await fetch(`${PbscApiUrl}courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PBSC_API_KEY}`
      }
    });
    return await response.json();
  }
  
  // Function to fetch assignments for a given course
  async function fetchAssignments(courseId) {
    const response = await fetch(`${PbscApiUrl}courses/${courseId}/assignments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PBSC_API_KEY}`
      }
    });
    return await response.json();
  }
  
  async function fetchQuizzes(courseId) {
    const response = await fetch(`${PbscApiUrl}courses/${courseId}/quizzes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PBSC_API_KEY}`
      }
    });
    return await response.json();
  }

  async function fetchTests(courseId) {
    const response = await fetch(`${PbscApiUrl}courses/${courseId}/quizzes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PBSC_API_KEY}`
      }
    });
    return await response.json();
  }
  async function fetchAllAssignments() {
    const courses = await fetchCourses();
    for (const course of courses) {
        console.log(`Course: ${course.name}`);
      const assignments = await fetchAssignments(course.id);
      console.log(assignments);
      try {
        for (const assignment of assignments) {
            console.log(`Course: ${course.name}, : ${assignment.name}`);
        }
        } catch (error) {
        console.log("no quizzes");
        }
    }
  }
  // Main function to fetch all assignments from all courses
  async function fetchAllQuizzes() {
    const courses = await fetchCourses();
    for (const course of courses) {
        console.log(`Course: ${course.name}`);
      const quizzes = await fetchQuizzes(course.id);
      console.log(quizzes);
      try {
        for (const quiz of quizzes) {
            console.log(`Course: ${course.name}, : ${quiz.due_at}`);
        }
        } catch (error) {
        console.log("no quizzes");
        }
    }
  }
  async function fetchAllTests() {
    const courses = await fetchCourses();
    for (const course of courses) {
        console.log(`Course: ${course.name}`);
      const tests = await fetchTests(course.id);
      console.log(tests);
      try {
        for (const test of tests) {
            console.log(`Course: ${course.name}, : ${test.due_at}`);
        }
        } catch (error) {
        console.log("no tests");
        }
    }
  }
  // Execute the main function
  fetchAllAssignments().catch(error => {
    console.error('Error fetching assignments:', error);
  });

async function fetchAll(){
    const tests = await fetchAllTests();
    const quizzes = await fetchAllQuizzes();
    const assignments = await fetchAllAssignments();
    
    const newList = [];
    for (const test of tests) {
        newList.push(test);
    }
    for (const quiz of quizzes) {
        newList.push(quiz);
    }
    for (const assignment of assignments) {
        newList.push(assignment);
    }

    // sort by due date here
    newList.sort(function(a,b){
        return new Date(a.due_at) - new Date(b.due_at);
    });
    console.log(newList);
}

export { fetchCourses, fetchAssignments };
